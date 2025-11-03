import { NextRequest, NextResponse } from "next/server";
import { getPostsStorage } from "@/lib/posts-storage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== "string") {
      return NextResponse.json(
        { error: "Tip amount is required" },
        { status: 400 }
      );
    }

    const storage = getPostsStorage();
    await storage.incrementTips(id, amount);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording tip:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

