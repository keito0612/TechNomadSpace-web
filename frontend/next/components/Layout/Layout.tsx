import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import NavigationBottomBar from "../NavigationBottomBar";



const LayoutConteiner = ({ children, className }: { children: ReactNode, className?: string }) => {
    return (
        <div className={cn("min-h-screen bg-blue-950 text-white", className)}>
            {children}
        </div>
    );
}

const LayoutBody = ({ children }: { children: ReactNode }) => {
    return (
        <main className="flex flex-col items-start justify-center">
            <div className="w-full pb-16 lg:pb-0">
                {children}
            </div>
            <NavigationBottomBar />
        </main>
    );
}


interface LayoutProps {
    children: ReactNode;
    className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
    return (
        <LayoutConteiner className={className}>
            <LayoutBody>
                {children}
            </LayoutBody>
        </LayoutConteiner>
    );
};

export default Layout;