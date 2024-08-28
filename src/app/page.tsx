"use client";
import React, { useEffect, useRef, StrictMode, Suspense } from "react";
import { createRoot, Root } from "react-dom/client";
import PotreeApp from "./app";

let root: Root | null;
const Page = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (root) return;
    if (containerRef.current) {
      root = createRoot(containerRef.current!);
      root.render(<PotreeApp />);
    }
    return () => {
      if (root) {
        root.unmount();
        root = null;
      }
    };
  }, []);
  return (
    <Suspense>
      <div ref={containerRef} />
    </Suspense>
  );
};

export default Page;
