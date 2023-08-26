const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getUserProfile, updateUserProfile } = require('../controllers/users');
const { emailRegExp } = require('../utils/regexps');

router.get('/me', getUserProfile);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegExp),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

module.exports = router;
