import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <Image
        src="/logo-icon.svg"
        alt="Sudonex"
        width={36}
        height={36}
        className="group-hover:scale-105 transition-transform"
      />
      <span className="font-display font-bold text-xl tracking-tight lowercase">
        <span className="text-white">sudo </span>
        <span className="text-brand-500">nex</span>
      </span>
    </Link>
  );
}
