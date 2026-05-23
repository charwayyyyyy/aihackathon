'use client';

import { useAuthStore, Role } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const role = useAuthStore((state) => state.role);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !allowedRoles.includes(role)) {
      router.push('/');
    }
  }, [role, allowedRoles, router, isMounted]);

  if (!isMounted) return null; // Avoid hydration mismatch

  if (!allowedRoles.includes(role)) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
