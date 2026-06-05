import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";
  const filter = searchParams.get("filter") || "";
  const sort = searchParams.get("sort") || "newest";

  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }
  if (genre) query.genre = genre;
  if (filter === "featured") query.featured = true;
  if (filter === "bestseller") query.bestseller = true;
  if (filter === "newArrival") query.newArrival = true;

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    title: { title: 1 },
  };

  const books = await Book.find(query).sort(sortMap[sort] || { createdAt: -1 }).lean();
  return Response.json(books.map((b) => ({ ...b, _id: b._id.toString() })));
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();

  const book = await Book.create({
    title: body.title,
    author: body.author,
    genre: body.genre,
    description: body.description,
    coverImage: body.coverImage || "",
    rating: Number(body.rating || 0),
    price: Number(body.price || 0),
    status: body.status || "Available",
    featured: Boolean(body.featured),
    bestseller: Boolean(body.bestseller),
    newArrival: Boolean(body.newArrival),
  });

  return Response.json({ ...book.toObject(), _id: book._id.toString() }, { status: 201 });
}
