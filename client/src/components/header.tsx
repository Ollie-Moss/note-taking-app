import { Link } from "react-router";

export default function Header() {
    return (
        <header className="bg-bg shadow">
            <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Notes</h1>
                <nav className="space-x-4">
                    <Link to="/auth/login" className="text-white hover:text-gray-400">Login</Link>
                    <Link to="/auth/signup" className="text-white hover:text-gray-400">Sign Up</Link>
                </nav>
            </div>
        </header>
    )
}
