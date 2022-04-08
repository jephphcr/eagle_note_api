require('dotenv').config();
const secret = process.env.JWT_TOKEN;
var express = require('express');
var router = express.Router();

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const user = require('../models/user');


//--------------------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  try {
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error registering new user' });
  }
})

//--------------------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      res.status(401).json({ error: 'Incorrect email or password' });
    else {
        user.isCorrectPassword(password, function(err, same) {
        if (!same){
          console.log(user);
          console.log(same);
          res.status(401).json({ error: 'Incorrect email or password 25' });
        }
        else {
          const token = jwt.sign({ email }, secret, { expiresIn: '10d' });
          res.json({ user: user, token: token });
        }
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal error, please try again' });
  }
});

module.exports = router;

