import { ReactNode } from "react";

export const metadata = {
    title: "Moffi Studio",
    description: "Design your custom pet apparel",
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
