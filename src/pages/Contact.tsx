
const Contact: React.FC = () => {
  return (
    <div className="hero-section bg-indigo-900 bg-opacity-50 text-white h-screen flex flex-col justify-center items-center absolute inset-0">
      <div className="max-w-screen-lg mx-auto px-4">
        <p className="text-white text-lg text-center">
          Contact me, if you want to contribute

        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          romanvinnick@gmail.com

        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          LinkedIn
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          Github
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          Insta
        </div>
      </div>
    </div>
  );
};

export default Contact;