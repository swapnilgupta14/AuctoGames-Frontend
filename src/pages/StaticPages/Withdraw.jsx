import React from "react";
import Header from "../../components/Header";
import StaticDetails from "../../components/StaticDetails";

const Withdraw = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header heading="Withdrawal Request" />
      <StaticDetails
        staticType="WITHDRAWAL_REQUEST"
        pageTitle="Withdrawal Request"
      />
    </div>
  );
};

export default Withdraw;
