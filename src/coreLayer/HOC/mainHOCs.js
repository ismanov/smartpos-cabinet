import React from "react";
import { useCallback } from "react";

export const memoHOC = (Component, ...deps) => {
  const NewMemoComponent = useCallback((props) => {
    return <Component {...props} />;
  }, deps);
  return NewMemoComponent;
};
