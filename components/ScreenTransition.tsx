"use client";

import { useEffect, useState, useRef } from "react";

type Props = {
  screenKey: string;
  direction?: "forward" | "back";
  children: React.ReactNode;
};

export default function ScreenTransition({ screenKey, direction = "forward", children }: Props) {
  const [animClass, setAnimClass] = useState("");
  const prevKey = useRef(screenKey);

  useEffect(() => {
    if (prevKey.current !== screenKey) {
      setAnimClass(direction === "back" ? "screen-back" : "screen-enter");
      prevKey.current = screenKey;
      const t = setTimeout(() => setAnimClass(""), 350);
      return () => clearTimeout(t);
    }
  }, [screenKey, direction]);

  return (
    <div className={animClass} style={{ willChange: "transform", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
