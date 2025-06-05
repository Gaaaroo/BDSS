import React from "react";
import StaffNote from "./StaffNote";
import RequestInfoCard from "./RequestInfoCard";
import DonationStepFlow from "./StepFlow";

export default function DonationProgress() {
  return (
    <div className="flex flex-col gap-10 py-6">
      <RequestInfoCard />
      <DonationStepFlow />
      <StaffNote />
    </div>
  );
}
