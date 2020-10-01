import { useEffect } from "react";

export default function useInfinityScroll({ action }) {
  useEffect(() => {
    const handleScroll = () => {
      const isReachedToBottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;
      if (!isReachedToBottom) {
        return;
      }
      action();
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
}
