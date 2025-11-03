import connectDB from "./mongodb";
import Post, { IPost } from "@/models/Post";

export interface AnonymousPost {
  id: string;
  text: string;
  authorAddress: `0x${string}` | null;
  timestamp: string;
  likesCount: number;
  tipsCount: number;
  totalTipsAmount: string;
}

// Convert MongoDB document to AnonymousPost
function docToPost(doc: IPost): AnonymousPost {
  return {
    id: doc.id || (doc._id as unknown as string).toString(),
    text: doc.text,
    authorAddress: doc.authorAddress as `0x${string}` | null,
    timestamp: doc.timestamp.toISOString(),
    likesCount: doc.likesCount,
    tipsCount: doc.tipsCount,
    totalTipsAmount: doc.totalTipsAmount,
  };
}

class PostsStorage {
  async createPost(
    text: string,
    authorAddress: `0x${string}` | null = null
  ): Promise<AnonymousPost> {
    await connectDB();

    const post = new Post({
      text,
      authorAddress,
      timestamp: new Date(),
      likesCount: 0,
      tipsCount: 0,
      totalTipsAmount: "0",
    });

    const savedPost = await post.save();
    return docToPost(savedPost);
  }

  async getPosts(
    limit: number = 15,
    cursor?: string
  ): Promise<{
    posts: AnonymousPost[];
    nextCursor: string | null;
  }> {
    await connectDB();

    const query: any = {};
    if (cursor) {
      try {
        // Find posts created before the cursor post's creation date
        const cursorPost = await Post.findById(cursor);
        if (cursorPost) {
          query.createdAt = { $lt: cursorPost.createdAt };
        } else {
          // If cursor post not found, treat as invalid cursor and ignore
          console.warn(`Invalid cursor: ${cursor}`);
        }
      } catch (error) {
        // Invalid cursor format, ignore it
        console.warn(`Error parsing cursor: ${cursor}`, error);
      }
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .exec();

    const hasMore = posts.length > limit;
    const resultPosts = hasMore ? posts.slice(0, limit) : posts;

    return {
      posts: resultPosts.map(docToPost),
      nextCursor: hasMore && resultPosts.length > 0
        ? resultPosts[resultPosts.length - 1].id
        : null,
    };
  }

  async getPost(id: string): Promise<AnonymousPost | null> {
    await connectDB();

    try {
      const post = await Post.findById(id);
      return post ? docToPost(post) : null;
    } catch (error) {
      return null;
    }
  }

  async incrementTips(postId: string, amount: string): Promise<void> {
    await connectDB();

    try {
      console.log(`[DB] Looking for post with ID: ${postId}`);
      const post = await Post.findById(postId);
      if (!post) {
        console.error(`[DB] Post not found with ID: ${postId}`);
        throw new Error(`Post not found with ID: ${postId}`);
      }

      console.log(`[DB] Post found. Current tipsCount: ${post.tipsCount}, totalTipsAmount: ${post.totalTipsAmount}`);

      post.tipsCount = (post.tipsCount || 0) + 1;
      const currentAmount = parseFloat(post.totalTipsAmount || "0");
      post.totalTipsAmount = (currentAmount + parseFloat(amount)).toFixed(6);

      console.log(`[DB] Updating to tipsCount: ${post.tipsCount}, totalTipsAmount: ${post.totalTipsAmount}`);

      await post.save();

      console.log(`[DB] Post saved successfully`);
    } catch (error) {
      console.error("[DB] Error incrementing tips:", error);
      throw error;
    }
  }

  async likePost(postId: string): Promise<void> {
    await connectDB();

    try {
      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: 1 },
      });
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  }
}

// Singleton instance
let storageInstance: PostsStorage | null = null;

export function getPostsStorage(): PostsStorage {
  if (!storageInstance) {
    storageInstance = new PostsStorage();
  }
  return storageInstance;
}
