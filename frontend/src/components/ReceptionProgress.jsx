import React from "react";
import StaffNote from "./StaffNote";
import RequestInfoCard from "./RequestInfoCard";

export default function ReceptionProgress() {
  return (
    <div className="flex flex-col gap-10 py-6">
      <RequestInfoCard />
      <StaffNote />
    </div>
  );
}
