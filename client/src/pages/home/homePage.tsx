import { Link } from "react-router";
import Header from "../../components/header";

// Home page
// Main header
// Quick link to note creation
// Marketing copy
export default function Home() {
    return (
        <div className="min-h-full bg-bg text-white flex flex-col">
            <Header />
            <main className="flex flex-col h-full items-center justify-center text-center py-20 lg:py-32 px-4">
                <h2 className="text-lg lg:text-xl font-extrabold mb-4">
                    Your Notes, Organized.
                </h2>
                <p className="text-md text-gray-400 mb-8">
                    Create, edit, and manage your notes with ease. All in one place.
                </p>
                <Link to="/auth/signup" className="px-6 py-3 bg-white text-bg-dark rounded-lg shadow-md hover:bg-gray-400 transition" >
                    Create Your First Note
                </Link>
            </main>
        </div>
    )
}
