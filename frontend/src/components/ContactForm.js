import React, {useState} from 'react';
import {addContact} from '../services/api';
import './ContactForm.css';

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        phoneNumber: '',
        email: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        setErrors({...errors, [e.target.name]: ''});
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            setErrors({...errors, name: 'Name should contain only English alphabets and spaces'});
            return;
        }
        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            setErrors({
                ...errors,
                phoneNumber: 'Phone number should be exactly 10 digits with no other characters',
            });
            return;
        }
        if (!validateEmail(formData.email)) {
            setErrors({...errors, email: 'Invalid email address'});
            return;
        }
        try {
            const newContact = await addContact(formData);
            console.log('Contact added:', newContact);
            setFormData({name: '', phoneNumber: '', email: '', address: ''});
            setErrorMessage('');
            window.location.reload();
        } catch (error) {
            console.error('Error adding contact:', error);
            if (error?.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to add contact. Please try again.');
            }
        }
    };
    return (
        <div className="contact-form">
            <h2>Add Contact</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <span className="error-message">{errors.name}</span>
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    <span className="error-message">{errors.phoneNumber}</span>
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <span className="error-message">{errors.email}</span>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Add Contact</button>
            </form>
        </div>
    );
}

export default ContactForm;