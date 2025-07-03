import React, { useState } from 'react';
import ApartmentList from './components/ApartmentList';
import ApartmentDetail from './components/ApartmentDetail';
import { Apartment } from './types/apartment';
import './App.css';

function App() {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

  const handleApartmentClick = (apartment: Apartment) => {
    setSelectedApartment(apartment);
  };

  const handleBackToList = () => {
    setSelectedApartment(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Prague Apartments</h1>
      </header>
      <main>
        {selectedApartment ? (
          <ApartmentDetail 
            apartment={selectedApartment} 
            onBack={handleBackToList}
          />
        ) : (
          <ApartmentList onApartmentClick={handleApartmentClick} />
        )}
      </main>
    </div>
  );
}

export default App;
