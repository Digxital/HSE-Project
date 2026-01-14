import { ReactNode } from 'react';
import Header from './Header';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}