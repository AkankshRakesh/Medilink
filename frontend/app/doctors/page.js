import Doctors from "@/components/Doctors";
import Main from "@/components/Main";
export const metadata = {
  title: "Medilink · Doctors",
};

export default function SpecialitiesPage() {
  return (
    <Main>
      <Doctors />
    </Main>
  );
}
