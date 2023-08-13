import React from "react";
import "./Content.css";
import useTypingAnimation from "@/hooks/useTypingAnimation";

const Content: React.FC = () => {
  // Use the hook to get refs for the header and content
  const headerRef = useTypingAnimation(
    `My name is Roman, and welcome to my page!`,
    1,
    0
  );
  const contentRef1 = useTypingAnimation(
    `I am a web developer with over 5 years of commercial experience, and I'm passionate about new technologies 🚀`,
    1,
    2
  );

  return (
    <div className="hero-section px-5 text-center bg-indigo-900 bg-opacity-50 text-white h-screen flex flex-col justify-center items-center absolute inset-0">
      <span
        ref={headerRef}
        className="container-margin text-3xl text-yellow-300 font-bold mb-4 cursor-default"
      >

      </span>
      <span
        ref={contentRef1}
        className="text-white text-lg text-center cursor-default"
      >

      </span>
    </div>
  );
};

export default Content;
