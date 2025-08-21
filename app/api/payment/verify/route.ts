import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData 
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification parameters' },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const body_string = razorpay_order_id + '|' + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body_string.toString())
      .digest('hex');

    if (expected_signature !== razorpay_signature) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment signature verification failed' 
        },
        { status: 400 }
      );
    }

    // Payment is verified, now create the order in database
    try {
      // Create or find customer for guest checkout
      let customer;
      if (orderData.customer.email) {
        // Try to find existing customer by email
        customer = await prisma.customer.findUnique({
          where: { email: orderData.customer.email }
        });
        
        if (!customer) {
          // Create new customer with email
          customer = await prisma.customer.create({
            data: {
              fullName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
              displayName: orderData.customer.firstName,
              email: orderData.customer.email,
              isEmailVerified: false,
              isActive: true,
            }
          });
        }
      } else {
        // Create guest customer without email
        customer = await prisma.customer.create({
          data: {
            fullName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
            displayName: orderData.customer.firstName,
            email: null, // Guest checkout without email
            isEmailVerified: false,
            isActive: true,
          }
        });
      }

      // Create shipping address
      const shippingAddress = await prisma.address.create({
        data: {
          customerID: customer.id,
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          address1: orderData.customer.address1,
          address2: orderData.customer.address2 || '',
          city: orderData.customer.city,
          state: orderData.customer.state,
          zipCode: orderData.customer.zipCode,
          country: 'India',
          phone: orderData.customer.phone,
        }
      });

      // Create billing address (same as shipping for now)
      const billingAddress = await prisma.address.create({
        data: {
          customerID: customer.id,
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          address1: orderData.customer.address1,
          address2: orderData.customer.address2 || '',
          city: orderData.customer.city,
          state: orderData.customer.state,
          zipCode: orderData.customer.zipCode,
          country: 'India',
          phone: orderData.customer.phone,
        }
      });

      // Create order in database
      const dbOrder = await prisma.order.create({
        data: {
          customerId: customer.id,
          total: orderData.pricing.total,
          subtotal: orderData.pricing.subtotal,
          tax: orderData.pricing.tax,
          shipping: orderData.pricing.shipping,
          status: 'processing', // Order confirmed after payment
          paymentMethod: 'razorpay',
          paymentStatus: 'paid',
          shippingAddressId: shippingAddress.id,
          billingAddressId: billingAddress.id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          items: {
            create: orderData.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color,
            }))
          }
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
        }
      });

      // Record the payment transaction
      await prisma.paymentTransaction.create({
        data: {
          paymentId: razorpay_payment_id,
          customerId: customer.id,
          amount: Math.round(orderData.pricing.total * 100), // Convert to paise for consistency
          status: 'completed',
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified and order created successfully',
        order: {
          id: dbOrder.id,
          status: dbOrder.status,
          paymentStatus: dbOrder.paymentStatus,
          total: dbOrder.total,
        },
        paymentId: razorpay_payment_id,
      });

    } catch (dbError) {
      console.error('Error creating order in database:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment verified but failed to create order record',
          details: dbError instanceof Error ? dbError.message : 'Database error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
