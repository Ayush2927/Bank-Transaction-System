import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addContact, getUserContacts, deleteContact } from "../controller/contact.controller.js";

const contactRouter = express.Router();

contactRouter.post("/add", authMiddleware, addContact);
contactRouter.get("/all", authMiddleware, getUserContacts);
contactRouter.delete("/:id", authMiddleware, deleteContact);

export { contactRouter }