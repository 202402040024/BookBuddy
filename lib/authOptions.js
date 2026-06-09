import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

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
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const email    = credentials.email.trim().toLowerCase();
          const password = credentials.password;

          // ── Hardcoded admin ──────────────────────────────────
          if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            return {
              id:     "admin_hardcoded",
              name:   "Admin",
              email:  ADMIN_EMAIL,
              role:   "admin",
              avatar: "",
            };
          }

          // ── Regular users from DB ────────────────────────────
          await connectDB();
          const user = await User.findOne({ email }).lean();
          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id:     user._id.toString(),
            name:   user.name,
            email:  user.email,
            role:   "user",
            avatar: user.avatar || "",
          };
        } catch (err) {
          console.error("authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id     = user.id;
        token.role   = user.role;
        token.avatar = user.avatar;
        token.name   = user.name;
        token.email  = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id     = token.id;
      session.user.role   = token.role;
      session.user.avatar = token.avatar;
      session.user.name   = token.name;
      session.user.email  = token.email;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
  session:  { strategy: "jwt" },
  secret:   process.env.NEXTAUTH_SECRET,
  debug:    process.env.NODE_ENV === "development",
};
