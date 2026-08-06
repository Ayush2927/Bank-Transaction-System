import { contactModel } from "../models/contact.model.js";
import { accountModel } from "../models/account.model.js";

async function addContact(req, res) {

    try {

        const { name, targetAccount, nickname } = req.body;

        if (!name || !targetAccount) {
            return res.status(400).json({
                message: "Name and targetAccount ID are required"
            })
        }

        const existingAccount = await accountModel.findById(targetAccount);
        if (!existingAccount) {
            return res.status(404).json({ message: "targetAccount does not exist" })
        }

        const contact = await contactModel.create({
            user: req.user._id,
            name,
            targetAccount,
            nickname: nickname || ""
        });

        return res.status(201).json({
            message: "Contact added successfully",
            contact
        })


    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "This account already is saved in your contacts" })
        }

        return res.status(500).json({
            message: "Error adding contact",
            error: error.message
        })

    }
}

async function getUserContacts(req, res) {
    try {

        const contacts = await contactModel.find({
            user: req.user._id
        }).populate("targetAccount").sort({ name: 1 })

        return res.status(200).json({
            contacts
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching contacts",
            error: error.message
        })
    }
}

async function deleteContact(req, res) {
    try {
        const { id } = req.params;

        const deletedContact = await contactModel.findOneAndDelete({
            _id: id,
            user: req.user._id
        });

        if (!deletedContact) {
            return res.status(404).json({
                message: "Contact not found or unauthorized"
            })
        }

        return res.status(200).json({
            message: "Contact deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting contact",
            error: error.message
        })

    }
}


export { addContact, getUserContacts, deleteContact }