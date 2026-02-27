import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const password = credentials?.password as string;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
          throw new Error('ADMIN_PASSWORD environment variable is not set');
        }

        if (password === adminPassword) {
          return {
            id: 'admin',
            email: 'admin@camthoi.com',
            name: 'Admin',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days (per requirement R1)
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname.startsWith('/admin/login');

      // Allow access to login page without authentication
      if (isOnLogin) {
        return true;
      }

      // Protect all other admin routes
      if (isOnAdmin) {
        return isLoggedIn;
      }

      // Allow all other pages
      return true;
    },
  },
});
