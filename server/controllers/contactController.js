const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Could not send message", error: error.message });
  }
};

const getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
};

module.exports = { createContact, getContacts };

