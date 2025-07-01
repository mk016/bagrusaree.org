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
    console.log("Received order data:", data);

    const {
      customer: { name, email, phone, address },
      items,
      pricing: { subtotal, shipping, tax, total },
      paymentMethod,
      upiId,
    } = data;

    // Check if customer already exists based on email, or create a new one
    let customer = await prisma.customer.findUnique({
      where: { email: email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: email,
          fullName: name,
        },
      });
    }

    // Create address for shipping and billing (assuming they are the same for now based on form)
    // In a real application, you'd likely have separate shipping/billing addresses
    const newAddress = await prisma.address.create({
      data: {
        customerID: customer.id,
        houseNo: address.split(',')[0]?.trim() || '', // Basic parsing, refine as needed
        streetName: address.split(',')[1]?.trim() || '', // Basic parsing, refine as needed
        societyName: '', // Not captured in current form
        area: '', // Not captured in current form
        pincode: parseInt(data.customer.address.split('-')[1]?.trim() || '0'), // Basic parsing
        city: data.customer.address.split(',').slice(-3, -2)[0]?.trim() || '', // Basic parsing
        district: '', // Not captured in current form
        state: data.customer.address.split(',').slice(-2, -1)[0]?.trim() || '', // Basic parsing
      },
    });

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        total: total,
        subtotal: subtotal,
        tax: tax,
        shippingCost: shipping,
        status: 'pending', // Initial status
        shippingAddressId: newAddress.id,
        billingAddressId: newAddress.id, // Assuming same for now
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
        trackingNumber: null,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id, // Assuming item.id is productId
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
    });

    return NextResponse.json({ message: 'Order placed successfully', orderId: order.id }, { status: 200 });
  } catch (error: any) {
    console.error('Error placing order:', error.message, error.stack, error);
    return NextResponse.json({ message: 'Failed to place order', error: error.message }, { status: 500 });
  }
} 