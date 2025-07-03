import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApartmentByHashId } from '../services/mockApartmentData';
import ApartmentDetail from './ApartmentDetail';

const ApartmentDetailPage: React.FC = () => {
  const { hashId } = useParams<{ hashId: string }>();
  const navigate = useNavigate();

  const apartment = hashId ? getApartmentByHashId(parseInt(hashId)) : undefined;

  const handleBack = () => {
    navigate('/');
  };

  if (!apartment) {
    return (
      <div className="apartment-detail-error">
        <h2>Apartment not found</h2>
        <p>The apartment with the given ID could not be found.</p>
        <button onClick={handleBack}>← Back to List</button>
      </div>
    );
  }

  return <ApartmentDetail apartment={apartment} onBack={handleBack} />;
};

export default ApartmentDetailPage;