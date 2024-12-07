import React from "react";
import StaticDetails from "../../components/StaticDetails";
import Header from "../../components/Header";

const Pay = () => {
  return (
    <div className="w-full">
      <Header heading={"How To Register"}></Header>
      <div className="flex-1 w-full">
        <StaticDetails staticType="HOW_TO_PAY" pageTitle="How to Register" />{" "}
      </div>
    </div>
  );
};

export default Pay;
