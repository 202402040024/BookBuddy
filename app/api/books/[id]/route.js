import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request, { params }) {
  await connectDB();
  const { id } = await params;
  const book = await Book.findById(id).lean();
  if (!book) return Response.json({ message: "Book not found" }, { status: 404 });
  return Response.json({ ...book, _id: book._id.toString() });
}

export async function PUT(request, { params }) {
  // ── Admin only ───────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Admin access required." }, { status: 403 });
  }

  await connectDB();
  const { id } = await params;
  const body = await request.json();

  const updated = await Book.findByIdAndUpdate(
    id,
    {
      title:       body.title,
      author:      body.author,
      genre:       body.genre,
      description: body.description,
      coverImage:  body.coverImage  || "",
      rating:      Number(body.rating)  || 0,
      price:       Number(body.price)   || 0,
      status:      body.status      || "Available",
      featured:    Boolean(body.featured),
      bestseller:  Boolean(body.bestseller),
      newArrival:  Boolean(body.newArrival),
    },
    { new: true }
  );

  if (!updated) return Response.json({ message: "Book not found" }, { status: 404 });
  return Response.json({ ...updated.toObject(), _id: updated._id.toString() });
}

export async function DELETE(request, { params }) {
  // ── Admin only ───────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Admin access required." }, { status: 403 });
  }

  await connectDB();
  const { id } = await params;
  const deleted = await Book.findByIdAndDelete(id);
  if (!deleted) return Response.json({ message: "Book not found" }, { status: 404 });
  return Response.json({ message: "Deleted successfully" });
}
