const { DataSource } = require("typeorm");
const UserSchema = require("./entity/User");

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true, // Auto-creates tables (disable in production)
    logging: false,
    entities: [UserSchema], // Load the schema here
    migrations: [],
    subscribers: [],
});

module.exports = AppDataSource;