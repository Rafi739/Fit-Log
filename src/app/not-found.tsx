import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center">

        <h1 className="text-8xl font-bold text-purple-500">
          404
        </h1>

        <h2 className="text-3xl font-bold text-white mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 mt-4">
          Oops! The page you are looking for does not exist.
        </p>

        <div className="flex justify-center gap-4 mt-8">

          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            ← Back to Home
          </Link>

          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition"
          >
            Go Back
          </Link>

        </div>

      </div>
    </main>
  );
};

export default NotFoundPage;