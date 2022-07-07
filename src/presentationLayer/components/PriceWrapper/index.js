import React from "react";

export const PriceWrapper = ({ price }) => {
  return (
    <>
      <strong>{(price || 0).toLocaleString("ru")}</strong> сум
    </>
  );
};
