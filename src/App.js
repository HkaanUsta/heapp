// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CalorieCalculator from './components/CalorieCalculator';
import './App.css'

function App() {
  return (
    <Router>
      <div className='header' style={{paddingRight: 15}}>
        HeApp
      </div>
      <div className='body'>
        <Routes>
          <Route path="/" exact element={<CalorieCalculator/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
