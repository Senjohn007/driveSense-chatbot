import React from 'react';

const VehicleInfo = ({ vehicle }) => {
  return (
    <div className="vehicle-info-card">
      <div className="vehicle-header">
        <h3 className="vehicle-name">{vehicle.name}</h3>
        <span className="vehicle-type">{vehicle.type}</span>
      </div>
      <div className="vehicle-details">
        <div className="detail-row">
          <span className="detail-label">Brand:</span>
          <span className="detail-value">{vehicle.brand}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Engine:</span>
          <span className="detail-value">{vehicle.engine}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Mileage:</span>
          <span className="detail-value">{vehicle.mileage}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Price:</span>
          <span className="detail-value">{vehicle.price}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Maintenance:</span>
          <span className="detail-value">{vehicle.maintenance}</span>
        </div>
      </div>
      <div className="vehicle-tags">
        {vehicle.tags.map((tag, idx) => (
          <span key={idx} className="vehicle-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VehicleInfo;