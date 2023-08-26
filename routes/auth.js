const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { createUser, login, logout } = require('../controllers/auth');
const { emailRegExp } = require('../utils/regexps');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegExp),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegExp),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signout', logout);

module.exports = router;
