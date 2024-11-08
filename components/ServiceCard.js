import React from 'react';

const ServiceCard = ({ title, items }) => {
  return (
    <div className="rounded-lg p-6 m-4 bg-red-700 bg-opacity-90 border-4 border-black shadow-2xl">
      <h3 className="text-xl font-bold mb-4 text-zinc-100">{title}</h3>
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index} className="mb-2 text-white">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard;