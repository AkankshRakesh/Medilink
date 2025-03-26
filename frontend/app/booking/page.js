
import BookingPage from "@/components/BookingPage";
import Main from "@/components/Main";
import { Suspense } from "react";

export const metadata = {
    title: "Medilink · Booking",
};

export default function ContactPage() {
    
    return (
        <Main>
            <Suspense fallback={<div>Loading...</div>}>
            <BookingPage/>
            </Suspense>
        </Main>
    )
}