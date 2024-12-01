const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

//------------------- créer un nouveau compte utlisateur-----------------

router.post("/user/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      res.status(409).json({ message: "Cet email existe déja" });
    } else {
      if (!user) {

        // cryptage du mot de passe
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.body.password + salt).toString(encBase64);
        // creation d'un nouvel utilisateur
        const newUser = new User({
          email: req.body.email,
          token: token,
          hash: hash,
          salt: salt,
        });

        // sauvegarder du nouvel utilisateur
        await newUser.save();
        res.status(201).json({ message: "Votre compte a été créer" });
      } else {
        // l'utilisateur n'a pas envoyé les informations requises ?
        res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//-------------------se connecter-----------------------------------------

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      // Est-ce qu'il a rentré le bon mot de passe ?
      // req.body.password
      // user.hash
      // user.salt
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        res.status(200).json({
          _id: user._id,
          email:user.email,
          token: user.token,
    
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
