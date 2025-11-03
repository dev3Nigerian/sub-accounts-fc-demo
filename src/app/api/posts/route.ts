import { NextRequest, NextResponse } from "next/server";
import { getPostsStorage } from "@/lib/posts-storage";
import { isAddress } from "viem";

// Convert anonymous post to the format expected by the frontend
const anonymousPostToPost = (post: import("@/lib/posts-storage").AnonymousPost) => {
  return {
    id: post.id,
    text: post.text,
    timestamp: post.timestamp,
    author: {
      name: post.authorAddress ? `${post.authorAddress.slice(0, 6)}...${post.authorAddress.slice(-4)}` : "Anonymous",
      display_name: post.authorAddress ? `${post.authorAddress.slice(0, 6)}...${post.authorAddress.slice(-4)}` : "Anonymous",
      username: post.authorAddress ? `user_${post.authorAddress.slice(2, 8)}` : "anonymous",
      pfp_url: "",
      power_badge: false,
      custody_address: post.authorAddress || ("0x0000000000000000000000000000000000000000" as `0x${string}`),
      verified_addresses: {
        eth_addresses: post.authorAddress ? [post.authorAddress] : [],
        sol_addresses: [],
      },
    },
    embeds: [],
    reactions: {
      likes_count: post.likesCount,
      recasts_count: 0,
    },
    replies: {
      count: 0,
    },
    // Custom fields for anonymous posts
    tipsCount: post.tipsCount,
    totalTipsAmount: post.totalTipsAmount,
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;

    const storage = getPostsStorage();
    const { posts, nextCursor } = await storage.getPosts(15, cursor);

    return NextResponse.json({
      posts: posts.map(anonymousPostToPost),
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, authorAddress } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Post text is required" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Post text is too long (max 10000 characters)" },
        { status: 400 }
      );
    }

    // Validate address if provided
    let validAddress: `0x${string}` | null = null;
    if (authorAddress) {
      if (typeof authorAddress !== "string" || !isAddress(authorAddress)) {
        return NextResponse.json(
          { error: "Invalid Ethereum address" },
          { status: 400 }
        );
      }
      validAddress = authorAddress as `0x${string}`;
    }

    const storage = getPostsStorage();
    const post = await storage.createPost(text.trim(), validAddress);

    return NextResponse.json({
      post: anonymousPostToPost(post),
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
