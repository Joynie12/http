import React from 'react';
import axios from 'axios'; // Импортируем библиотеку axios

const DeleteTicketModal = ({ isOpen, onClose, onDelete }) => {
  const handleDelete = () => {
    // Здесь мы отправляем DELETE запрос на сервер для удаления тикета
    axios.delete('/api/deleteTicket') // Замените '/api/deleteTicket' на URL вашего сервера
      .then((response) => {
        if (response.status === 200) {
          // Если удаление прошло успешно, вызываем onDelete для обновления списка тикетов
          onDelete();
        } else {
          console.error('Ошибка при удалении тикета:', response.data);
          onClose();
        }
      })
      .catch((error) => {
        console.error('Ошибка при удалении тикета:', error);
        onClose();
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this ticket?</p>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteTicketModal;

