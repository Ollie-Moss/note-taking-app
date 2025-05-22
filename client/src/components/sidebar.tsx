import { AnimatePresence, motion } from "motion/react";
import { useSidebar } from "../lib/sidebarProvider";
import SidebarNavigation from "./sidebarNavigation";
import UserProfile from "./userProfile";
import ItemTreeHeader from "./itemTreeHeader";
import ItemTree from "./itemTree";
import { useSelector } from "react-redux";
import { rootItemsArraySelector } from "../selectors/allSelectors";
import { useRef } from "react";

export default function Sidebar() {
    const { isSidebarOpen } = useSidebar()
    const allItems = useSelector(rootItemsArraySelector)

    const listRef = useRef(null)

    return (
        <div className={`z-10 absolute w-full h-full lg:relative lg:w-[20%] ${isSidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Sidebar animation */}
            <motion.div
                animate={{
                    gridTemplateColumns: isSidebarOpen ? '1fr' : '0fr',
                }}
                transition={{ duration: 0.3 }}
                className="grid w-full h-full grid-cols-[0fr]">

                {/* Sidebar Container */}
                <div className="overflow-hidden w-full h-full">
                    <aside className="relative w-full h-full flex flex-col px-[20px] bg-bg-dark lg:w-[220px] lg:max-w-[220px] min-h-0">
                        {/* Top Section: Profile + Navigation */}
                        <div>
                            <UserProfile />
                            <SidebarNavigation />
                        </div>
                        {/* Bottom Section: Notes / Groups (Scrollable) */}
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



