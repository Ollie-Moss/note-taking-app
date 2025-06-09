import { Link } from "react-router";
import Header from "../../components/header";

// 404 not found page
// Displayed when invalid url is provided
// Main header
// Navigation to home
export default function Error() {
    return (
        <div className="min-h-full bg-bg-dark text-white flex flex-col">
            <Header />
            <main className="flex flex-col h-full items-center justify-center text-center py-20 px-4">
                <h1 className="text-6xl font-bold text-white">404</h1>
                <p className="text-2xl mt-4 font-semibold text-gray-300">Page Not Found</p>
                <p className="mt-2 text-gray-400 text-center max-w-md">
                    Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or it never existed.
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-white text-bg-dark px-6 py-3 rounded-lg shadow hover:bg-gray-400 transition" >
                    Go Back Home
                </Link>
            </main>
        </div>
    );
}
