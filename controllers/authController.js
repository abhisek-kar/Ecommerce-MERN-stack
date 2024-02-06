const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// register controller
exports.registerController = async (req, res) => {
  // try {
  //   const salt = crypto.randomBytes(16);
  //   crypto.pbkdf2(
  //     req.body.password,
  //     salt,
  //     310000,
  //     32,
  //     'sha256',
  //     async function (err, hashedPassword) {
  //       const user = new User({ ...req.body, password: hashedPassword, salt });
  //       const doc = await user.save();

  //       req.login(sanitizeUser(doc), (err) => {
  //         // this also calls serializer and adds to session
  //         if (err) {
  //           res.status(400).json(err);
  //         } else {
  //           const token = jwt.sign(
  //             sanitizeUser(doc),
  //             process.env.JWT_SECRET_KEY
  //           );
  //           res
  //             .cookie('jwt', token, {
  //               expires: new Date(Date.now() + 3600000),
  //               httpOnly: true,
  //             })
  //             .status(201)
  //             .json({ id: doc.id, role: doc.role });
  //         }
  //       });
  //     }
  //   );
  // } catch (err) {
  //   res.status(400).json(err);
  // }
  try {
    const { email, password, role } = req.body;

    // registaration not allowed for admins
    if (role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin Registration Is Not Allowed",
      });
    }

    // check existing user
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // hash password before save
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new UserModel({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();

    // generate jwt token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // send token with cookies
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expiration time 7 days
      secure: process.env.NODE_ENV === "production",
    });
    newUser.password = undefined;
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

// Login Controller
exports.loginController = async (req, res) => {
  // const user = req.user;
  // res
  //   .cookie("jwt", user.token, {
  //     expires: new Date(Date.now() + 3600000),
  //     httpOnly: true,
  //   })
  //   .status(201)
  //   .json({ id: user.id, role: user.role });

  try {
    const { email, password } = req.body;

    // check existing user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Exists",
      });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credential",
      });
    }
    // generate jwt token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // send token with cookies
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expiration time 7 days
      secure: process.env.NODE_ENV === "production",
    });
    user.password = undefined;
    return res.status(201).json({
      success: true,
      message: "Logged in Successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

// Logout controller
exports.logoutController = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// check user
exports.checkAuthController = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({ success: true, message: "User Found" });
    } else {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
        error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// reset Password request
exports.resetPasswordRequestController = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();

    // Also set token in email
    const resetPageLink =
      "http://localhost:3000/reset-password?token=" + token + "&email=" + email;
    const subject = "reset password for e-commerce";
    const html = `<button>Click <a href='${resetPageLink}'>here</a> to Reset Password</button>`;

    // lets send email and a token in the mail body so we can verify that user has clicked right link

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};

exports.resetPasswordController = async (req, res) => {
  const { email, password, token } = req.body;

  const user = await UserModel.findOne({
    email: email,
    resetPasswordToken: token,
  });
  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();
        const subject = "password successfully reset for e-commerce";
        const html = `<p>Successfully able to Reset Password</p>`;
        if (email) {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(400);
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
};
