

import useTypingAnimation from "@/hooks/useTypingAnimation";


// Component using the custom hook
const ComingUp: React.FC = () => {
  const headerRef = useTypingAnimation("HEY THERE", 1, 0); // No start delay for header
  const contentRef1 = useTypingAnimation(
    "I'm working on a full course related to animations. Please stay tuned",
    1,
    1
  );
  const contentRef2 = useTypingAnimation(
    "I'm working on a full course related to animations. Please stay tuned",
    1,
    7
  );
  const contentRef3 = useTypingAnimation(
    "I'm working on a full course related to animations. Please stay tuned",
    1,
    12
  );

  return (
    <div className="hero-section bg-indigo-900 bg-opacity-50 text-white h-screen flex flex-col justify-center items-center absolute inset-0">
      <div className="max-w-screen-lg mx-auto px-4">
        <p className="text-white text-lg text-center">
          <span ref={headerRef}>HEY THERE</span>
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <span ref={contentRef1} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <span ref={contentRef2} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <span ref={contentRef3} />
        </div>
      </div>
    </div>
  );
};

export default ComingUp;
