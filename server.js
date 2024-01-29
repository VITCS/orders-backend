const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/foodDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a Food model
const Food = mongoose.model("Food", {
  name: String,
  quantity: Number,
});

// Middleware
app.use(bodyParser.json());

// API endpoint to insert food data
app.post("/api/food", async (req, res) => {
  try {
    const { name, quantity } = req.body;

    // Validate input
    if (!name || !quantity) {
      return res.status(400).json({ error: "Name and quantity are required" });
    }

    // Create a new Food instance
    const food = new Food({ name, quantity });

    // Save to MongoDB
    await food.save();

    return res.status(201).json(food);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
