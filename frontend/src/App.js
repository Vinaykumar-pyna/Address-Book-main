import React, {useState, useEffect} from 'react';
import './App.css';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import {fetchContacts} from './services/api';
import {format, parse} from 'date-fns';
import {RiFileAddLine} from 'react-icons/ri';
import {BiArrowFromBottom, BiArrowFromTop} from 'react-icons/bi';
import {FaWindowClose} from 'react-icons/fa';

function generateCSV(contacts) {
    const csvHeaders = ['Name', 'Phone Number', 'Email', 'Address', 'Created Date'];
    const csvData = contacts.map((contact) => [
        contact.name,
        contact.phoneNumber,
        contact.email,
        contact.address || '',
        format(new Date(contact.createdDate), 'dd/MM/yyyy'),
    ]);
    return `${csvHeaders.join(',')}\n${csvData.map((row) => row.join(',')).join('\n')}`;
}

function App() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [_, setErrorMessage] = useState('');
    const [importedContacts, setImportedContacts] = useState([]);

    const fetchContactsData = async () => {
        try {
            const data = await fetchContacts();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setErrorMessage('Failed to fetch contacts');
        }
    };
    const handleImportCSV = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = async (event) => {
                const contents = event.target.result;

                const rows = contents.split('\n');
                const importedContactsData = rows.slice(1).map((row, index) => {
                    const [name, phoneNumber, email, address, createdDate] = row.split(',');

                    const [day, month, year] = createdDate.split('/');
                    const parsedDate = parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date());

                    return {
                        _id: `imported_${index}`,
                        name,
                        phoneNumber,
                        email,
                        address,
                        createdDate: format(parsedDate, 'yyyy/MM/dd'),
                    };
                });

                setImportedContacts(importedContactsData);
            };

            reader.readAsText(file);
        }
    };

    const handleExportCSV = () => {
        const csvData = generateCSV(contacts);
        const blob = new Blob([csvData], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contacts.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    };

    useEffect(() => {
        fetchContactsData();
    }, []);

    return (
        <div className="App">
            <header>
                <h1>Contact Management Web App</h1>
                <div className="header-actions">
                    <button onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? <FaWindowClose/> : <RiFileAddLine/>}
                    </button>
                    <button onClick={handleExportCSV}>
                        <BiArrowFromBottom/>
                    </button>

                    <label className="import-button">
                        <input type="file" accept=".csv" onChange={handleImportCSV} style={{display: 'none'}}/>
                        <span role="img" aria-label="Import" tabIndex={0}><BiArrowFromTop/></span>
                    </label>
                </div>
            </header>
            <main>
                {showAddForm && <ContactForm/>}
                <ContactList contacts={importedContacts.length > 0 ? importedContacts : contacts}/>
            </main>
        </div>
    );
}

export default App;
