const Genre = require("../models/genre");
const Book = require("../models/book");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
    const genres = await Genre.find().sort({ name: 1 }).exec();
    res.render("genre_list", {
        title: "Genre List",
        genre_list: genres,
    });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (genre === null) {
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }

    res.render("genre_detail", {
        title: "Genre Detail",
        genre: genre,
        genre_books: booksInGenre,
    });
});

// Display Genre create form on GET.
exports.genre_create_get = async (req, res, next) => {
    res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
    body("name", "Genre must contain at least 3 characters")
        .trim()
        .isLength(3)
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors.array());

        const genre = new Genre({ name: req.body.name });
        if (!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Create genre",
                genre: genre,
                errors: errors.array(),
            });
            return;
        } else {
            const genreExists = await Genre.findOne({
                name: req.body.name,
            }).exec();

            if (genreExists) {
                res.redirect(genreExists.url);
            } else {
                await genre.save();
                res.redirect(genre.url);
            }
        }
    }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    const [genre, booksFromGenre] = await Promise.all([
        Genre.findById(req.params.id),
        Book.find({ genre: req.params.id }),
    ]);

    if (genre === null) {
        res.redirect("/catalog/genres");
        return;
    }

    res.render("genre_delete", {
        title: "Delete Genre",
        genre,
        genre_books: booksFromGenre,
    });
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    const [genre, booksFromGenre] = await Promise.all([
        Genre.findById(req.params.id),
        Book.find({ genre: req.params.id }),
    ]);

    if (genre === null) {
        res.redirect("/catalog/genres");
        return;
    }

    if (booksFromGenre.length > 0) {
        res.render("genre_delete", {
            title: "Delete Genre",
            genre,
            genre_books: booksFromGenre,
        });
    } else {
        await Genre.findByIdAndRemove(req.params.id);
        res.redirect("/catalog/genres");
    }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update POST");
});
