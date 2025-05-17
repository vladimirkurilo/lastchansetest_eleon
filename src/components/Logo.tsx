
import Link from 'next/link';
import { Hotel } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-2xl font-bold text-primary ${className}`}>
      <Hotel className="h-8 w-8" />
      <span>ELEON</span>
    </Link>
  );
}
