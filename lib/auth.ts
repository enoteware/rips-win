import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = process.env.ADMIN_EMAIL;
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!email || !hash) {
          console.error('[DB-ERROR] Admin credentials not configured (ADMIN_EMAIL, ADMIN_PASSWORD_HASH)');
          return null;
        }
        const envEmail = email.trim();
        const envHash = hash.replace(/^["']|["']$/g, '').trim();
        const emailMatch = credentials.email.trim() === envEmail;
        const ok = await bcrypt.compare(credentials.password, envHash);
        if (!emailMatch) return null;
        if (!ok) return null;
        return { id: 'admin', email: envEmail, name: 'Admin' };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  pages: { signIn: '/admin/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.email = token.email as string;
      return session;
    },
  },
};
