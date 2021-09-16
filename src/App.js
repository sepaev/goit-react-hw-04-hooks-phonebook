import { Component, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { Section } from "./components/Section";

import { Notify } from "notiflix";
Notify.init({ position: "center-top" });

class App extends Component {
  state = {
    contacts: [],
    filter: "",
  };
  doAddContact = (name, number) => {
    Notify.success("Well Done! Added " + name);
    this.setState(({ contacts, filter }) => {
      const newArr = [...contacts, { id: uuidv4(), name, number }];
      return { contacts: newArr, filter };
    });
  };

  makeSearch = (e) => {
    const searchQuery = e.target.value.toLocaleLowerCase();
    this.setState({ filter: searchQuery });
  };

  doDeleteContact = (id) => {
    const { contacts, filter } = this.state;
    const newArr = [];
    let reportName;
    if (!id) return;

    contacts.forEach((contact) => {
      if (contact.id !== id) {
        newArr.push(contact);
      } else {
        reportName = contact.name;
      }
    });

    if (newArr.length === contacts.length) {
      Notify.failure("Oh, no!");
      return;
    }

    this.setState(() => {
      return { contacts: newArr, filter };
    });

    Notify.info(`Contact ${reportName} was removed successfully`);
  };
  componentDidMount() {
    const storage = JSON.parse(localStorage.getItem("contacts"));
    if (storage) {
      this.setState({ contacts: storage });
    } else {
      this.setState({ contscts: [], filter: "" });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
    }
  }
  render() {
    return (
      <Fragment>
        <Section
          title="Phonebook"
          component="Form"
          data={this.state}
          doAddContact={this.doAddContact}
        />
        <hr />
        <Section
          title="Contacts"
          component="Contacts"
          data={this.state}
          searchFunc={this.makeSearch}
          deleteFunc={this.doDeleteContact}
        />
      </Fragment>
    );
  }
}

export default App;
