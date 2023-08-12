import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const useTypingAnimation = (
  text: string,
  delayFactor: number,
  startDelay: number
): React.RefObject<HTMLSpanElement> => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const textElement = textRef.current;

    if (textElement) {
      const letters = text.split("");
      const typingAnimation = gsap.timeline({ delay: startDelay });

      textElement.innerHTML = ""; // Clear the content

      letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.opacity = "0";
        textElement.appendChild(span);

        typingAnimation.to(span, {
          opacity: 1,
          duration: 0.002 / delayFactor,
          delay: index * 0.001 * delayFactor,
          ease: "power1.in",
        });
      });
    }
  }, [text, delayFactor, startDelay]);

  return textRef;
};

export default useTypingAnimation;
