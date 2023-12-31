// ticketList.js

import { getAllTickets, deleteTicket } from './api';

const ticketListContainer = document.getElementById('ticket-list-container');

async function renderTicketList() {
    const tickets = await getAllTickets();
    ticketListContainer.innerHTML = '';

    tickets.forEach(ticket => {
        const ticketItem = document.createElement('div');
        ticketItem.classList.add('ticket-item');
        ticketItem.innerHTML = `
        <h3>${ticket.name}</h3>
        <p>Status: <input type="checkbox" class="status-checkbox" data-ticket-id="${ticket.id}" ${ticket.status ? 'checked' : ''}></p>
        <p>Description: ${ticket.description}</p>
        <button class="delete-button" data-ticket-id="${ticket.id}">Delete</button>
        <button class="edit-button" data-ticket-id="${ticket.id}">Edit</button>
        `;
        ticketListContainer.appendChild(ticketItem);
    });

    async function openTicketDetails(ticketId) {
        const ticketDetails = await getTicketById(ticketId); // Получение подробной информации о тикете
    
        // Отображение подробной информации о тикете на странице (например, в модальном окне)
        const ticketDetailsModal = document.getElementById('ticket-details-modal');
        const detailsContent = ticketDetailsModal.querySelector('.modal-content');
        detailsContent.innerHTML = `
            <h2>Ticket Details</h2>
            <p>ID: ${ticketDetails.id}</p>
            <p>Name: ${ticketDetails.name}</p>
            <p>Status: ${ticketDetails.status ? 'Done' : 'Pending'}</p>
            <p>Description: ${ticketDetails.description}</p>
            <p>Created: ${new Date(ticketDetails.created).toLocaleString()}</p>
        `;
    
        // Отображение модального окна с подробной информацией о тикете
        MicroModal.show('ticket-details-modal');
    }
    
    // Добавление обработчика события клика на тело тикета
    ticketListContainer.addEventListener('click', event => {
        if (event.target.classList.contains('ticket-item')) {
            const ticketId = event.target.dataset.ticketId;
            openTicketDetails(ticketId);
        }
    });

    async function updateTicketStatus(ticketId, newStatus) {
        const updatedData = { status: newStatus };
        const updatedTicket = await updateTicket(ticketId, updatedData); // Обновление на сервере
        if (updatedTicket) {
            renderTicketList(); // Обновляем список после обновления состояния
        }
    }

    async function openEditModal(ticketId) {
        // Получите текущие данные тикета с помощью функции для получения подробной информации о тикете (не забудьте реализовать эту функцию)
        const ticketData = await getTicketDetails(ticketId);
    
        // Заполните форму данными тикета
        const editForm = document.getElementById('edit-ticket-form');
        editForm.elements.name.value = ticketData.name;
        editForm.elements.description.value = ticketData.description;
    
        // Добавьте обработчик события отправки формы
        editForm.addEventListener('submit', async event => {
            event.preventDefault();
    
            const updatedData = {
                name: editForm.elements.name.value,
                description: editForm.elements.description.value,
                // Дополните другими полями, если необходимо
            };
    
            const updatedTicket = await updateTicket(ticketId, updatedData);
    
            if (updatedTicket) {
                // Обновите список тикетов после успешного обновления
                renderTicketList();
    
                // Закройте модальное окно редактирования (пример: MicroModal.close('edit-ticket-modal'))
                MicroModal.close('edit-ticket-modal');
            }
        });
    
        // Откройте модальное окно редактирования (пример: MicroModal.show('edit-ticket-modal'))
        MicroModal.show('edit-ticket-modal');
    }
    
    // Добавление обработчика события для изменения состояния тикета
    ticketListContainer.addEventListener('change', event => {
        if (event.target.classList.contains('status-checkbox')) {
            const ticketId = event.target.dataset.ticketId;
            const newStatus = event.target.checked;
            updateTicketStatus(ticketId, newStatus);
        }
    });

    // Добавляем обработчик для кнопок "Удалить"
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const ticketId = button.dataset.ticketId;
            const success = await deleteTicket(ticketId);
            if (success) {
                renderTicketList(); // Обновляем список после удаления
            }
        });
    });
}

export { renderTicketList };
