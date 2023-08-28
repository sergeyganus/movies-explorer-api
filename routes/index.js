const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const authRouter = require('./auth');
const signoutRouter = require('./signout');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

router.use(authRouter);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use(signoutRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрошенный ресурс не найден'));
});

module.exports = router;
