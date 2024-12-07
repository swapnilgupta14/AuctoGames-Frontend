import React from "react";
import Header from "../../components/Header";
import StaticDetails from "../../components/StaticDetails";

const Play = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header heading="How to Play" />
      <StaticDetails staticType="HOW_TO_PLAY" pageTitle="How to Play" />
    </div>
  );
};

export default Play;
