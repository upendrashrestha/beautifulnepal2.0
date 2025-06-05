// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-black text-center">
            <h1 className="text-4xl font-bold mb-4">Oops!</h1>
            <p className="mb-6 text-lg">Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/" className="text-blue-600 hover:underline">
                Go back home
            </Link>
        </div>
    );
}
