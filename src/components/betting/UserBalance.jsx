import React, { useState } from 'react';
import './UserBalance.css';
import { depositFunds } from '../../services/bettingService';

const UserBalance = ({ balance, onBalanceUpdate }) => {
  const [depositAmount, setDepositAmount] = useState(20);
  const [showDeposit, setShowDeposit] = useState(false);
  
  const handleDeposit = () => {
    const newBalance = depositFunds(depositAmount);
    onBalanceUpdate(newBalance);
    setShowDeposit(false);
  };
  
  return (
    <div className="user-balance">
      <div className="balance-display">
        <span className="balance-label">Tu Saldo:</span>
        <span className="balance-amount">{balance.toFixed(2)}€</span>
        <button 
          className="deposit-button"
          onClick={() => setShowDeposit(!showDeposit)}
        >
          {showDeposit ? 'Cancelar' : 'Depositar'}
        </button>
      </div>
      
      {showDeposit && (
        <div className="deposit-form">
          <label htmlFor="deposit-amount">Cantidad a depositar (€):</label>
          <input 
            type="number" 
            id="deposit-amount"
            min="10"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
          />
          <button className="confirm-deposit" onClick={handleDeposit}>
            Confirmar Depósito
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBalance; 