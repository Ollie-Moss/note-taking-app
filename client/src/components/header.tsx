import { Link } from "react-router";

// Displays the main header including:
// Site title linked to homepage
// Navigation to login and sign up pages
export default function Header() {
    return (
        <header className="bg-bg shadow">
            {/* Wrapper, adds spacing & centers */}
            <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                {/* Site title linking to the home page */}
                <Link to="/">
                    <h1 className="text-2xl font-bold text-white">Notes</h1>
                </Link>
                {/* Navigation section with login and signup links */}
                <nav className="space-x-4">
                    <Link to="/auth/login" className="text-white hover:text-gray-400">Login</Link>
                    <Link to="/auth/signup" className="text-white hover:text-gray-400">Sign Up</Link>
                </nav>
            </div>
        </header>
    )
}
