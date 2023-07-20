/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const path = require("path");
require("dotenv").config();

mongoose.connect(`mongodb+srv://${process.env.CONNEXION}/?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true }) 
	.then(() => console.log("Connection to MongoDB successful!"))
	.catch(() => console.log("Connection to MongoDB failed!"));

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;