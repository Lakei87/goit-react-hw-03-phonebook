import { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';
import Notification from './Notification';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    };
  };

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;

    if (prevState.contacts !== contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    };
  };

  addContact = data => {
    const { contacts } = this.state;
    const { name, number } = data;
    const isContactInList = contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase());

    if (isContactInList) {
      return alert(`${name} is already in contacts`);
    } else {
        const contact = {
          id: nanoid(),
          name,
          number,
        };
    
        this.setState(({ contacts }) => ({
          contacts: [...contacts, contact],
        }));
    };
  };

  handleFilterChange = e => {
    const { value } = e.currentTarget;

    this.setState({
      filter: value,
    });
  };

  filtersContactList = () => {
    const { contacts, filter } = this.state;
    const valueInLowerCase = filter.toLowerCase();

    return contacts.filter(({ name }) => name.toLowerCase().includes(valueInLowerCase));
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  render() {
    const { filter, contacts } = this.state;
    const { addContact, handleFilterChange, deleteContact } = this;
    const filteredContacts = this.filtersContactList();

    return (
      <div
        style={{
          textAlign: 'center',
        }}
      >

        <h1>Phonebook</h1>
        <ContactForm onSubmit={addContact} />
        <h2>Contacts</h2>
        {contacts.length === 0
          ? (<Notification message={'Phonebook is empty. Please add new contact.'} />)
          : <>
            <Filter onChange={handleFilterChange} value={filter} />
            <ContactList contacts={filteredContacts} onBtnClick={deleteContact} />
          </>}
  
      </div>
    );   
  };
};

export default App;