require("dotenv").config();
const mongoose = require("mongoose");
const PieceOfWorkModel = require("./models/pieceOfWork");
const PersonModel = require("./models/person");

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGOOSE_TEST_CONNECTION_STRING);

    // await testPersonValidator();

    mongoose.disconnect();
}

async function testPersonValidator() {
    try {
        const noSurname = new PersonModel({ firstname: "Maria" });
        await noSurname.save();
    } catch (e) {
        console.log(e.message);
    }
}

async function addHarry() {
    const harryPotter = new PieceOfWorkModel({
        title: "Harry Potter and The Deathly Hallows",
    });
    await harryPotter.save();
    harryPotter.title = "Harry Potter and The Prisoner Of Azkaban";
    await harryPotter.save();
}

async function findHarrys() {
    const harrys = await PieceOfWorkModel.where("title") // Or where("field",regex)
        .regex(/Harry/i)
        .select({
            title: 1,
            genres: 1,
            _id: 0,
        })
        .exec();

    console.log(harrys);
}

async function createHermione() {
    const hermione = new PersonModel({
        firstname: "Emma",
        surname: "Watson",
    });

    await hermione.save();
}

async function assignHermione() {
    const harry = await PieceOfWorkModel.where("title")
        .regex(/Harry/i)
        .select("people")
        .findOne();

    if (!harry.people?.has("actors")) {
        harry.people = new Map();
    }

    const hermione = await PersonModel.findOne(
        { firstname: "Emma", surname: "Watson" },
        "_id"
    ).exec();

    harry.people.set("actors", [hermione._id]);

    console.log(harry);
    await harry.save();
}

async function populateActors() {
    const harry = await PieceOfWorkModel.where("title")
        .regex(/Harry/i)
        .populate("people.actors")
        .findOne();

    console.log(harry.people.get("actors"));
}
