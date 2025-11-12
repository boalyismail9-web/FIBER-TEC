import React from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 w-full text-right transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <div className="flex items-center justify-end mb-4">
        <h3 className="text-xl font-bold text-gray-800 mr-4">{title}</h3>
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
          {icon}
        </div>
      </div>
      <p className="text-gray-500">{description}</p>
    </button>
  );
};

export default Card;
