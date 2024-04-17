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
    return contacts.find((contact) => contact.id === contactId) || null;
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

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const addContacts = { id: shortid.generate(), name, email, phone };
    const newContacts = [...contacts, addContacts];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return addContacts;
  } catch (err) {
    throw err;
  }
}

async function invokeAction({ action, id, name, email, phone }) {
  try {
    switch (action) {
      case "list":
        const allContacts = await listContacts();
        console.table(allContacts || null);
        break;

      case "get":
        const contact = await getContactById(id);
        console.log(contact || null);
        break;

      case "add":
        const newContact = await addContact(name, email, phone);
        console.log(newContact || null);
        break;

      case "remove":
        const removedContact = await removeContact(id);

        console.log(removedContact || null);
        break;

      default:
        console.warn("\x1B[31m Unknown action type!");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  invokeAction,
};
