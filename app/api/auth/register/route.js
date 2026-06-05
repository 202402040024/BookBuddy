import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await connectDB();
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return Response.json({ message: "All fields are required" }, { status: 400 });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return Response.json({ message: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  return Response.json(
    { message: "Account created successfully", user: { id: user._id, name: user.name, email: user.email } },
    { status: 201 }
  );
}
