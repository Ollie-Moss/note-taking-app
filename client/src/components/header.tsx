import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { userSelector } from "../selectors/userSelector";
import { AppDispatch } from "../store";
import { logout } from "../slices/userSlice";
import LoadingSpinner from "./spinner";

// Displays the main header including:
// Site title linked to homepage
// Navigation to login and sign up pages
export default function Header({ children }: Readonly<{ children?: React.ReactNode }>) {
    const { user, loading, error } = useSelector(userSelector);
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();

    return (
        <header className="bg-bg-dark shadow">
            {/* Wrapper, adds spacing & centers */}
            <div className="max-w-full mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    {children}
                    {/* Site title linking to the home page */}
                    <Link to="/">
                        <h1 className="text-2xl font-bold text-white">Notes</h1>
                    </Link>
                </div>
                {/* Navigation section with login and signup links */}
                {loading ?
                    <LoadingSpinner />
                    : user ?
                        <nav className="space-x-4">
                            <Link className='text-white font-medium hover:text-gray-400' to='/notes/home'>My Notes</Link>
                            <button
                                className="text-white font-medium hover:text-gray-400"
                                onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(logout());
                                    navigate('/')
                                }}
                            >Logout</button>
                        </nav>
                        :
                        <nav className="space-x-4">
                            <Link className='text-white font-medium hover:text-gray-400' to='/notes/home'>My Notes</Link>
                            <Link to="/auth/login" className="text-white font-medium hover:text-gray-400">Login</Link>
                            <Link to="/auth/signup" className="text-white font-medium hover:text-gray-400">Sign Up</Link>
                        </nav>
                }
            </div>
        </header>
    )
}
