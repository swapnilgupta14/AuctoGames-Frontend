import React from "react";
import Header from "../../components/Header";
import StaticDetails from "../../components/StaticDetails";

const Terms = () => {
  return (
    <div className="h-dvh bg-gray-100">
      <Header heading="Terms and Conditions" />
      <StaticDetails
        staticType="TERMS_AND_CONDITIONS"
        pageTitle="Terms and Conditions"
      />
    </div>
  );
};

export default Terms;
