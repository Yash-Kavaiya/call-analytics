import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { adminAuth, adminDb } from './firebase-admin';
import { SessionUser, User, Organization } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Auth: Missing email or password');
          throw new Error('Email and password are required');
        }

        try {
          console.log('Auth: Attempting login for:', credentials.email);
          
          // Verify password using Firebase REST API first
          const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
          if (!apiKey) {
            console.error('Auth: NEXT_PUBLIC_FIREBASE_API_KEY is not configured');
            throw new Error('Server configuration error');
          }

          const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                returnSecureToken: true,
              }),
            }
          );

          const authData = await response.json();
          
          if (!response.ok || authData.error) {
            console.error('Auth: Firebase REST API error:', authData.error?.message || 'Unknown error');
            throw new Error('Invalid email or password');
          }

          console.log('Auth: Password verified successfully');
          const firebaseUid = authData.localId;

          // Get user data from Firestore
          console.log('Auth: Fetching user from Firestore:', firebaseUid);
          const userDoc = await adminDb.collection('users').doc(firebaseUid).get();

          if (!userDoc.exists) {
            console.error('Auth: User not found in Firestore:', firebaseUid);
            throw new Error('User profile not found. Please register again.');
          }

          const userData = userDoc.data() as User;
          console.log('Auth: User data found, org:', userData.organizationId);

          // Get organization data
          const orgDoc = await adminDb.collection('organizations').doc(userData.organizationId).get();

          if (!orgDoc.exists) {
            console.error('Auth: Organization not found:', userData.organizationId);
            throw new Error('Organization not found');
          }

          const orgData = orgDoc.data() as Organization;
          console.log('Auth: Login successful for:', credentials.email);

          // Return session user
          return {
            id: firebaseUid,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            role: userData.role,
            organizationId: userData.organizationId,
            organizationName: orgData.name,
            plan: orgData.plan,
          };
        } catch (error: unknown) {
          console.error('Auth error details:', error);
          if (error instanceof Error) {
            // Pass through our custom error messages
            throw new Error(error.message);
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {

        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.avatar = (user as SessionUser).avatar;
        token.role = (user as SessionUser).role;
        token.organizationId = (user as SessionUser).organizationId;
        token.organizationName = (user as SessionUser).organizationName;
        token.plan = (user as SessionUser).plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {

        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.avatar = token.avatar as string | undefined;
        session.user.role = token.role as SessionUser['role'];
        session.user.organizationId = token.organizationId as string;
        session.user.organizationName = token.organizationName as string;
        session.user.plan = token.plan as SessionUser['plan'];
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
