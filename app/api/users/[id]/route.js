import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PUT(request, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Login required" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Users can only update their own profile; admins can update anyone
  if (session.user.id !== id && session.user.role !== "admin") {
    return Response.json({ message: "Access denied" }, { status: 403 });
  }

  const updateData = {
    name: body.name,
    bio: body.bio,
    avatar: body.avatar,
  };

  // Only admin can change roles
  if (session.user.role === "admin" && body.role) {
    updateData.role = body.role;
  }

  const updated = await User.findByIdAndUpdate(id, updateData, { new: true, projection: { password: 0 } });
  return Response.json(updated);
}

export async function DELETE(request, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  await User.findByIdAndDelete(id);
  return Response.json({ message: "User deleted" });
}
