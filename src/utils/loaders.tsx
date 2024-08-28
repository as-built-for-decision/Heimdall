"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";

export async function loadTextFile(path: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(path);
    if (!response.ok) {
      console.error(response.statusText);
      reject(response.statusText);
    }
    const data = (await response.text()) as string;
    resolve(data);
  });
}

interface TextLoaderProps {
  path: string;
  onLoad?: (result: string) => void;
  children?: React.ReactNode;
}

const TextLoader = ({ path, onLoad, children }: TextLoaderProps) => {
  const [loadedText, setLoadedText] = useState<string | null>(null);

  useMemo(async () => {
    if (loadedText) return;

    const script = await loadTextFile(path);
    setLoadedText(script as string);
  }, []);

  useEffect(() => {
    if (loadedText) {
      if (onLoad) onLoad(loadedText);
    }
  }, [loadedText]);

  if (!loadedText) return <></>;
  return <div>{children}</div>;
};

interface ScriptLoaderProps {
  src: string;
  children: React.ReactNode;
}

async function loadScript(src: string, onload: () => void) {
  const script = document.createElement("script");
  script.src = src;
  //   script.type = "module";
  //   script.defer = true;
  script.async = false;

  script.onload = () => {
    if (onload) onload();
    console.log(`${src} has been successfully loaded.`);
  };

  script.onerror = () => {
    console.error(`Failed to load script: ${src}`);
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}

function ScriptLoader({ src, children }: ScriptLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!document) return;
    loadScript(src, () => {
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return <></>; // Optionally, you can return a loading spinner or placeholder here
  }

  return <>{children}</>;
}

export { ScriptLoader, TextLoader };
