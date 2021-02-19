/**
 * This file contains various helper functions for interacting with the database
 */

import mongoose from "mongoose";

const connection = {};

/**
 * Creates a connection to the database
 * @returns The mongoose database connection
 */
export async function connectToDatabase() {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    connection.isConnected = db.connections[0].readyState;

    // We'll return the db if it's successful.
    return db;
  } catch (e) {
    switch (e.name) {
      // Some very simple error handling-- Here we're just checking if the server can't be found
      case "MongooseServerSelectionError":
        console.log(
          "DB Connection to the DB failed-- double check DATABASE_URI and ensure remote or local database is reachable"
        );
        throw e;

      default:
        console.log(
          "Something went wrong while trying to connect to the database."
        );
        throw e;
    }
  }
}
