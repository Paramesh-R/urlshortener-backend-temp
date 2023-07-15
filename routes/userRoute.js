var express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, activateAccount } = require('../src/controller/userController');
const {  getAllUsers, updateUser, deleteUser } = require('../src/controller/userController');
const { isAuthenticated } = require('../src/middleware/auth');
var router = express.Router();



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/', isAuthenticated);


router.post('/password/forgot_password', forgotPassword);
router.post('/password/reset/:token', resetPassword);
router.post('/activate/:token', activateAccount);

router.get('/', getAllUsers);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);


module.exports = router;


