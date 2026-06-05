import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    status: { type: String, default: "Available" },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);