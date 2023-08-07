/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = "4000";
require("dotenv").config();
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const path = require("path");
 
app.listen(PORT, () => {
	console.log("Server listening on Port", PORT);
});

mongoose.connect(`mongodb+srv://${process.env.CONNEXION}/?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true }) 
	.then(() => console.log("Connection to MongoDB successful!"))
	.catch((error) => console.log(error, "Connection to MongoDB failed!"));

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