/* eslint-disable no-undef */
const { Console } = require("console");
const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");

exports.createBook = async (req, res, next) => {
	const bookObject = JSON.parse(req.body.book);
	delete bookObject.userId;
	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/sharped_${req.file.filename}`
	});
	await sharp(req.file.path)
		.resize(405, 538)
		.png({ quality: 50 })
		.jpeg({ quality: 50 })
		.toFile("images/sharped_" + req.file.filename);
	
	book.save()
		.then(() => res.status(201).json({ message: "Registered!" }))
		.catch(error => res.status(400).json({ error }));
};

exports.modifyBook = async (req, res, next) => {
	const bookObject = req.file ? {
		...JSON.parse(req.body.book),
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/sharped_${req.file.filename}`
	} : { ...req.body };
	if (req.file) {
		await sharp(req.file.path)
			.resize(405, 538)
			.png({ quality: 50 })
			.jpeg({ quality: 50 })
			.toFile("images/sharped_" + req.file.filename);
	}

	delete bookObject._userId;
	Book.findOne({_id: req.params.id})
		.then(book => {
			if (book.userId != req.auth.userId) {
				res.status(401).json({ message : "403: unauthorized request" });
			} else {
				Book.updateOne({_id: req.params.id}, { ...bookObject, _id: req.params.id})
					.then(() => res.status(200).json({ message : "Modified!" }))
					.catch(error => res.status(401).json({ error }));
			}
		})
		.catch(error => res.status(400).json({ error }));
};

exports.removeBook = (req, res, next) => {
	Book.findOne({_id: req.params.id})
		.then(book => {
			if (book.userId != req.auth.userId) {
				res.status(401).json({ message : "403: unauthorized request" });
			} else {
				const filename = book.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({_id: req.params.id})
						.then(() => res.status(200).json({ message : "Modified!" }))
						.catch(error => res.status(401).json({ error }));
				});
			}
		})
		.catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then(book => res.status(200).json(book))
		.catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
	Book.find()
		.then(books => res.status(200).json(books))
		.catch(error => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {
	let averageRating = req.body.rating;
	Book.findOne({ _id: req.params.id })
		.then(book => {
			if (book.ratings.find(rating => rating.userId === req.auth.userId)) {
				return res.status(400).json({ error: "User has already rated this book" });
			} else {
				book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });
				averageRating = book.ratings.reduce((total, rating) => total + rating.grade, 0) / book.ratings.length;
				book.averageRating = averageRating;
				return book.save();
			}
		})
		.then(book => res.status(200).json(book))
		.catch(error => res.status(400).json({ error }));
};

exports.getThreeBestBooks = (req, res, next) => {
	let arrayBooks = [];
	let threeBestBooks = [];
	Book.find()
		.then((books) => {
			books.forEach(book => arrayBooks.push(book));
			const sortedBooksRatings = arrayBooks.sort((a, b) => b.averageRating - a.averageRating);
			threeBestBooks = sortedBooksRatings.slice(0, 3);
			res.status(200).json(threeBestBooks);
		})
		.catch(error => res.status(400).json({ error }));
};

// console.log(sortedBooksRatings);
// console.log(threeBestBooks);