const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
  // validation befor insert it into DB
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // checking if user already exist
  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) return res.status(400).send('Email already exist');

  // hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();

    res.status(201).send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(`Email dosn't exist`);

  // check the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Email or password is wrong');

  // create ans a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
  // res.send('Logged in!');
});

module.exports = router;
