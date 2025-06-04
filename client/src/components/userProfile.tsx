// Custom User profile
// User profile picture
// Username
// Future work: Fetch user data and render items based on it
export default function UserProfile() {
    return (
        <div className="flex items-center gap-2 py-[20px]">
            <div className="bg-bg-light w-[38px] h-[38px] rounded-[4px] flex items-center justify-center">
                <p className="font-bold text-white text-md">O</p>
            </div>
            <p className="font-medium text-base text-white"> Name </p>
        </div>
    )
}
