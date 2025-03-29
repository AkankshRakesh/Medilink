import CheckOut from "@/components/CheckOut";
import Main from "@/components/Main";
import { Suspense } from "react";
export const metadata = {
    title: "Medilink · Book now",
};

export default function ContactPage() {

    return (
        <Main>
            <Suspense fallback={<div>Loading...</div>}>
            <CheckOut />
            </Suspense>
        </Main>
    )
}
