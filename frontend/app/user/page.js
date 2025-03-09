import Main from "@/components/Main";
import { User } from "@/components/User";

export const metadata = {
    title: "Medilink · User",
};

export default function UserPage() {

    return (
        <Main>
            <User />
        </Main>
    )
}