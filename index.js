require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

mongoose.connect(process.env.MONGO_URI);
// mongoose.connect("mongodb://localhost:27017/backend-marvel")

//Mes router / routes
const userRouter = require("./routes/user");
app.use(userRouter)

const charactersRouter = require("./routes/characters");
app.use(charactersRouter);

const comicsRouter = require("./routes/comics");
app.use(comicsRouter);

app.get("/", (req, res) => {
  try {
    res.status(200).json({
      message:
        "Bienvenue sur mon serveur qui fonctionne très bien pour une fois !! 😂",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});


app.listen(process.env.PORT , () => {
  console.log(`server started on PORT:${process.env.PORT}`);
});
