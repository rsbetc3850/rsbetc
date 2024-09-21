import React from 'react';

const ServiceCard = ({ title, items }) => {
  return (
    <div className="rounded-lg p-6 m-4 bg-zinc-900 bg-opacity-50 border-2 border-zinc-300 shadow-2xl">
      <h3 className="text-xl font-bold mb-4 text-zinc-50">{title}</h3>
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index} className="mb-2 text-amber-200">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard;