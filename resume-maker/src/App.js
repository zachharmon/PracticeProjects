import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Builder from './components/Builder';
import Output from './components/Output';
import Redirect from './components/Redirect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Builder />} />
      <Route path="/output" element={<Output />} />
      <Route path="*" element={<Redirect to="/" />} />
    </Routes>
  );
}

export default App;
