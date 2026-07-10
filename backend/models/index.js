import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TodoModel from './todo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.resolve(__dirname, '../config/config.json');
const configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const env = process.env.NODE_ENV || 'development';
const config = configJson[env];

const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
  logging: false
});

const Todo = TodoModel(sequelize);

const db = {
  sequelize,
  Sequelize,
  Todo
};

export { sequelize, Sequelize, Todo };
export default db;
