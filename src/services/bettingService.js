// Clave para almacenamiento en localStorage
const USER_KEY = 'football_betting_user';

// Obtener o inicializar datos del usuario
const getUserData = () => {
  const savedData = localStorage.getItem(USER_KEY);
  if (savedData) {
    return JSON.parse(savedData);
  }
  
  // Usuario inicial con 100€ de saldo
  const initialData = {
    balance: 100,
    bets: [],
    betHistory: []
  };
  
  localStorage.setItem(USER_KEY, JSON.stringify(initialData));
  return initialData;
};

// Guardar datos del usuario
const saveUserData = (data) => {
  localStorage.setItem(USER_KEY, JSON.stringify(data));
};

// Obtener el saldo del usuario
export const getUserBalance = () => {
  const userData = getUserData();
  return userData.balance;
};

// Obtener las apuestas activas
export const getActiveBets = () => {
  const userData = getUserData();
  return userData.bets;
};

// Obtener el historial de apuestas
export const getBetHistory = () => {
  const userData = getUserData();
  return userData.betHistory;
};

// Realizar una apuesta
export const placeBet = (betData) => {
  const userData = getUserData();
  
  // Verificar si hay suficiente saldo
  if (userData.balance < betData.amount) {
    throw new Error('Saldo insuficiente para realizar la apuesta');
  }
  
  // Generar ID único para la apuesta
  const betId = Date.now().toString();
  
  // Crear objeto de apuesta
  const newBet = {
    id: betId,
    ...betData,
    status: 'active',
    timestamp: new Date().toISOString()
  };
  
  // Actualizar datos del usuario
  userData.balance -= betData.amount;
  userData.bets.push(newBet);
  
  // Guardar cambios
  saveUserData(userData);
  
  return {
    bet: newBet,
    newBalance: userData.balance
  };
};

// Resolver una apuesta (en un caso real, esto sería automático)
export const resolveBet = (betId, isWinner) => {
  const userData = getUserData();
  
  // Encontrar la apuesta
  const betIndex = userData.bets.findIndex(bet => bet.id === betId);
  if (betIndex === -1) {
    throw new Error('Apuesta no encontrada');
  }
  
  const bet = userData.bets[betIndex];
  
  // Actualizar apuesta
  bet.status = isWinner ? 'won' : 'lost';
  bet.resolvedAt = new Date().toISOString();
  
  // Si ganó, actualizar saldo
  if (isWinner) {
    userData.balance += parseFloat(bet.potential);
  }
  
  // Mover apuesta al historial
  userData.betHistory.push(bet);
  userData.bets.splice(betIndex, 1);
  
  // Guardar cambios
  saveUserData(userData);
  
  return {
    bet,
    newBalance: userData.balance
  };
};

// Depositar fondos
export const depositFunds = (amount) => {
  const userData = getUserData();
  userData.balance += amount;
  saveUserData(userData);
  return userData.balance;
}; 