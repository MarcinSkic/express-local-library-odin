const author = require("../models/author");
const Author = require("../models/author");
const Book = require("../models/book");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.author_list = asyncHandler(async (req, res, next) => {
    const authors = await Author.find().sort({ family_name: 1 }).exec();
    res.render("author_list", {
        title: "Author List",
        author_list: authors,
    });
});

exports.author_detail = asyncHandler(async (req, res, next) => {
    const [author, books] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (author === null) {
        const err = new Error("Author not found.");
        err.status = 404;
        return next(err);
    }

    res.render("author_detail", {
        title: "Author Detail",
        author: author,
        author_books: books,
    });
});

exports.author_create_get = asyncHandler(async (req, res, next) => {
    res.render("author_form", { title: "Create Author" });
});

exports.author_create_post = [
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified"),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body("date_of_death", "Invalid date of death")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        });

        if (!errors.isEmpty()) {
            res.render("author_form", {
                title: "Create author",
                author: author,
                errors: errors.array(),
            });
        } else {
            await author.save();

            res.redirect(author.url);
        }
    }),
];

// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete GET");
});

// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete POST");
});

// Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST");
});
