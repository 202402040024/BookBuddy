import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PUT(request, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ message: "Login required." }, { status: 401 });

  const { id } = await params;
  const body   = await request.json();
  const isAdmin = session.user.role === "admin";

  // Non-admins can only update their own profile (name, bio, avatar)
  if (!isAdmin && session.user.id !== id) {
    return Response.json({ message: "Access denied." }, { status: 403 });
  }

  const updateData = {};

  if (body.name)   updateData.name   = body.name;
  if (body.bio)    updateData.bio    = body.bio;
  if (body.avatar) updateData.avatar = body.avatar;

  // Only admin can change roles
  if (isAdmin && body.role) updateData.role = body.role;

  // Password update (admin or own profile)
  if (body.password) {
    if (body.password.length < 6) {
      return Response.json({ message: "Password must be at least 6 characters." }, { status: 400 });
    }
    updateData.password = await bcrypt.hash(body.password, 12);
  }

  const updated = await User.findByIdAndUpdate(id, updateData, { new: true, projection: { password: 0 } });
  if (!updated) return Response.json({ message: "User not found." }, { status: 404 });

  return Response.json(updated);
}

export async function DELETE(request, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  await User.findByIdAndDelete(id);
  return Response.json({ message: "User deleted." });
}
