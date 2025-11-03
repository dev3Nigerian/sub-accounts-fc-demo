import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  id: string;
  text: string;
  authorAddress: string | null;
  timestamp: Date;
  likesCount: number;
  tipsCount: number;
  totalTipsAmount: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    text: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    authorAddress: {
      type: String,
      required: false,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    tipsCount: {
      type: Number,
      default: 0,
    },
    totalTipsAmount: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
PostSchema.index({ timestamp: -1 });
PostSchema.index({ createdAt: -1 });

// Transform _id to id in JSON responses
PostSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;


