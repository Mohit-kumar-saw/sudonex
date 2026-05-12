import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="min-h-[60vh] grid place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-7xl font-bold bg-gradient-to-br from-brand-300 to-cyan-300 bg-clip-text text-transparent mb-4">404</p>
        <h1 className="font-display text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-ink-muted mb-6">That page doesn't exist on Sudonex. Try one of our service hubs instead.</p>
        <Link href="/" className="btn-primary">Back to home</Link>
      </div>
    </section>
  );
}
