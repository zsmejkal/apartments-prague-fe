import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apartment, ApartmentFilters } from '../types/apartment';
import { getAllApartments } from '../services/mockApartmentData';
import './ApartmentList.css';

interface ApartmentListProps {}

const ApartmentList: React.FC<ApartmentListProps> = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ApartmentFilters>({
    skip: 0,
    limit: 20
  });

  const loadApartments = () => {
    setLoading(true);
    const allApartments = getAllApartments();
    setApartments(allApartments);
    setFilteredApartments(allApartments);
    setLoading(false);
  };

  const applyFilters = (apartments: Apartment[], filters: ApartmentFilters) => {
    let filtered = apartments;

    if (filters.min_price !== null && filters.min_price !== undefined) {
      filtered = filtered.filter(apt => apt.price >= filters.min_price!);
    }

    if (filters.max_price !== null && filters.max_price !== undefined) {
      filtered = filtered.filter(apt => apt.price <= filters.max_price!);
    }

    if (filters.min_size !== null && filters.min_size !== undefined) {
      filtered = filtered.filter(apt => apt.size_sqm && apt.size_sqm >= filters.min_size!);
    }

    if (filters.max_size !== null && filters.max_size !== undefined) {
      filtered = filtered.filter(apt => apt.size_sqm && apt.size_sqm <= filters.max_size!);
    }

    if (filters.room_layout) {
      filtered = filtered.filter(apt => apt.room_layout === filters.room_layout);
    }

    if (filters.has_garage !== null && filters.has_garage !== undefined) {
      filtered = filtered.filter(apt => apt.has_garage === filters.has_garage);
    }

    return filtered;
  };

  useEffect(() => {
    loadApartments();
  }, []);

  useEffect(() => {
    const filtered = applyFilters(apartments, filters);
    setFilteredApartments(filtered);
  }, [apartments, filters]);

  const handleFilterChange = (newFilters: Partial<ApartmentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const formatPrice = (price: number, unit: string) => {
    return new Intl.NumberFormat('cs-CZ').format(price) + ' Kč ' + unit;
  };

  const generateShareUrl = (apartment: Apartment) => {
    const baseUrl = 'https://www.sreality.cz/detail/prodej/byt';
    const roomLayout = apartment.room_layout || '1+kk';
    const locality = apartment.locality.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    
    return `${baseUrl}/${roomLayout}/${locality}/${apartment.hash_id}`;
  };

  const handleApartmentClick = (apartment: Apartment) => {
    const roomLayout = apartment.room_layout || '1+kk';
    const locality = apartment.locality.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    
    navigate(`/detail/prodej/byt/${roomLayout}/${locality}/${apartment.hash_id}`);
  };

  const copyShareUrl = async (apartment: Apartment, event: React.MouseEvent) => {
    event.stopPropagation();
    const shareUrl = generateShareUrl(apartment);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL. Please copy manually: ' + shareUrl);
    }
  };

  const openShareUrl = (apartment: Apartment, event: React.MouseEvent) => {
    event.stopPropagation();
    const shareUrl = generateShareUrl(apartment);
    window.open(shareUrl, '_blank');
  };

  if (loading) {
    return <div className="apartment-list-loading">Loading apartments...</div>;
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
        <h2>Apartments ({filteredApartments.length})</h2>
        <div className="apartment-grid">
          {filteredApartments.map((apartment) => (
            <div
              key={apartment.id}
              className="apartment-card"
              onClick={() => handleApartmentClick(apartment)}
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
                <div className="apartment-actions">
                  <button
                    className="share-button-small copy"
                    onClick={(e) => copyShareUrl(apartment, e)}
                    title="Copy share URL"
                  >
                    📋
                  </button>
                  <button
                    className="share-button-small open"
                    onClick={(e) => openShareUrl(apartment, e)}
                    title="Open on Sreality"
                  >
                    🔗
                  </button>
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