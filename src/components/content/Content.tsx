import React from 'react';
import './Content.css';

const Content: React.FC = () => (
  <div className="hero-section bg-indigo-900 bg-opacity-50 text-white h-screen flex flex-col justify-center items-center absolute inset-0">
    <h1 className="text-3xl font-bold mb-4">Welcome to my Portfolio</h1>
    <p className="text-white text-lg text-center">
      This is the hero section for showcasing my work and achievements.
    </p>
  </div>
);

export default Content;
