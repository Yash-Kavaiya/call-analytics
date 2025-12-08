import { NextAuthOptions } from 'next-auth';

console.log("--> AUTH LIB LOADED <--");

import CredentialsProvider from 'next-auth/providers/credentials';
import { adminAuth, adminDb } from './firebase-admin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
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
        console.log("--> AUTHORIZE CALLED WITH:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {

          throw new Error('Email and password are required');
        }

        try {
          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const firebaseUser = userCredential.user;

          // Get user data from Firestore
          const userDoc = await adminDb.collection('users').doc(firebaseUser.uid).get();

          if (!userDoc.exists) {
            throw new Error('User not found in database');
          }

          const userData = userDoc.data() as User;

          // Get organization data
          const orgDoc = await adminDb.collection('organizations').doc(userData.organizationId).get();

          if (!orgDoc.exists) {
            throw new Error('Organization not found');
          }

          const orgData = orgDoc.data() as Organization;

          // Return session user
          return {
            id: firebaseUser.uid,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            role: userData.role,
            organizationId: userData.organizationId,
            organizationName: orgData.name,
            plan: orgData.plan,
          };
        } catch (error: unknown) {
          console.error('Auth error:', error);
          if (error instanceof Error) {
            if (error.message.includes('auth/invalid-credential') ||
              error.message.includes('auth/wrong-password') ||
              error.message.includes('auth/user-not-found')) {
              throw new Error('Invalid email or password');
            }
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
