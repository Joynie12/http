import MicroModal from 'micromodal';
import debounce from 'lodash/debounce';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { createTicket } from './api';

MicroModal.init();

const handleResize = debounce(() => {
    // Обработка события
}, 200);

window.addEventListener('resize', handleResize);

// Обработчик для отправки данных формы
const handleSubmit = (values, actions) => {
    createTicket({ name: values.name, description: values.description })
        .then(() => {
            // Успешная отправка
            renderTicketList(); // Обновите список тикетов
            MicroModal.close('create-ticket-modal'); // Закройте модальное окно
        })
        .catch(error => {
            console.error('Error creating ticket:', error);
        });
};

<Formik initialValues={{ name: '', description: '' }} onSubmit={handleSubmit}>
  <Form>
    <Field type="text" name="name" />
    <ErrorMessage name="name" component="div" />
    <Field type="text" name="description" />
    {/* Другие поля формы */}
    <button type="submit">Submit</button>
  </Form>
</Formik>
