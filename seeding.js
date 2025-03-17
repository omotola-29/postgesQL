const express = require("express");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const app = express();

app.use(express.json());
const port = 4000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/class2")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Create a schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  address: String,
  phone: String
});

// Create a model
const User = mongoose.model("User", userSchema);

// Seed function
async function seedDatabase() {
  try {
    // Clear existing data
    // await User.deleteMany({});

    // Create 10 random users
    const users = Array.from({ length: 100 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 80 }),
      address: faker.location.streetAddress(),
      phone: faker.phone.number()
    }));

    await User.insertMany(users);
    console.log("Database seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
}

// Run the seeding
seedDatabase();

app.listen(port);