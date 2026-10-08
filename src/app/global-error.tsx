"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-navy">
        <h1 className="font-display text-4xl font-bold text-gold">Critical Error</h1>
        <p className="mt-4 font-sans text-cream/80">
          {error.message || "A critical error occurred"}
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold-light"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
