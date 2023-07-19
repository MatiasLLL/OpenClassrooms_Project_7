/* eslint-disable no-undef */
/* eslint-disable no-mixed-spaces-and-tabs */
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const bookControllers = require("../controllers/book");

router.get("/", auth, bookControllers.getAllBooks);
router.post("/", auth, bookControllers.createBook);
router.get("/:id", auth, bookControllers.getOneBook);
router.put("/:id", auth, bookControllers.modifyBook);
router.delete("/:id", auth, bookControllers.removeBook);

module.exports = router;