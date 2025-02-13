import React from "react";
import Header from "../../components/Header";
import StaticDetails from "../../components/StaticDetails";

const Privacy = () => {
  return (
    <div className="h-dvh bg-gray-100">
      <Header heading="Privacy Policy" />
      <StaticDetails staticType="PRIVACY_POLICY" pageTitle="Privacy Policy" />
    </div>
  );
};

export default Privacy;
