import React from 'react';

export default function ServicesList({ services, servicesLoading, servicesError }) {
  if (servicesLoading) return <p>Loading services…</p>;
  if (servicesError)   return <p className="text-red-500">{servicesError}</p>;
  if (services.length === 0) return <p>No services found.</p>;

  return (
    <ul className="space-y-4">
      {services.map(s => (
        <li key={s._id} className="p-4 bg-white rounded shadow">
          <h3 className="text-xl font-bold">{s.name}</h3>
          <p>Price: ${s.price}</p>
          <p>Duration: {s.duration} minutes</p>
          <p className="text-gray-600">{s.description}</p>
        </li>
      ))}
    </ul>
  );
}