import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatCurrency, safeDecimal } from "@/lib/utils";

export const dynamic = 'force-dynamic';

// GET user orders
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Build query
    let query: any = {
      customerId: customer.id,
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    // Get orders with all related data
    const orders = await prisma.order.findMany({
      where: query,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalOrders = await prisma.order.count({
      where: query,
    });

    // Format orders for frontend
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: `ORD-${order.id.substring(0, 8).toUpperCase()}`,
      date: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: safeDecimal(order.total),
      subtotal: safeDecimal(order.subtotal),
      tax: safeDecimal(order.tax),
      shipping: safeDecimal(order.shipping),
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: safeDecimal(item.price),
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        images: item.product.imagesUrl || [],
        category: item.product.category,
      })),
      shippingAddress: {
        id: order.shippingAddress.id,
        name: `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim(),
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        company: order.shippingAddress.company,
        address1: order.shippingAddress.address1,
        address2: order.shippingAddress.address2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone,
        // Legacy fields
        houseNo: order.shippingAddress.houseNo,
        streetName: order.shippingAddress.streetName,
        societyName: order.shippingAddress.societyName,
        area: order.shippingAddress.area,
        pincode: order.shippingAddress.pincode,
        district: order.shippingAddress.district,
      },
      billingAddress: {
        id: order.billingAddress.id,
        name: `${order.billingAddress.firstName || ''} ${order.billingAddress.lastName || ''}`.trim(),
        firstName: order.billingAddress.firstName,
        lastName: order.billingAddress.lastName,
        company: order.billingAddress.company,
        address1: order.billingAddress.address1,
        address2: order.billingAddress.address2,
        city: order.billingAddress.city,
        state: order.billingAddress.state,
        zipCode: order.billingAddress.zipCode,
        country: order.billingAddress.country,
        phone: order.billingAddress.phone,
        // Legacy fields
        houseNo: order.billingAddress.houseNo,
        streetName: order.billingAddress.streetName,
        societyName: order.billingAddress.societyName,
        area: order.billingAddress.area,
        pincode: order.billingAddress.pincode,
        district: order.billingAddress.district,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total: totalOrders,
        limit,
        offset,
        hasMore: offset + limit < totalOrders,
      },
    });

  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { 
        error: "Error fetching orders", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
