import MicroModal from 'micromodal';
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

function createTicketOnServer(ticketData) {
    // Отправка данных о новом тикете на сервер
    return fetch('?method=createTicket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error creating ticket:', error);
            return null;
        });
}

function updateTicketOnServer(ticketId, updatedData) {
    // Отправка обновленных данных на сервер
    return fetch(`?method=updateById&id=${ticketId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error updating ticket:', error);
            return null;
        });
}

function deleteTicketOnServer(ticketId) {
    // Удаление тикета на сервере
    return fetch(`?method=deleteById&id=${ticketId}`, {
        method: 'GET',
    })
        .then(response => {
            if (response.status === 204) {
                return true;
            } else {
                console.error('Error deleting ticket');
                return false;
            }
        })
        .catch(error => {
            console.error('Error deleting ticket:', error);
            return false;
        });
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

// Обработчик клика на кнопку "Add Ticket"
document.getElementById('add-ticket-button').addEventListener('click', () => {
    MicroModal.show('create-ticket-modal');
});

// Обработчик закрытия модального окна для создания тикета
document.querySelector('.modal__close').addEventListener('click', () => {
    MicroModal.close('create-ticket-modal');
});

function showTicketDetails(ticketId) {
    // Получаем модальное окно для подробной информации о тикете
    const ticketDetailsModal = document.getElementById('ticket-details-modal');

    // Получаем элементы, в которые будем вставлять данные
    const ticketNameElement = ticketDetailsModal.querySelector('#ticket-name');
    const ticketDescriptionElement = ticketDetailsModal.querySelector('#ticket-description');
    const ticketStatusElement = ticketDetailsModal.querySelector('#ticket-status');

    // Выполняем запрос на сервер для получения подробных данных о тикете
    fetch(`?method=ticketById&id=${ticketId}`)
        .then(response => response.json())
        .then(ticketDetails => {
            // Заполняем элементы данными о тикете
            ticketNameElement.textContent = ticketDetails.name;
            ticketDescriptionElement.textContent = ticketDetails.description;
            ticketStatusElement.textContent = ticketDetails.status ? 'Done' : 'Not Done';

            // Открываем модальное окно
            MicroModal.show('ticket-details-modal');
        })
        .catch(error => {
            console.error('Error fetching ticket details:', error);
            // Здесь можно добавить обработку ошибки, если не удалось получить данные о тикете
        });
}

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

// Обработчик клика на кнопку "Edit"
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-button')) {
        const ticketId = event.target.getAttribute('data-ticket-id');
        openEditModal(ticketId);
    }
});

// Обработчик закрытия модального окна для редактирования тикета
document.querySelector('.modal__close').addEventListener('click', () => {
    MicroModal.close('edit-ticket-modal');
});

// Обработчик события для изменения состояния чекбокса "Сделано"
document.addEventListener('change', (event) => {
    if (event.target.classList.contains('status-checkbox')) {
        const ticketId = event.target.getAttribute('data-ticket-id');
        const newStatus = event.target.checked;

        // Вызываем функцию для обновления состояния тикета на сервере
        updateTicketStatus(ticketId, newStatus);
    }
});


// Функция для обновления состояния тикета на сервере
function updateTicketStatus(ticketId, isChecked) {
    const updatedData = { status: isChecked };

    // Отправляем запрос на обновление состояния тикета на сервере
    updateTicket(ticketId, updatedData)
        .then((response) => {
            if (response) {
                // Обновляем список тикетов после успешного обновления
                renderTicketList();
            }
        });
}

// Функция для открытия модального окна редактирования
function openEditModal(ticketId, useServerData = false) {
    const editTicketModal = document.getElementById('edit-ticket-modal');
    const editForm = editTicketModal.querySelector('#edit-form');

    if (useServerData) {
        // Загрузка данных о тикете с сервера
        fetch(`?method=ticketById&id=${ticketId}`)
            .then(response => response.json())
            .then(ticketData => {
                // Заполнение формы данными о тикете
                editForm.querySelector('[name="ticket-id"]').value = ticketId;
                editForm.querySelector('[name="name"]').value = ticketData.name;
                editForm.querySelector('[name="description"]').value = ticketData.description;
                editForm.querySelector('[name="status"]').checked = ticketData.status;

                // Открываем модальное окно для редактирования
                MicroModal.show('edit-ticket-modal');
            })
            .catch(error => {
                console.error('Error fetching ticket details:', error);
            });
    } else {
        // Получаем данные о выбранном тикете по его ID (здесь вам нужно получить данные с сервера)
        const selectedTicket = tickets.find(ticket => ticket.id === ticketId);

        // Заполняем форму в модальном окне значениями выбранного тикета
        editForm.querySelector('[name="ticket-id"]').value = selectedTicket.id;
        editForm.querySelector('[name="name"]').value = selectedTicket.name;
        editForm.querySelector('[name="description"]').value = selectedTicket.description;
        editForm.querySelector('[name="status"]').checked = selectedTicket.status;

        // Отображаем модальное окно для редактирования с помощью MicroModal
        MicroModal.show('edit-ticket-modal');
    }
}

export { getAllTickets, createTicketOnServer, updateTicketOnServer, deleteTicketOnServer, renderTicketList, openEditModal };
