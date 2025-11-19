const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User", // Entity Name
    tableName: "users", // Database Table Name
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        email: {
            type: "varchar",
            unique: true,
        },
        password: {
            type: "varchar",
            select: false, // Don't return password by default
        },
        role: {
            type: "varchar",
            default: "staff", // 'admin' or 'staff'
        },
        phone: {
            type: "varchar",
        },
        city: {
            type: "varchar",
        },
        country: {
            type: "varchar",
        },
        createdAt: {
            type: "datetime",
            createDate: true,
        },
        updatedAt: {
            type: "datetime",
            updateDate: true,
        },
    },
});