import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Book from "@/models/Book";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return Response.json({ message: "bookId required" }, { status: 400 });
  }

  const reviews = await Review.find({ bookId }).sort({ createdAt: -1 });
  return Response.json(reviews);
}

export async function POST(request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Login required to submit a review" }, { status: 401 });
  }

  const { bookId, rating, review } = await request.json();

  if (!bookId || !rating || !review) {
    return Response.json({ message: "All fields are required" }, { status: 400 });
  }

  const existing = await Review.findOne({ bookId, userId: session.user.id });
  if (existing) {
    return Response.json({ message: "You have already reviewed this book" }, { status: 400 });
  }

  const newReview = await Review.create({
    bookId,
    userId: session.user.id,
    userName: session.user.name,
    rating: Number(rating),
    review,
  });

  // Recalculate average rating
  const allReviews = await Review.find({ bookId });
  const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await Book.findByIdAndUpdate(bookId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: allReviews.length,
  });

  return Response.json(newReview, { status: 201 });
}
