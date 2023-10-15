import React, { useState } from 'react';

const CreateTicketModal = ({ isOpen, onClose, onSave }) => {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Отправляем данные на сервер
    fetch('/api/createTicket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    })
      .then((response) => response.json())
      .then((createdTicket) => {
        // Обработка успешного создания тикета
        console.log('Создан новый тикет:', createdTicket);
        
        // Очищаем поля формы
        setTicketData({
          title: '',
          description: '',
        });

        // Закрываем модальное окно
        onClose();
      })
      .catch((error) => {
        console.error('Ошибка при создании тикета:', error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Заголовок:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={ticketData.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="description">Описание:</label>
            <textarea
              id="description"
              name="description"
              value={ticketData.description}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Создать тикет</button>
          <button onClick={onClose}>Отмена</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
