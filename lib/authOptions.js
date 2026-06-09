import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// ── Hardcoded admin credentials ──────────────────────────────
const ADMIN_EMAIL    = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email    = credentials.email?.trim().toLowerCase();
        const password = credentials.password;

        // ── Check hardcoded admin first ───────────────────────
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          return {
            id:     "admin",
            name:   "Admin",
            email:  ADMIN_EMAIL,
            role:   "admin",
            avatar: "",
          };
        }

        // ── Regular users from MongoDB ────────────────────────
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) throw new Error("No account found with this email.");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Incorrect password.");

        // Regular users can NEVER be admin (role is always "user")
        return {
          id:     user._id.toString(),
          name:   user.name,
          email:  user.email,
          role:   "user",          // always user — only hardcoded admin is admin
          avatar: user.avatar || "",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id     = user.id;
        token.role   = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id     = token.id;
        session.user.role   = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
  session: { strategy: "jwt" },
  secret:  process.env.NEXTAUTH_SECRET,

  // Auto-detect URL on Vercel
  ...(process.env.VERCEL_URL && !process.env.NEXTAUTH_URL
    ? { url: `https://${process.env.VERCEL_URL}` }
    : {}),
};
