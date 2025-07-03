import React, { useState, useEffect } from 'react';
import { Apartment, ApartmentFilters } from '../types/apartment';
import './ApartmentList.css';

interface ApartmentListProps {
  onApartmentClick: (apartment: Apartment) => void;
}

const ApartmentList: React.FC<ApartmentListProps> = ({ onApartmentClick }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ApartmentFilters>({
    skip: 0,
    limit: 20
  });

  const fetchApartments = async (currentFilters: ApartmentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`http://0.0.0.0:8000/apartments/?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApartments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ApartmentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const formatPrice = (price: number, unit: string) => {
    return new Intl.NumberFormat('cs-CZ').format(price) + ' Kč ' + unit;
  };

  if (loading) {
    return <div className="apartment-list-loading">Loading apartments...</div>;
  }

  if (error) {
    return <div className="apartment-list-error">Error: {error}</div>;
  }

  return (
    <div className="apartment-list">
      <div className="apartment-list-filters">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>
            Min Price:
            <input
              type="number"
              value={filters.min_price || ''}
              onChange={(e) => handleFilterChange({ 
                min_price: e.target.value ? parseInt(e.target.value) : null 
              })}
              placeholder="Min price"
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              value={filters.max_price || ''}
              onChange={(e) => handleFilterChange({ 
                max_price: e.target.value ? parseInt(e.target.value) : null 
              })}
              placeholder="Max price"
            />
          </label>
        </div>
        <div className="filter-group">
          <label>
            Min Size (m²):
            <input
              type="number"
              value={filters.min_size || ''}
              onChange={(e) => handleFilterChange({ 
                min_size: e.target.value ? parseInt(e.target.value) : null 
              })}
              placeholder="Min size"
            />
          </label>
          <label>
            Max Size (m²):
            <input
              type="number"
              value={filters.max_size || ''}
              onChange={(e) => handleFilterChange({ 
                max_size: e.target.value ? parseInt(e.target.value) : null 
              })}
              placeholder="Max size"
            />
          </label>
        </div>
        <div className="filter-group">
          <label>
            Room Layout:
            <input
              type="text"
              value={filters.room_layout || ''}
              onChange={(e) => handleFilterChange({ 
                room_layout: e.target.value || null 
              })}
              placeholder="e.g., 1+kk, 2+1"
            />
          </label>
          <label>
            Has Garage:
            <select
              value={filters.has_garage?.toString() || ''}
              onChange={(e) => handleFilterChange({ 
                has_garage: e.target.value === '' ? null : e.target.value === 'true' 
              })}
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
        </div>
      </div>

      <div className="apartment-list-results">
        <h2>Apartments ({apartments.length})</h2>
        <div className="apartment-grid">
          {apartments.map((apartment) => (
            <div
              key={apartment.id}
              className="apartment-card"
              onClick={() => onApartmentClick(apartment)}
            >
              <div className="apartment-image">
                {apartment.images.length > 0 ? (
                  <img
                    src={apartment.images[0]}
                    alt={apartment.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="no-image">No image</div>
                )}
              </div>
              <div className="apartment-info">
                <h3>{apartment.name}</h3>
                <p className="apartment-price">
                  {formatPrice(apartment.price, apartment.price_unit)}
                </p>
                <p className="apartment-location">{apartment.locality}</p>
                <div className="apartment-details">
                  {apartment.size_sqm && (
                    <span className="apartment-size">{apartment.size_sqm} m²</span>
                  )}
                  {apartment.room_layout && (
                    <span className="apartment-layout">{apartment.room_layout}</span>
                  )}
                  {apartment.has_garage && (
                    <span className="apartment-garage">🚗 Garage</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApartmentList;