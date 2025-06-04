// Custom User profile
// User profile picture
// Username

import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../selectors/userSelector";
import { AppDispatch } from "../store";
import { useNavigate } from "react-router";
import { logout } from "../slices/userSlice";
import LoadingSpinner from "./spinner";

// Future work: Fetch user data and render items based on it
export default function UserProfile() {
    const { user, loading, error } = useSelector(userSelector);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    if (loading || !user) return (<LoadingSpinner />)
    return (
        <div className="flex items-center gap-2 py-[20px]">
            <div className="bg-bg-light w-[38px] h-[38px] rounded-[4px] flex items-center justify-center">
                <p className="font-bold text-white text-md">{user.name[0]}</p>
            </div>
            <p className="font-medium text-base text-white">{user.name}</p>
        </div>
    )
}
