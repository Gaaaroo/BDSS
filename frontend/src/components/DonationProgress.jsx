import React from "react";
import StaffNote from "./StaffNote";
import RequestInfoCard from "./RequestInfoCard";
import DonationStepFlow from "./StepFlow";
import Footer from "./Footer";

export default function DonationProgress() {
  return (
    <div className="flex flex-col gap-10">
      <RequestInfoCard />
      <DonationStepFlow />
      <StaffNote />
    </div>
  );
}
