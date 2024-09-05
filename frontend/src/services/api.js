const BASE_URL = 'http://localhost:5000/api/contacts';

export async function fetchContacts() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch contacts');
    }
    return response.json();
}

export async function addContact(contactData) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
    });
    if (!response.ok) {
        throw new Error('Failed to add contact');
    }
    return response.json();
}

export async function deleteContact(contactId) {
    const response = await fetch(`${BASE_URL}/${contactId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete contact');
    }
}

export async function updateContact(contactId, updatedContactData) {
    const response = await fetch(`${BASE_URL}/${contactId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContactData),
    });
    if (!response.ok) {
        throw new Error('Failed to update contact');
    }
    return response.json();
}