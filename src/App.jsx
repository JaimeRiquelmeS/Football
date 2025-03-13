import React, { useState } from 'react';
import Competitions from './components/Competitions';
import BettingPage from './components/BettingPage';

function App() {
  const [currentPage, setCurrentPage] = useState('competitions');

  // Función para cambiar de página
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Pasar esta función a los componentes para permitir la navegación
  const navProps = { navigateTo };

  // Renderizar la página actual
  return (
    <div>
      {currentPage === 'competitions' && <Competitions {...navProps} />}
      {currentPage === 'apuestas' && <BettingPage {...navProps} />}
    </div>
  );
}

export default App;