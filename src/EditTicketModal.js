import React, { useState } from 'react';

const EditTicketModal = ({ isOpen, onClose, onSave, ticket }) => {
  const [editedTicketData, setEditedTicketData] = useState({
    title: ticket.title,
    description: ticket.description,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTicketData({
      ...editedTicketData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Отправляем данные на сервер для обновления тикета
    fetch(`/api/updateTicket/${ticket.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedTicketData),
    })
      .then((response) => response.json())
      .then((updatedTicket) => {
        // Обработка успешного обновления тикета
        console.log('Тикет обновлен:', updatedTicket);
        onSave(updatedTicket);
      })
      .catch((error) => {
        console.error('Ошибка при обновлении тикета:', error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Ticket</h2>
        <form>
          <div>
            <label htmlFor="title">Заголовок:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editedTicketData.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="description">Описание:</label>
            <textarea
              id="description"
              name="description"
              value={editedTicketData.description}
              onChange={handleInputChange}
            />
          </div>
        </form>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditTicketModal;

