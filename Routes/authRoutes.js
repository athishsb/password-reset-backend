import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  getUserEmailFromDB,
  getUsernameFromDB,
  getUserIDFromDB,
  registerUser,
  resetPasswordById,
} from "../Services/authServices.js";
import { generateHashedPassword } from "../Utility/hash.js";
import { sendPasswordResetMail } from "../Utility/sendMail.js";
import {
  loginValidation,
  signUpValidation,
  forgotPasswordvalidation,
  resetPasswordValidation,
} from "../Middleware/authMiddleware.js";
dotenv.config();
const router = express.Router();

// Sign up function gets username,email,password from request.body
// checks for errors and returns errors if any else proceeds to register user
// and password is hashed stored in db on successful registration
router.post(
  "/signup",
  signUpValidation(),
  express.json(),
  async (request, response) => {
    const { username, email, password } = request.body;

    const usernameFromDB = await getUsernameFromDB(username); // to check if username exists in DB
    const userEmailFromDB = await getUserEmailFromDB(email); // to check if email exists in DB
    if (userEmailFromDB) {
      response.status(400).send({ message: "Email already in use" });
    }
    // if username already exists throws an error
    else if (usernameFromDB) {
      response.status(400).send({ message: "Username not available" });
    } else {
      const hashedPassword = await generateHashedPassword(password);
      const result = await registerUser({
        username: username,
        email: email,
        password: hashedPassword,
      });
      response.send({ message: "Signup successful.Please login" });
    }
  }
);

// Login function gets email,password from request.body
// given password is hashed and compared to stored password
// checks for errors and returns errors if any else proceeds to login user
router.post(
  "/login",
  loginValidation(),
  express.json(),
  async (request, response) => {
    const { email, password } = request.body;

    const userEmailFromDB = await getUserEmailFromDB(email);

    if (!userEmailFromDB) {
      response.status(400).send({ message: "Invalid Credentials" });
    } else {
      const storedDBPassword = userEmailFromDB.password;
      const isPasswordMatch = await bcrypt.compare(password, storedDBPassword);

      if (isPasswordMatch) {
        const token = jwt.sign(
          { id: userEmailFromDB._id },
          process.env.SECRET_KEY,
          { expiresIn: "2h" }
        );
        response.send({ message: "Login successful", token, username: userEmailFromDB.username });
      } else {
        response.status(401).send({ message: "Invalid credentials" });
      }
    }
  }
);


//Forgot Password gets email from the request.body and
// confirms if the email is registered or not and sends the reset email link to the user
router.post(
  "/forgot-password",
  express.json(),
  forgotPasswordvalidation(),
  async (request, response, next) => {
    const { email } = request.body;

    const userEmailFromDB = await getUserEmailFromDB(email); //to find the uaer email

    // if email is not found then throws an error
    if (userEmailFromDB === null) {
      response
        .status(400)
        .send({ message: "Please enter the registered email" });
    }
    // else sends a **unique-one-time-link** to the user for resetting the password
    else {
      const storedDBPassword = userEmailFromDB.password;
      const userId = userEmailFromDB._id;
      // User exists and now we create a one time link valid for 10 min
      const secret = process.env.SECRET_KEY + storedDBPassword;
      const payload = {
        email: userEmailFromDB.email,
        id: userId,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "10m" });

      const sendMail = await sendPasswordResetMail(email, userId, token);
      if (sendMail) {
        response.send({
          message: `Password reset mail has been sent successfully to ${email}. Kindly check your spam folder also.`,
        });
      } else {
        response.status(400).send({ message: "An error occured" });
      }
    }
  }
);

// Reset Password to verify the token sent to user email
// and if successful returns the user email else throws an error
router.get("/reset-password/:_id/:token", async (request, response, next) => {
  const { _id, token } = request.params;

  const userIdFromDB = await getUserIDFromDB(_id); //to find by _id
  const userId = userIdFromDB._id.toString(); // to compare _id from url with _id from DB
  const storedDBPassword = userIdFromDB.password;
  // If userId does not match , throws an error
  if (userId !== _id) {
    response.status(404).send({ message: "Invalid id" });
    return;
  }
  // we have a valid user with this id and then proceeds to validate jwt token issued earlier for this user
  else {
    const secret = process.env.SECRET_KEY + storedDBPassword;
    try {
      const payload = jwt.verify(token, secret);
      response.send({ email: userIdFromDB.email });
    } catch (error) {
      response.send({ message: error.message });
    }
  }
});
// For resetting Password by using the link provided through email
// Checks for if user exists with the id in link and if exists validates onetime token
// If not used prooceeds to update the password in DB
router.post(
  "/reset-password/:_id/:token",
  express.json(),
  resetPasswordValidation(),
  async (request, response, next) => {
    const { _id, token } = request.params;
    const { password } = request.body;
    const userIdFromDB = await getUserIDFromDB(_id); //to find by _id
    const userId = userIdFromDB._id.toString(); // to compare _id from url with _id from DB
    const storedDBPassword = userIdFromDB.password;
    // If userId does not match , throws an error
    if (userId !== _id) {
      response.status(404).send({ message: "Invalid id" });
      return;
    } else {
      const secret = process.env.SECRET_KEY + storedDBPassword;
      try {
        const payload = jwt.verify(token, secret); //verifying the issued token
        const hashedPassword = await generateHashedPassword(password); //hashing the password provided
        const updatedResult = await resetPasswordById({
          userId,
          password: hashedPassword,
        });
        response.send({ message: "Reset password successful. Please Login" });
      } catch (error) {
        response.send({ message: error.message });
      }
    }
  }
);

export default router;
