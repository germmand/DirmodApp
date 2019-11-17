import React from 'react';
import './App.css';

import Button from 'react-bootstrap/Button';

import FlagIcon from './components/FlagIcon';


function App() {
  return (
    <div className="App">
      <Button variant="primary">Dont click me!</Button>
      <FlagIcon code="BRL" size={50} />
    </div>
  );
}

export default App;
