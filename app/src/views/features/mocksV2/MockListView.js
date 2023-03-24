import React from "react";
import MockListIndex from "components/features/mocksV2/MockList";
import { MockType } from "components/features/mocksV2/types";
import { useFeatureValue } from "@growthbook/growthbook-react";

const MockListView = () => {
  const value = useFeatureValue("test-login-required", "fallback");
  console.log("test-login-required", value, typeof(value));

  return <MockListIndex type={MockType.API} />;
};

export default MockListView;
