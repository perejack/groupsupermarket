import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackTikTokPageView } from "@/lib/tiktok";

let isFirstLoad = true;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    // Base pixel already calls ttq.page() on full page load in index.html
    if (isFirstLoad) {
      isFirstLoad = false;
      return;
    }
    trackTikTokPageView();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
