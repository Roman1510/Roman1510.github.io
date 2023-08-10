import React from 'react';
import './Content.css';

const Content: React.FC = () => (
  <div className="hero-section bg-indigo-900 bg-opacity-50 text-white h-screen flex flex-col justify-center items-center absolute inset-0">
    <h1 className="text-3xl font-bold mb-4">My name is Roman, and welcome to my page!</h1>
    <p className="text-white text-lg text-center">
      I am a web developer with over 5 years of commercial experience, and I'm passionate about new technologies &#128640;
    </p>
  </div>
);

export default Content;
