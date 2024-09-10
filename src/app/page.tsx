"use client";
import React, { useEffect, useRef, Suspense, useState, useMemo } from "react";
import { createRoot, Root } from "react-dom/client";
import PotreeApp from "./app";
import { useSearchParams } from "next/navigation";

let root: Root | null;
const Page = () => {
  const containerRef = useRef(null);
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<boolean>(null!);

  useEffect(() => {
    const toolsParam = searchParams.get("tools") === "true";
    setTools(toolsParam);
  }, [searchParams]);

  useEffect(() => {
    if (root || tools === null) return;
    if (containerRef.current) {
      root = createRoot(containerRef.current!);
      root.render(<PotreeApp tools={tools} />);
    }
    return () => {
      if (root) {
        root.unmount();
        root = null;
      }
    };
  }, [tools]);
  return (
    <Suspense>
      <div ref={containerRef} />
    </Suspense>
  );
};

export default Page;
