// client/src/VehicleCard.jsx
import React from 'react';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="bg-slate-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white">{vehicle.name}</h3>
        <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">
          {vehicle.type}
        </span>
      </div>
      <div className="text-sm text-gray-300 space-y-1">
        <p><span className="font-medium">Brand:</span> {vehicle.brand}</p>
        <p><span className="font-medium">Engine:</span> {vehicle.engine}</p>
        <p><span className="font-medium">Mileage:</span> {vehicle.mileage}</p>
        <p><span className="font-medium">Price:</span> {vehicle.price}</p>
        <p><span className="font-medium">Maintenance:</span> {vehicle.maintenance}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {vehicle.tags.map((tag, idx) => (
          <span key={idx} className="bg-slate-600 text-xs text-gray-300 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VehicleCard;