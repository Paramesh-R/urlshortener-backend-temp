const User = require('../models/UserModel');
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

exports.resentEmail = async (req, res, next) => {
  try {
  } catch (error) {

  }
}

//----------------------------------------- Register User (Create)   => /api/users/register ----------------------------------------
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) { return res.status(401).json({ message: "User already exists" }); }

    const newUser = await User.create({ name, email, password });

    if (!newUser) { return res.status(500).json({ message: "Something went wrong" }); }


    // Send Email for Verification
    const activationToken = newUser.getAccountActivationToken();
    await newUser.save({ validateBeforeSave: true });
    // create activate url
    // const activateUrl = `${req.protocol}://${req.get("host")}/api/users/activate/${activationToken}`;
    const activateUrl = `${process.env.BASE_URL}/activate-account/${activationToken}`;
    const message1 = `Thanks for signing up with NanoLink. Click the link below to activate your account.    `;
    const message2 = '';
    console.log(activateUrl)

    await sendEmail({
      recipient: newUser.email,
      to_name: newUser.name ? newUser.name : "",
      subject: "Account Activation Link",
      message1,
      link1: activateUrl,
      message2,
    })

    // Create JWT token for Cookies
    const token = await newUser.getSignedJwtToken();

    // Option for cookie
    const options = {
      expires: new Date(
        Date.now()
        + process.env.COOKIE_EXPIRATION_TIME
        * 24 * 60 * 60 * 1000
      ),
      withCredentials: true,
      /* httpOnly: true */
    }


    // Send token to client
    res
      .status(200)
      .cookie('token', token, options)
      .json({
        success: true,
        token: token,
        user: newUser,
        message: "User created successfully"
      });
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }

}
// ---------------------------------------------------------------------------------------------------------------------------


//------------------------------------------ Login User (Login)   => /api/users/login ------------------------------------------
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are not null
    if (!email || !password) return next(
      res
        .status(400)
        .cookie("token", "none", { expires: new Date(Date.now() + 10 * 1000), /* httpOnly: true */ })
        .json({ message: "Please fill all fields" }));

    // Find User by Username
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .cookie("token", "none", { expires: new Date(Date.now() + 10 * 1000), /* httpOnly: true */ })
        .json({ message: "Invalid Credentials" });
    }
    // Verify the Password
    const isMatch = await user.comparePassword(password);

    // If Password doesn't match
    if (!isMatch) {
      return res
        .status(401)
        .cookie("token", "none", { expires: new Date(Date.now() + 10 * 1000), /* httpOnly: true */ })
        .json({ message: "Invalid Credentials" });
    }


    /* New Method to send token to cookie */
    // Create JWT token for Cookies
    const token = await user.getSignedJwtToken();

    // Option for cookie
    const options = {
      expires: new Date(
        Date.now()
        + process.env.COOKIE_EXPIRATION_TIME
        * 24 * 60 * 60 * 1000
      ),
      /* httpOnly: true */
    }




    // Send token to client
    return res
      .status(200)
      .cookie('token', token, options)
      .json({ success: true, token: token, user, message: "Sign In Successful" });

    // next()
  } catch (error) {
    res.status(500).send("Error" + error);
  }
}
// ---------------------------------------------------------------------------------------------------------------------------


//----------------------------------------- Logout User (Logout)   => /api/users/logout -----------------------------------------
exports.logoutUser = async (req, res, next) => {
  /* res.cookie(
      "token1",
      "none",
      {
          expires: new Date(Date.now() + 10 * 1000),
           httpOnly: true 
      }
  ); */
  res
    .status(200)
    .cookie('token', "none")
    .json({
      success: true,
      token: "none",
      message: "Logout Successful"
    });

}
// ---------------------------------------------------------------------------------------------------------------------------




// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'An error occurred while retrieving users' });
  }
};

// Update user fields
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { email, password, name } = req.body;

  try {
    // Find the user by ID and update the fields
    const user = await User.findByIdAndUpdate(
      userId,
      { email, password, name },
      { new: true }
    );
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and delete it
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
};




//------------------------------------ Forgot Password      => api/v1/password/forgot_password ------------------------------------
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.reset_email });

  if (!user) { return res.status(404).json({ "message": "User not found" }); }

  // Get Reset Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // create reset password url
  const resetUrl = `${process.env.BASE_URL}/resetpassword/${resetToken}`;

  const message1 = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
  Please click on the following link, or paste this into your browser to complete the process:
  `;
  const message2 = 'If you did not request this, please ignore this email and your password will remain unchanged.';


  try {

    await sendEmail({
      recipient: user.email,
      to_name: user.name ? user.name : "",
      subject: "Password Reset Request",
      message1,
      link1: resetUrl,
      message2,
    })

    res.status(200).json({
      success: true,
      message: "An e-mail has been sent to " + user.email + " with further instructions."
    });

  } catch (error) {

    user.resetPasswordTokenExpires = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(error)
    return next(Error(error.message, 500));
  }

}
// ---------------------------------------------------------------------------------------------------------------------------


//------------------------------------ Reset Password   => api/v1/password/:reset_password ------------------------------------
exports.resetPassword = async (req, res, next) => {
  // Hash URL token   
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  console.log(hashedToken)
  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() }
    });

    if (!user) { return res.status(400).send("Password reset token is invalid or has expired"); }

    if (req.body.password !== req.body.confirmPassword) { return res.status(400).send("Passwords do not match"); }

    // Set new password
    user.password = req.body.password;
    // user.resetPasswordToken = undefined;
    // user.resetPasswordTokenExpires = undefined;
    await user.save();
    return res
      .status(200)
      .json({ success: true, user, message: "Password Changed" });

  } catch (error) {
    console.log(error)
    return res.status(400).send(error);
  }
}
// ---------------------------------------------------------------------------------------------------------------------------


exports.activateAccount = async (req, res, next) => {

  try {
    const activationToken = req.params.activationToken;

    // Perform the account activation logic
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      accountActivationToken: hashedToken,
      accountActivationTokenExpires: { $gt: Date.now() },

    });

    console.log(user)
    if (!user) return res.json({ success: false, message: "Activation token is invalid or has expired" });
    user.accountActivationToken = undefined;
    user.accountActivationTokenExpires = undefined;
    user.verified = true;
    await user.save();

    res.json({ success: true, message: "Activated" })
  } catch (error) {
    console.error(error);
    res.send(error)

  }

} 
