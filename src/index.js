import MicroModal from 'micromodal';
import debounce from 'lodash/debounce';
import { Formik, Field, Form, ErrorMessage } from 'formik';

MicroModal.init();


const handleResize = debounce(() => {
    // Обработка события
}, 200);

window.addEventListener('resize', handleResize);

<Formik initialValues={{ name: '', description: '' }} onSubmit={/* обработчик */}>
  <Form>
    <Field type="text" name="name" />
    <ErrorMessage name="name" component="div" />
    {/* Другие поля формы */}
    <button type="submit">Submit</button>
  </Form>
</Formik>