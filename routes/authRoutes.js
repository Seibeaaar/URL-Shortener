const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();
const config = require('config');

router.post(
  '/register', 
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Invalid password (must be 6 symbols at least)').isLength({min: 6})
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid data'
      })
    }
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if(candidate) {
      res.status(400).json({message: 'This user is already declared'});
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({message: 'User created'});
  } catch(e) {
    res.status(500).json({message: 'Something is wrong'})
  }
})

router.post(
  '/login', 
  [
    check('email', 'Invalid email').normalizeEmail().isEmail(),
    check('password', 'Invalid password (must be 6 symbols at least)').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Invalid data for auth'
        })
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if(!user) {
        return res.status(400).json({
          message: 'User is not found'
        })
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(400).json({
          message: 'User is not found'
        })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecretKey'),
        { expiresIn : '1h'}
      )

      res.json({token, userId : user.id});
      
    } catch(e) {
      res.status(500).json({message: 'Something is wrong'})
    }
})

module.exports = router;