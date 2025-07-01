import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true, // Include customer data
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error.message, error.stack);
    return NextResponse.json({ message: 'Failed to fetch orders', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received order data:", JSON.stringify(data, null, 2));

    const {
      customer: { name, email, phone, address },
      items,
      pricing: { subtotal, shipping, tax, total },
      paymentMethod,
      upiId,
    } = data;

    // Validate required fields
    if (!email || !name || !address || !items || items.length === 0) {
      return NextResponse.json({ 
        message: 'Missing required fields: email, name, address, or items' 
      }, { status: 400 });
    }

    console.log("Creating/finding customer with email:", email);

    // Check if customer already exists based on email, or create a new one
    let customer = await prisma.customer.findUnique({
      where: { email: email },
    });

    if (!customer) {
      console.log("Creating new customer:", name);
      customer = await prisma.customer.create({
        data: {
          email: email,
          fullName: name,
        },
      });
    }

    console.log("Customer found/created:", customer.id);

    // Parse the address string - "address1, address2, city, state - zipcode"
    const addressParts = address.split(',').map((part: string) => part.trim());
    const lastPart = addressParts[addressParts.length - 1] || '';
    const stateAndZip = lastPart.split('-').map((part: string) => part.trim());
    
    const houseNo = addressParts[0] || '';
    const streetName = addressParts[1] || '';
    const city = addressParts[addressParts.length - 3] || '';
    const state = stateAndZip[0] || '';
    const zipcode = stateAndZip[1] ? parseInt(stateAndZip[1]) : 0;

    console.log("Parsed address:", { houseNo, streetName, city, state, zipcode });

    // Create address for shipping and billing (assuming they are the same for now based on form)
    const newAddress = await prisma.address.create({
      data: {
        customerID: customer.id,
        houseNo: houseNo,
        streetName: streetName,
        societyName: '', // Not captured in current form
        area: '', // Not captured in current form
        pincode: zipcode,
        city: city,
        district: '', // Not captured in current form
        state: state,
      },
    });

    console.log("Address created:", newAddress.id);

    // Validate that all items have productId
    const invalidItems = items.filter((item: any) => !item.productId);
    if (invalidItems.length > 0) {
      return NextResponse.json({ 
        message: 'Some items are missing productId',
        invalidItems 
      }, { status: 400 });
    }

    console.log("Creating order with items:", items.length);

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        total: Number(total),
        subtotal: Number(subtotal),
        tax: Number(tax),
        shippingCost: Number(shipping),
        status: 'pending', // Initial status
        shippingAddressId: newAddress.id,
        billingAddressId: newAddress.id, // Assuming same for now
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
        trackingNumber: null,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId, // Now we have the productId from the checkout form
            quantity: item.quantity,
            price: Number(item.price),
            size: item.size,
            color: item.color,
          })),
        },
      },
    });

    console.log("Order created successfully:", order.id);

    return NextResponse.json({ message: 'Order placed successfully', orderId: order.id }, { status: 200 });
  } catch (error: any) {
    console.error('Error placing order:', error.message, error.stack, error);
    
    // More specific error messages based on error type
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        message: 'Database constraint violation', 
        error: error.message 
      }, { status: 400 });
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        message: 'Related record not found', 
        error: error.message 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Failed to place order', 
      error: error.message,
      code: error.code 
    }, { status: 500 });
  }
} 