import SearchBox from "@/components/SearchBox";

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto width-100vh px-4 py-6">
      <h1 className="text-4xl font-bold text-center">Welcome to Beautiful Nepal</h1>
      <p className="mt-4 text-center">Your guide to treks, culture, and experiences across Nepal.</p>
      <div className="p-6">
        <SearchBox />
      </div>
    </div>
  );
}
