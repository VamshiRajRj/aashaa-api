const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const Users = require("./models/user");
const UserScoreSchema = require("./models/levels");
const WordsSchema = require("./models/Words");

app.use(express.json(), cors());
mongoose
  .connect(
    "mongodb+srv://v2m431raj:aashaa_0987@cluster0.o45duuo.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB Connected");
  })
  .catch(console.error);

app.get("/getUser/:userId", async (req, res) => {
  try {
    const query = { userId: req.params.userId };
    const data = await Users.findOne(query);
    if (data === null) {
      const newEntry = {
        userId: req.params.userId,
        scores: {
          physics: { 1: 0 },
          chemistry: { 1: 0 },
          english: { 1: 0 },
          history: { 1: 0 },
        },
        currentLevel: { physics: 1, chemistry: 1, english: 1, history: 1 },
        // other fields as needed
      };
      const newData = new Users(newEntry);
      await newData.save();
      return res.json(await Users.findOne(query));
    }
    return res.json(data);
  } catch (e) {
    console.log(e);
  }
});

// Store user scores
app.post("/store-score", async (req, res) => {
  try {
    const { userId, levelId, score, scores, subject, currentLevels } = req.body;

    // Find an existing user score with the same userId and levelId
    const existingUserScore = await UserScoreSchema.findOne({
      userId,
      levelId,
      subject,
    });

    if (existingUserScore) {
      // If the user score already exists, update the score
      if (existingUserScore.score > score) {
        existingUserScore.score = score;
        await existingUserScore.save();
      }
    } else {
      // If no existing user score, create a new one
      const newUserScore = new UserScoreSchema({
        userId,
        levelId,
        score,
        subject,
      });

      // Save the user score to the database
      await newUserScore.save();
    }
    await Users.updateOne(
      { userId: userId },
      { $set: { scores: scores, currentLevel: currentLevels } }
    );
    const result = await UserScoreSchema.find({ levelId, subject });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Store user scores
app.post("/add-level", async (req, res) => {
  try {
    const { level, subject, words } = req.body;
    // If no existing user score, create a new one
    const newLevel = new WordsSchema({
      level,
      subject,
      words,
    });

    // Save the user score to the database
    await newLevel.save();

    res.status(201).json(newLevel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch user scores by levelId
app.get("/get-levels/:subject", async (req, res) => {
  try {
    const subject = req.params.subject;

    // Find all user scores for the specified levelId
    const levels = await WordsSchema.find({ subject });

    res.status(200).json(levels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch user scores by levelId
app.get("/get-scores/:levelId/:subject", async (req, res) => {
  try {
    const { levelId, subject } = req.params;

    // Find all user scores for the specified levelId
    const scores = await UserScoreSchema.find({ levelId, subject });

    res.status(200).json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, "0.0.0.0", () => console.log("Server Running"));

// app.put("/updateUser/:userId", async (req, res) => {
//   try {
//     const query = { userId: req.params.userId };
//     const documentIdToUpdate = req.params.userId;

//     // Update the document using Mongoose
//     const result = await Users.updateOne(
//       { userId: documentIdToUpdate },
//       { $set: req.body }
//     );

//     return res.json(await Users.findOne(query));
//   } catch (e) {
//     console.log(e);
//   }
// });
