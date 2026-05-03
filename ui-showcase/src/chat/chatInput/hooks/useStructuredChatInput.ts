import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyStructuredBackspace,
  applyStructuredEnter,
  hasLeadHeadingPattern,
  normalizeStructuredTextWithCaret,
} from "./structuredChatInputBehavior";

export const useStructuredChatInput = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingCaretOffset = useRef<number | null>(null);
  const [value, setValue] = useState("");

  const hasLeadHeading = useMemo(() => hasLeadHeadingPattern(value), [value]);

  const resizeInput = () => {
    const element = inputRef.current;
    if (!element) {
      return;
    }

    element.style.height = "0px";
    const nextHeight = element.scrollHeight;
    const maxHeight = Number.parseFloat(
      window.getComputedStyle(element).maxHeight,
    );

    if (Number.isFinite(maxHeight) && nextHeight > maxHeight) {
      element.style.height = `${maxHeight}px`;
      element.style.overflowY = "auto";
      return;
    }

    element.style.height = `${nextHeight}px`;
    element.style.overflowY = "hidden";
  };

  useEffect(() => {
    const element = inputRef.current;
    if (!element) {
      return;
    }

    if (pendingCaretOffset.current !== null) {
      element.setSelectionRange(
        pendingCaretOffset.current,
        pendingCaretOffset.current,
      );
      pendingCaretOffset.current = null;
    }

    resizeInput();
  }, [value]);

  const handleInput: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    const normalizedInput = normalizeStructuredTextWithCaret(
      event.target.value,
      event.target.selectionStart,
    );

    pendingCaretOffset.current = normalizedInput.nextCaretOffset;
    setValue(normalizedInput.nextValue);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    const element = inputRef.current;
    if (!element) {
      return;
    }

    const selectionStart = element.selectionStart;
    const selectionEnd = element.selectionEnd;

    if (event.key === "Backspace") {
      const backspaceResult = applyStructuredBackspace(value, {
        selectionStart,
        selectionEnd,
      });

      if (backspaceResult) {
        event.preventDefault();
        pendingCaretOffset.current = backspaceResult.nextCaretOffset;
        setValue(backspaceResult.nextValue);
      }

      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    const enterResult = applyStructuredEnter(value, selectionStart);
    pendingCaretOffset.current = enterResult.nextCaretOffset;
    setValue(enterResult.nextValue);
  };

  return {
    inputRef,
    value,
    hasLeadHeading,
    handleInput,
    handleKeyDown,
  };
};
