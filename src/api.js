import { renderTicketList } from './ticketList';
import MicroModal from 'micromodal';
import { createTicket, updateTicket, deleteTicket, getAllTickets } from './api';
import './styles.css';

// Функция для выполнения запроса на получение списка тикетов
async function getAllTickets() {
    try {
        const response = await fetch('?method=allTickets');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return [];
    }
}

// Функция для создания нового тикета
async function createTicket(ticketData) {
    try {
        const response = await fetch('?method=createTicket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticketData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating ticket:', error);
        return null;
    }
}

// Функция для обновления тикета
async function updateTicket(ticketId, updatedData) {
    try {
        const response = await fetch(`?method=updateById&id=${ticketId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating ticket:', error);
        return null;
    }
}

// Функция для удаления тикета
async function deleteTicket(ticketId) {
    try {
        const response = await fetch(`?method=deleteById&id=${ticketId}`, {
            method: 'GET'
        });
        if (response.status === 204) {
            return true;
        } else {
            console.error('Error deleting ticket');
            return false;
        }
    } catch (error) {
        console.error('Error deleting ticket:', error);
        return false;
    }
}

MicroModal.init();

// Обработчик события для кнопки "Добавить тикет"
const addButton = document.getElementById('add-ticket-button');
addButton.addEventListener('click', () => {
    // Отображение модального окна для создания тикета с помощью MicroModal
    MicroModal.show('create-ticket-modal'); // 'create-ticket-modal' - это ID вашего модального окна
});

// Вызываем функцию для отображения списка тикетов при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    renderTicketList();
});

const ticketListContainer = document.getElementById('ticket-list-container');

async function renderTicketList() {
    const tickets = await getAllTickets();
    ticketListContainer.innerHTML = '';

    tickets.forEach(ticket => {
        const ticketItem = document.createElement('div');
        ticketItem.classList.add('ticket-item');
        ticketItem.innerHTML = `
            <h3>${ticket.name}</h3>
            <p>Status: ${ticket.status ? 'Done' : 'Pending'}</p>
            <p>Description: ${ticket.description}</p>
            <button class="delete-button" data-ticket-id="${ticket.id}">Delete</button>
            <button class="edit-button" data-ticket-id="${ticket.id}">Edit</button>
        `;
        ticketListContainer.appendChild(ticketItem);
    });

    // Добавляем обработчики для кнопок "Удалить" и "Редактировать"
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

    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ticketId = button.dataset.ticketId;
            openEditModal(ticketId);
        });
    });
}

// Функция для открытия модального окна редактирования
function openEditModal(ticketId) {
    // Получаем данные о выбранном тикете по его ID (здесь вам нужно получить данные с сервера)
    const selectedTicket = tickets.find(ticket => ticket.id === ticketId);

    // Заполняем форму в модальном окне значениями выбранного тикета
    const editForm = document.getElementById('edit-form'); // ID вашей формы редактирования
    editForm.querySelector('[name="ticket-id"]').value = selectedTicket.id;
    editForm.querySelector('[name="name"]').value = selectedTicket.name;
    editForm.querySelector('[name="description"]').value = selectedTicket.description;
    editForm.querySelector('[name="status"]').checked = selectedTicket.status;

    // Отображаем модальное окно для редактирования с помощью MicroModal
    MicroModal.show('edit-ticket-modal');
}

export { getAllTickets, createTicket, updateTicket, deleteTicket, renderTicketList, openEditModal };
