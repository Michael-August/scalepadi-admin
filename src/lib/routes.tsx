import { BanknoteArrowDown, FolderOpen, LayoutDashboard, MessageCircleMore, UserCheck2, UserCircle, Users } from "lucide-react";

export const Routes = [
    {
        name: "Overview",
        route: "/overview",
        icon: LayoutDashboard
    },
    {
        name: "Projects",
        route: "/projects",
        icon: FolderOpen
    },
    {
        name: "Business",
        route: "/business",
        icon: UserCheck2
    },
    {
        name: "Experts",
        route: "/experts",
        icon: UserCircle
    },
    {
        name: "Messages",
        route: "/messages",
        icon: MessageCircleMore
    },
    {
        name: "Payments",
        route: "/payments",
        icon: BanknoteArrowDown
    },
    {
        name: "Users",
        route: "/users",
        icon: Users
    }
]