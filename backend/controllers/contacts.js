const Contact = require('../models/contact');
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({message: 'Contact not found'});
        }
        res.json(contact);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
const addContact = async (req, res) => {
    const {name, phoneNumber, email, address} = req.body;
    try {
        const existingContact = await Contact.findOne({$or: [{phoneNumber}, {email}]});
        if (existingContact) {
            if (existingContact.phoneNumber === phoneNumber) {
                return res.status(400).json({message: 'Duplicate phone number'});
            } else {
                return res.status(400).json({message: 'Duplicate email address'});
            }
        }
        const contact = new Contact({
            name,
            phoneNumber,
            email,
            address,
        });
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        if (!contact) {
            return res.status(404).json({message: 'Contact not found'});
        }
        res.json(contact);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndRemove(req.params.id);
        if (!contact) {
            return res.status(404).json({message: 'Contact not found'});
        }
        res.json({message: 'Contact deleted'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
module.exports = {
    getContacts,
    getContact,
    addContact,
    updateContact,
    deleteContact,
};