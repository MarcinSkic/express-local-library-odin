const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pieceOfWorkSchema = new Schema({
    title: { type: String, required: true },
    odin: { type: Boolean, default: true },
    description: String,
    published_at: Date,
    type: { type: String, enum: ["book", "movie", "computer game"] },
    genres: [String], //TODO: Should enforce uniqueness of values in array?
    metadata: {
        type: Map,
        of: [String],
    },
    people: {
        type: Map,
        of: [{ type: Schema.Types.ObjectId, ref: "Person" }],
    },
});

module.exports = mongoose.model(
    "PieceOfWork", //Name of single document in this collection
    pieceOfWorkSchema, //Schema for document
    "PiecesOfWork" //Overriden name of collection, default would be PieceOfWorks
);
