"use client";

import React, { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./index";
import { initializeAuthFromStorage } from "./slices/authSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(initializeAuthFromStorage());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
