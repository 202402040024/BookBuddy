import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Admin access required" }, { status: 403 });
  }

  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
  return Response.json(users);
}
