import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

// Ensure this route is not statically analyzed
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if environment variables are available
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    
    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: "ImageKit not configured" },
        { status: 500 }
      );
    }

    // Your application logic to authenticate the user
    // For example, check if the user is logged in or has admin permissions
    
    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return NextResponse.json({ 
      token, 
      expire, 
      signature, 
      publicKey 
    });
  } catch (error) {
    console.error("Error generating ImageKit auth params:", error);
    return NextResponse.json(
      { error: "Error generating auth parameters" },
      { status: 500 }
    );
  }
} 