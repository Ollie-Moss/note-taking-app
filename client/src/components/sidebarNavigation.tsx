import { Link } from "react-router";
import { useSearch } from "../lib/searchProvider";
import { useSidebar } from "../lib/sidebarProvider";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faMagnifyingGlass, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SidebarNavigation() {
    const { closeSidebarIfMobile } = useSidebar()
    const { OpenSearch } = useSearch()

    return (
        <ul className="mt-4 space-y-1">
            {/* Home Link */}
            <li className="">
                <Link
                    onClick={closeSidebarIfMobile}
                    to={{ pathname: "/notes/home" }}
                    className="text-white transition flex gap-[20px] items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                    <FontAwesomeIcon
                        className="text-white size-[20px]" icon={faHouse} />
                    Home
                </Link >
            </li >
            {/* Search Link */}
            <li
                onClick={() => {
                    OpenSearch();
                    closeSidebarIfMobile();
                }}
                className="transition hover:cursor-pointer flex gap-[20px] items-center hover:bg-bg-light py-1.5 px-2 rounded-lg" >
                <FontAwesomeIcon className="text-white size-[20px]" icon={faMagnifyingGlass} />
                <p className="text-sm text-white">Search</p>
            </li>
        </ul>
    )
}
