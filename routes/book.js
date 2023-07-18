/* eslint-disable no-undef */
/* eslint-disable no-mixed-spaces-and-tabs */
const express = require("express");
const router = express.Router();

const bookControllers = require("../controllers/book");

router.post("/", bookControllers.createBook);
router.put("/:id", bookControllers.modifyBook);
router.delete("/:id", bookControllers.removeBook);
router.get("/:id", bookControllers.getOneBook);
router.get("/", bookControllers.getAllBooks);

module.exports = router;