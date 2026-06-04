import { useCallback, useEffect, useRef, useState } from "react";
import type { ScrollViewportPanelJumpDirection } from "./scrollViewportPanel";

const useScrollJump = (jumpDirection: ScrollViewportPanelJumpDirection) => {
  const contentAreaRef = useRef<HTMLDivElement | null>(null);
  const [isJumpButtonVisible, setIsJumpButtonVisible] = useState(false);

  const updateJumpVisibility = useCallback(() => {
    const contentArea = contentAreaRef.current;

    if (!contentArea) {
      return;
    }

    if (jumpDirection === "none") {
      setIsJumpButtonVisible(false);
      return;
    }

    const distanceToEdge =
      jumpDirection === "up"
        ? contentArea.scrollTop
        : contentArea.scrollHeight -
          contentArea.scrollTop -
          contentArea.clientHeight;

    setIsJumpButtonVisible(distanceToEdge > 24);
  }, [jumpDirection]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateJumpVisibility);
    return () => window.cancelAnimationFrame(frame);
  }, [contentAreaRef, updateJumpVisibility]);

  const handleJump = () => {
    const contentArea = contentAreaRef.current;

    if (!contentArea) {
      return;
    }

    if (jumpDirection === "none") {
      return;
    }

    contentArea.scrollTo({
      top: jumpDirection === "up" ? 0 : contentArea.scrollHeight,
      behavior: "smooth",
    });
  };

  return {
    contentAreaRef,
    isJumpButtonVisible,
    handleJump,
    updateJumpVisibility,
  };
};

export default useScrollJump;
