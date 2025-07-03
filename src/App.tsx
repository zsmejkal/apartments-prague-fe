import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApartmentList from './components/ApartmentList';
import ApartmentDetailPage from './components/ApartmentDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Prague Apartments</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ApartmentList />} />
            <Route path="/detail/prodej/byt/:roomLayout/:locality/:hashId" element={<ApartmentDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
