import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
