import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-slate-950">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 mb-3 text-2xl font-bold text-slate-700 dark:text-slate-300">
        404
      </div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        The requested resource or page does not exist or has been relocated.
      </p>
      <Link
        href="/dashboard"
        className="mt-5 inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
