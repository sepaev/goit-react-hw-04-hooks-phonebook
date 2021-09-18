import { Fragment, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Section from './components/Section';
import { Notify } from 'notiflix';

Notify.init({ position: 'center-top' });

function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const makeSearch = e => {
    const searchQuery = e.target.valuetrim().toLowerCase();
    setFilter(searchQuery);
  };

  const doDeleteContact = id => {
    if (!id) return;
    const newArr = [];
    let reportName;
    contacts.forEach(contact => {
      if (contact.id !== id) {
        newArr.push(contact);
      } else {
        reportName = contact.name;
      }
    });
    if (newArr.length === contacts.length) {
      Notify.failure('Oh, no! Nothing was deleted.');
      return;
    }
    setContacts(newArr);
    Notify.info(`Contact ${reportName} was removed successfully`);
  };

  const doAddContact = (name, number) => {
    setContacts(prevState => [...prevState, { id: uuidv4(), name, number }]);
    Notify.success('Well Done! Added ' + name);
  };

  useEffect(() => {
    const storage = JSON.parse(window.localStorage.getItem('contacts'));
    if (storage) setContacts(storage);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  return (
    <Fragment>
      <Section title='Phonebook' component='Form' data={{ contacts, filter }} doAddContact={doAddContact} />
      <hr />
      <Section
        title='Contacts'
        component='Contacts'
        data={{ contacts, filter }}
        searchFunc={makeSearch}
        deleteFunc={doDeleteContact}
      />
    </Fragment>
  );
}

export default App;
