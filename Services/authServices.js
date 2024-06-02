import { ObjectId } from "mongodb";
import { client } from "../db.js";

// Function to register a new user
export async function registerUser(data) {
  try {
    const result = await client
      .db("ResetApp")
      .collection("UserData")
      .insertOne(data);
    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Function to get user email from the database
export async function getUserEmailFromDB(email) {
  try {
    const user = await client
      .db("ResetApp")
      .collection("UserData")
      .findOne({ email: email });
    return user;
  } catch (error) {
    console.error("Error getting user email from DB:", error);
    throw error;
  }
}

// Function to get username from the database
export async function getUsernameFromDB(username) {
  try {
    const user = await client
      .db("ResetApp")
      .collection("UserData")
      .findOne({ username: username });
    return user;
  } catch (error) {
    console.error("Error getting username from DB:", error);
    throw error;
  }
}

// Function to get user ID from the database
export async function getUserIDFromDB(_id) {
  try {
    const user = await client
      .db("ResetApp")
      .collection("UserData")
      .findOne({ _id: new ObjectId(_id) });
    return user;
  } catch (error) {
    console.error("Error getting user ID from DB:", error);
    throw error;
  }
}

// Function to reset password by user ID
export async function resetPasswordById({ userId, password: hashedPassword }) {
  try {
    const result = await client
      .db("ResetApp")
      .collection("UserData")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
    return result;
  } catch (error) {
    console.error("Error resetting password by ID:", error);
    throw error;
  }
}
