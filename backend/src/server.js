import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "../models/index.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

// Authenticate database
sequelize
  .authenticate()
  .then(() => {
    console.log("Successfully connected to SQLite database via Sequelize.");
    app.listen(PORT, () => {
      console.log(`Tasuku Backend is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the SQLite database:", error);
    process.exit(1);
  });
