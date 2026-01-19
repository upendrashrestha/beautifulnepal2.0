import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-black text-center">
            <h1 className="text-5xl font-extrabold mb-4">
                Oops! Lost in the mountains 🏔️
            </h1>
            <p className="mb-6 text-lg">
                Looks like the trail you tried to follow doesn&apos;t exist. But hey,
                there&apos;s a whole world to explore!
            </p>
            <p className="mb-6 text-md text-gray-600">
                Discover amazing destinations, plan your next adventure, or just relax
                and enjoy the view.
            </p>
            <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
                Take me home
            </Link>
        </div>
    );
}
