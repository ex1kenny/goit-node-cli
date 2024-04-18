import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import shortid from "shortid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = path.resolve(__dirname, "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    throw err;
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts.find((contact) => contact.id === contactId);
  } catch (err) {
    throw err;
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const removedIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (removedIndex === -1) {
      return null;
    }
    const removedContact = contacts.splice(removedIndex, 1)[0];
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (err) {
    throw err;
  }
}

const randomID = () => {
  let id = shortid.generate();
  const extraChars = 20 - id.length;
  const randomChars = Array.from({ length: extraChars }, () =>
    Math.random().toString(36).substr(2, 1)
  ).join("");
  return id + randomChars;
};

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const addContacts = { id: randomID(), name, email, phone };
    const newContacts = [...contacts, addContacts];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return addContacts;
  } catch (err) {
    throw err;
  }
}

export { listContacts, getContactById, removeContact, addContact };
