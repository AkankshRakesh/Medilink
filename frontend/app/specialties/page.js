import Doctors from "@/components/Doctors";
import Main from "@/components/Main";
export const metadata = {
  title: "Medilink · General Physician",
};

export default function SpecialtiesPage() {
  return (
    <Main>
      <Doctors />
    </Main>
  );
}
