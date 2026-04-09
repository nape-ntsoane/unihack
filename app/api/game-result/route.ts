import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Mock AWS Integration: Received Game Result", body);
    
    // Simulate AWS processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ 
      success: true, 
      message: "Result saved to AWS (mock)",
      received: body 
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
