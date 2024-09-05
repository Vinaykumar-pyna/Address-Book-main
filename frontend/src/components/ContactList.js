import React, {useState, useEffect} from 'react';
import {deleteContact, updateContact} from '../services/api';
import contactImage from '../images/contact-image.png';
import './ContactList.css';
import {parse} from 'date-fns';

function ContactList({contacts}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const [editMode, setEditMode] = useState({});

    const [editedContacts, setEditedContacts] = useState({});

    useEffect(() => {
        setFilteredContacts(
            contacts.filter((contact) =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [contacts, searchTerm]);

    const toggleContactSelection = (id) => {
        setSelectedContacts((prevSelectedContacts) => {
            if (prevSelectedContacts.includes(id)) {
                setEditMode((prevEditMode) => ({
                    ...prevEditMode,
                    [id]: false,
                }));
                const updatedSelectedContacts = prevSelectedContacts.filter((contactId) => contactId !== id);
                setSelectAllChecked(false);
                return updatedSelectedContacts;
            } else {
                const updatedSelectedContacts = [...prevSelectedContacts, id];
                if (updatedSelectedContacts.length === filteredContacts.length) {
                    setSelectAllChecked(true);
                }
                return updatedSelectedContacts;
            }
        });
    };

    const toggleSelectAll = () => {
        const allSelected = !selectAllChecked;
        setSelectAllChecked(allSelected);
        if (allSelected) {
            setSelectedContacts(filteredContacts.map((contact) => contact._id));
        } else {
            setSelectedContacts([]);
        }
    };

    const handleEdit = (id) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [id]: true,
        }));

        setEditedContacts((prevEditedContacts) => ({
            ...prevEditedContacts,
            [id]: {...(contacts.find((contact) => contact._id === id))},
        }));
    };

    const handleSaveEdit = async (id) => {
        const editedContact = editedContacts[id];
        try {
            await updateContact(id, editedContact);
            setSelectedContacts([]);
            setEditMode((prevEditMode) => ({
                ...prevEditMode,
                [id]: false,
            }));
            window.location.reload();
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    const handleCancelEdit = (id) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [id]: false,
        }));

        setEditedContacts((prevEditedContacts) => {
            const updatedEditedContacts = {...prevEditedContacts};
            delete updatedEditedContacts[id];
            return updatedEditedContacts;
        });
    };
    const handleEditInputChange = (id, field, value) => {
        setEditedContacts((prevEditedContacts) => ({
            ...prevEditedContacts,
            [id]: {
                ...(prevEditedContacts[id] || {}),
                [field]: value,
            },
        }));
    };

    const handleDelete = async (id) => {
        if (selectedContacts.includes(id)) {
            try {
                await deleteContact(id);
                setSelectedContacts((prevSelectedContacts) =>
                    prevSelectedContacts.filter((contactId) => contactId !== id)
                );
                window.location.reload();
            } catch (error) {
                console.error('Error deleting contact:', error);
            }
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const sortedContacts = [...filteredContacts].sort((a, b) => {
        if (sortBy === 'name') {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
        if (sortBy === 'phoneNumber') {
            return sortOrder === 'asc'
                ? a.phoneNumber.localeCompare(b.phoneNumber)
                : b.phoneNumber.localeCompare(a.phoneNumber);
        }
        if (sortBy === 'email') {
            return sortOrder === 'asc'
                ? a.email.localeCompare(b.email)
                : b.email.localeCompare(a.email);
        }
        if (sortBy === 'address') {
            return sortOrder === 'asc'
                ? (a.address || '').localeCompare(b.address || '')
                : (b.address || '').localeCompare(a.address || '');
        }
        if (sortBy === 'createdDate') {
            return sortOrder === 'asc'
                ? parse(a.createdDate, 'dd/MM/yyyy', new Date()) - parse(b.createdDate, 'dd/MM/yyyy', new Date())
                : parse(b.createdDate, 'dd/MM/yyyy', new Date()) - parse(a.createdDate, 'dd/MM/yyyy', new Date());
        }
        return 0;
    });

    return (
        <div className="contact-list">
            <h2>Contact List</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search contacts"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table>
                <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            onChange={toggleSelectAll}
                            checked={selectAllChecked}
                        />
                    </th>
                    <th onClick={() => handleSort('name')}>Name</th>
                    <th onClick={() => handleSort('phoneNumber')}>Phone Number</th>
                    <th onClick={() => handleSort('email')}>Email</th>
                    <th onClick={() => handleSort('address')}>Address</th>
                    <th onClick={() => handleSort('createdDate')}>Created Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedContacts.map((contact) => (
                    <tr key={contact._id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact._id)}
                                onChange={() => toggleContactSelection(contact._id)}
                            />
                        </td>
                        <td>
                            <div className="contact-info">
                                <img
                                    src={contactImage}
                                    alt={contact.name}
                                    className="contact-image"
                                />
                                {editMode[contact._id] ? (
                                    <input
                                        type="text"
                                        value={editedContacts[contact._id]?.name || ''}
                                        onChange={(e) =>
                                            handleEditInputChange(contact._id, 'name', e.target.value)
                                        }
                                    />
                                ) : (
                                    contact.name
                                )}
                            </div>
                        </td>
                        <td>
                            {editMode[contact._id] ? (
                                <input
                                    type="tel"
                                    value={editedContacts[contact._id]?.phoneNumber || ''}
                                    onChange={(e) =>
                                        handleEditInputChange(contact._id, 'phoneNumber', e.target.value)
                                    }
                                />
                            ) : (
                                contact.phoneNumber
                            )}
                        </td>
                        <td>
                            {editMode[contact._id] ? (
                                <input
                                    type="email"
                                    value={editedContacts[contact._id]?.email || ''}
                                    onChange={(e) =>
                                        handleEditInputChange(contact._id, 'email', e.target.value)
                                    }
                                />
                            ) : (
                                contact.email
                            )}
                        </td>
                        <td>
                            {editMode[contact._id] ? (
                                <input
                                    type="text"
                                    value={editedContacts[contact._id]?.address || ''}
                                    onChange={(e) =>
                                        handleEditInputChange(contact._id, 'address', e.target.value)
                                    }
                                />
                            ) : (
                                contact.address || '-'
                            )}
                        </td>
                        <td>{new Date(contact.createdDate).toLocaleDateString('en-US')}</td>
                        <td>
                            {selectedContacts.includes(contact._id) ? (
                                editMode[contact._id] ? (
                                    <div className="crud-operations">
                                        <button onClick={() => handleSaveEdit(contact._id)}>Save</button>
                                        <button onClick={() => handleCancelEdit(contact._id)}>Cancel</button>
                                    </div>
                                ) : (
                                    <div className="crud-operations">
                                        <button onClick={() => handleEdit(contact._id)}>Edit</button>
                                        <button onClick={() => handleDelete(contact._id)}>Delete</button>
                                    </div>
                                )
                            ) : null}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ContactList;