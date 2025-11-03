"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePost() {
  const account = useAccount();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) {
      toast.error("Post cannot be empty", {
        description: "Please write something before posting",
      });
      return;
    }

    if (text.length > 10000) {
      toast.error("Post is too long", {
        description: "Maximum 10000 characters allowed",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          authorAddress: account.address || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create post");
      }

      toast.success("Post created!", {
        description: "Your post has been added to the feed",
      });

      setText("");
      setIsDialogOpen(false);
      
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create post";
      toast.error("Error creating post", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [text, account.address, queryClient]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Anonymous Post</DialogTitle>
          <DialogDescription>
            {account.address
              ? `Posting as ${account.address.slice(0, 6)}...${account.address.slice(-4)}. You'll be able to receive tips at this address.`
              : "Post anonymously. Connect your wallet if you want to receive tips."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full min-h-[200px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="What's on your mind? Share your thoughts anonymously..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={10000}
              disabled={isSubmitting}
            />
            <div className="text-right text-xs text-muted-foreground mt-1">
              {text.length}/10000
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsDialogOpen(false);
              setText("");
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !text.trim()}>
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


