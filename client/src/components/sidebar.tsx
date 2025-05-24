import { AnimatePresence, motion } from "motion/react";
import { useSidebar } from "../lib/sidebarProvider";
import SidebarNavigation from "./sidebarNavigation";
import UserProfile from "./userProfile";
import ItemTreeHeader from "./itemTreeHeader";
import ItemTree from "./itemTree";
import { useSelector } from "react-redux";
import { rootItemsArraySelector } from "../selectors/allSelectors";
import { useEffect, useRef, useState } from "react";

// Sidebar component includes:
// User profile
// Navigation
// Notes and group list
// Toggles visibility and animation based on screen size and sidebar state
// Used in conjunction with sidebarProvider to allow for toggling anywhere in app
export default function Sidebar() {
    // Sidebar state (renders based on this)
    const { isSidebarOpen } = useSidebar()
    const allItems = useSelector(rootItemsArraySelector)
    const listRef = useRef(null)

    // Track if screen is large (greater than 1024px wide) 
    // to disable animation and keep sidebar open
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const handleChange = () => setIsLargeScreen(mediaQuery.matches);
        handleChange();
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);
    return (
        <div className={`z-10 absolute w-full h-full lg:relative lg:w-[25%] ${isSidebarOpen || isLargeScreen ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Sidebar animation */}
            <motion.div
                className="grid w-full h-full grid-cols-[0fr] lg:grid-cols-[1fr]"
                animate={
                    isLargeScreen
                        ? {} // Don't animate on large screens
                        : {
                            gridTemplateColumns: isSidebarOpen ? "1fr" : "0fr",
                        }}
                transition={{ duration: 0.15 }}>

                {/* Sidebar Container */}
                <div className="overflow-hidden w-full h-full">
                    <aside className="relative w-full h-full flex flex-col px-[20px] bg-bg-dark min-h-0">
                        {/* Top Section: Profile + Navigation */}
                        <div>
                            <UserProfile />
                            <SidebarNavigation />
                        </div>
                        {/* Bottom Section: Notes & Groups */}
                        <div className="mt-4 overflow-y-auto min-h-0 flex-grow">
                            <ul className="space-y-2">
                                <ItemTreeHeader />

                                <AnimatePresence mode="wait">
                                    <li ref={listRef}>
                                        <ItemTree items={allItems} container={listRef} />
                                    </li >
                                </AnimatePresence>
                            </ul>
                        </div>
                    </aside>
                </div>
            </motion.div>
        </div>
    )
}



