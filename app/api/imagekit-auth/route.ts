import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Your application logic to authenticate the user
  // For example, check if the user is logged in or has admin permissions
  
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  });

  return NextResponse.json({ 
    token, 
    expire, 
    signature, 
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY 
  });
} 