import PropTypes from 'prop-types';
import Form from '../Form';
import Contacts from '../Contacts';
import { TitleH1, SectionStyle } from './Section.styled';
import { Notify } from 'notiflix';
Notify.init({ position: 'center-top' });

function Section({ title, component, searchFunc, deleteFunc, data, doAddContact }) {
  function onSubmit(e) {
    e.preventDefault();
    const nameRef = e.target.children[0].children[1];
    const numberRef = e.target.children[1].children[1];
    const inputName = nameRef.value.trim();
    const inputNumber = numberRef.value;

    if (checkNumberExists(inputNumber)) {
      if (inputNumber) Notify.warning('Sorry. This NUMBER already exists.');
      return;
    }
    if (checkNameExists(inputName)) {
      Notify.warning('Sorry. This NAME already exists.');
      return;
    }

    nameRef.value = '';
    numberRef.value = '';
    doAddContact(inputName, inputNumber);
  }

  function checkNumberExists(inputNumber) {
    const clearNumber = doClearNumber(inputNumber);
    const contacts = data.contacts;
    let result = false;
    if (inputNumber === '') result = true;
    contacts.forEach(({ number }) => {
      if (clearNumber === doClearNumber(number)) result = true;
    });
    return result;
  }

  function checkNameExists(inputName) {
    const contacts = data.contacts;
    let result = false;
    const clearName = doClearName(inputName);
    if (clearName === '') result = true;
    contacts.forEach(({ name }) => {
      if (clearName === doClearName(name)) result = true;
    });
    return result;
  }

  function doClearName(name) {
    return name.split(' ').join('').toLowerCase().trim();
  }

  function doClearNumber(number) {
    const noSpace = number.split(' ').join('');
    const noBracket = noSpace.split('(').join('').split(')').join('');
    const noSign = noBracket.split('-').join('').split('+').join('');
    return noSign;
  }

  function parseSearchQuery(searchQuery) {
    let searchQueryText = '';
    let searchQueryNumber = '';
    if (searchQuery) {
      if (searchQuery.match(/\d+/)) {
        searchQueryNumber = searchQuery.match(/\d+/).toString();
        const queries = searchQuery.split(searchQueryNumber);
        const query = queries[0] || queries[1];
        searchQueryText = query ? query : '';
      } else {
        searchQueryText = searchQuery;
      }
    }
    return { searchQueryText, searchQueryNumber };
  }

  function getContacts() {
    const { filter, contacts } = data;
    const { searchQueryText, searchQueryNumber } = parseSearchQuery(filter.toString());
    if (searchQueryText.length > 0 || searchQueryNumber.length > 0) {
      let filtredArray = [];
      //поиск по номеру
      if (searchQueryNumber.length > 0) {
        filtredArray = contacts.filter(({ number }) => {
          const clearNumberText = doClearNumber(number);
          return clearNumberText.includes(searchQueryNumber);
        });
        //комбинированый поиск
        if (searchQueryText.length > 0) {
          const namesArray = contacts.filter(({ name }) => name.toLowerCase().includes(searchQueryText));
          return filtredArray.length > 0 ? filtredArray.concat(namesArray) : namesArray;
        }
        return filtredArray;
      } else {
        //Поиск по имени
        filtredArray = contacts.filter(({ name }) => name.toLowerCase().includes(searchQueryText));
        return filtredArray;
      }
    }
    return contacts;
  }

  function checkForDoubleID(contacts) {
    const idList = [];
    const filtredList = [];
    contacts.forEach(contact => {
      if (idList.indexOf(contact.id) < 0) {
        idList.push(contact.id);
        filtredList.push(contact);
      }
    });
    return filtredList;
  }

  const contacts = checkForDoubleID(getContacts());
  return (
    <SectionStyle>
      <TitleH1>{title}</TitleH1>
      {component === 'Form' && <Form onSubmit={onSubmit} />}
      {component === 'Contacts' && (
        <Contacts
          contacts={contacts}
          searchFunc={searchFunc}
          deleteFunc={deleteFunc}
          message={data.length ? 'Sorrry, no contacts found.' : 'Sorrry, you have no contacts yet.'}
        />
      )}
    </SectionStyle>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  doAddContact: PropTypes.func,
  searchFunc: PropTypes.func,
  deleteFunc: PropTypes.func,
};

export default Section;
