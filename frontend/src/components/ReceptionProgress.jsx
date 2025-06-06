import React from "react";
import StaffNote from "./StaffNote";
import RequestInfoCard from "./RequestInfoCard";
import Footer from "./Footer";

export default function ReceptionProgress() {
  return (
    <div className="flex flex-col gap-10">
      <RequestInfoCard />
      <StaffNote />
    </div>
  );
}
