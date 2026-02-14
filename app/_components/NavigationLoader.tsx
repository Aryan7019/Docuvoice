"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const NavigationLoader = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[200] h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 animate-pulse">
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      )}
    </>
  );
};
