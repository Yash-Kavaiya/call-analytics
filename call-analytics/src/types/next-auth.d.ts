import { SessionUser } from '@/types';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: SessionUser;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: SessionUser['role'];
    organizationId: string;
    organizationName: string;
    plan: SessionUser['plan'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: SessionUser['role'];
    organizationId: string;
    organizationName: string;
    plan: SessionUser['plan'];
  }
}
