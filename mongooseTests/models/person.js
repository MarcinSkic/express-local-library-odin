const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personSchema = new Schema({
    firstname: String,
    surname: String,
    nick: String,
});

personSchema.pre("validate", function (next) {
    if ((!this.firstname || !this.surname) && !this.nick) {
        this.invalidate(
            "firstname",
            "Person is required to have name and surname or nick specified",
            this.nick
        );
    }

    next();
});

module.exports = mongoose.model("Person", personSchema, "People");
