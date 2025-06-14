import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title,
  className = ''
}) => {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4 text-gray-200">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;