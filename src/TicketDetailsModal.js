import React, { useState } from 'react';

const TicketDetailsModal = ({ isOpen, ticket, onClose }) => {
  // Состояние, чтобы отслеживать, открыто ли модальное окно
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Функция для переключения состояния (открыто/закрыто)
  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ticket Details</h2>
        <p>
          <strong>Title:</strong> {ticket.title}
        </p>
        <button onClick={toggleDetails}>
          {isDetailsOpen ? 'Hide Details' : 'Show Details'}
        </button>
        {isDetailsOpen && (
          <div>
            <p>
              <strong>Description:</strong> {ticket.description}
            </p>
            {/* Добавьте другие детали тикета, если необходимо */}
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
