import React from 'react';
import Upload from './components/Upload';
import Login from './components/Login';
import Signup from './components/Signup';
import DisplayImage from './components/DisplayImage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/display" element={<DisplayImage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
