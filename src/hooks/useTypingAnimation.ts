import  { useEffect, useRef } from "react";
import { gsap } from "gsap";

const useTypingAnimation = (text: string, delayFactor: number, startDelay: number) => {
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
          duration: 0.05 / delayFactor, // Adjust the duration based on delayFactor
          delay: index * 0.001 * delayFactor, // Delay between letters
          ease: "power1.in",
        });
      });
    }
  }, [text, delayFactor, startDelay]);

  return textRef;
};

export default useTypingAnimation