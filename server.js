// IMPORT MODULES
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const open = require("open");

app.listen(5000, () => {
    console.log("Server running...");
    open("http://localhost:5000");
});
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

/* 🔥 SERVE FRONTEND FILES */
app.use(express.static(path.join(__dirname, "../frontend")));

/* 🔥 OPEN HTML WHEN VISITING ROOT */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* 🔥 CONNECT TO MONGODB */
mongoose.connect("mongodb://127.0.0.1:27017/eventDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log("MongoDB Error:", err));

/* 🔥 CREATE SCHEMA */
const EventSchema = new mongoose.Schema({
    name: String
});

/* 🔥 CREATE MODEL */
const Event = mongoose.model("Event", EventSchema);

/* 🔥 GET ALL EVENTS */
app.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 🔥 ADD NEW EVENT */
app.post("/events", async (req, res) => {
    try {
        const newEvent = new Event({
            name: req.body.name
        });

        await newEvent.save();

        res.json({ message: "Event Saved 🎉" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 🔥 DELETE EVENT */
app.delete("/events/:id", async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event Deleted ❌" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 🔥 START SERVER */
app.listen(5000, () => {
    console.log("🚀 Server running at http://localhost:5000");
});
