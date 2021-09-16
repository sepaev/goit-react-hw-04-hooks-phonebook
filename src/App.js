import { Component, Fragment, useState, use } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Section from './components/Section';

import { Notify } from 'notiflix';
Notify.init({ position: 'center-top' });

function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const makeSearch = e => {
    const searchQuery = e.target.value.toLowerCase();
    setFilter(searchQuery);
  };

  const doDeleteContact = id => {
    const newArr = [];
    let reportName;
    if (!id) return;

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

class AppOld extends Component {
  componentDidMount() {
    const storage = JSON.parse(localStorage.getItem('contacts'));
    if (storage) {
      this.setState({ contacts: storage });
    } else {
      this.setState({ contscts: [], filter: '' });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }
  render() {}
}

export default App;
