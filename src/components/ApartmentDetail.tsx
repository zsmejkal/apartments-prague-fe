import React, { useState } from 'react';
import { Apartment } from '../types/apartment';
import './ApartmentDetail.css';

interface ApartmentDetailProps {
  apartment: Apartment;
  onBack: () => void;
}

const ApartmentDetail: React.FC<ApartmentDetailProps> = ({ apartment, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number, unit: string) => {
    return new Intl.NumberFormat('cs-CZ').format(price) + ' Kč ' + unit;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === apartment.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? apartment.images.length - 1 : prev - 1
    );
  };

  const openMap = () => {
    if (apartment.latitude && apartment.longitude) {
      const url = `https://www.google.com/maps?q=${apartment.latitude},${apartment.longitude}`;
      window.open(url, '_blank');
    }
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

  const shareUrl = generateShareUrl(apartment);

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL. Please copy manually: ' + shareUrl);
    }
  };

  const openShareUrl = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="apartment-detail">
      <div className="apartment-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Back to List
        </button>
        <h1>{apartment.name}</h1>
      </div>

      <div className="apartment-detail-content">
        <div className="apartment-detail-images">
          {apartment.images.length > 0 ? (
            <div className="image-gallery">
              <div className="main-image">
                <img
                  src={apartment.images[currentImageIndex]}
                  alt={`${apartment.name} - ${currentImageIndex + 1}`}
                />
                {apartment.images.length > 1 && (
                  <>
                    <button 
                      className="image-nav prev" 
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button 
                      className="image-nav next" 
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {apartment.images.length > 1 && (
                <div className="image-thumbnails">
                  {apartment.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={index === currentImageIndex ? 'active' : ''}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-images">No images available</div>
          )}
        </div>

        <div className="apartment-detail-info">
          <div className="apartment-detail-section">
            <h2>Price</h2>
            <p className="price">{formatPrice(apartment.price, apartment.price_unit)}</p>
          </div>

          <div className="apartment-detail-section">
            <h2>Location</h2>
            <p className="location">{apartment.locality}</p>
            {apartment.latitude && apartment.longitude && (
              <div className="map-section">
                <button className="map-button" onClick={openMap}>
                  📍 View on Map
                </button>
                <p className="coordinates">
                  Coordinates: {apartment.latitude.toFixed(6)}, {apartment.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          <div className="apartment-detail-section">
            <h2>Property Details</h2>
            <div className="property-details">
              {apartment.size_sqm && (
                <div className="detail-item">
                  <span className="detail-label">Size:</span>
                  <span className="detail-value">{apartment.size_sqm} m²</span>
                </div>
              )}
              {apartment.room_layout && (
                <div className="detail-item">
                  <span className="detail-label">Room Layout:</span>
                  <span className="detail-value">{apartment.room_layout}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Garage:</span>
                <span className="detail-value">
                  {apartment.has_garage ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>
          </div>

          <div className="apartment-detail-section">
            <h2>Dates</h2>
            <div className="dates">
              <div className="detail-item">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDate(apartment.date_created)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Updated:</span>
                <span className="detail-value">{formatDate(apartment.date_updated)}</span>
              </div>
            </div>
          </div>

          <div className="apartment-detail-section">
            <h2>Technical Info</h2>
            <div className="technical-info">
              <div className="detail-item">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{apartment.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hash ID:</span>
                <span className="detail-value">{apartment.hash_id}</span>
              </div>
            </div>
          </div>

          <div className="apartment-detail-section">
            <h2>Share</h2>
            <div className="share-section">
              <div className="share-url">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="share-url-input"
                />
              </div>
              <div className="share-buttons">
                <button className="share-button copy" onClick={copyShareUrl}>
                  📋 Copy URL
                </button>
                <button className="share-button open" onClick={openShareUrl}>
                  🔗 Open on Sreality
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetail;