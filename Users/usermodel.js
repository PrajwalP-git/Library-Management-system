const db = require('../db');

const user = {
    create: async(name, email, hashedPassword, role = 'user') => {
        try {
            const [result] = await db.execute(
                "INSERT INTO users (name, email, password, role) VALUES(?, ?, ?, ?)",
                [name, email, hashedPassword, role]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                throw new Error("Email already exists");
            }
            throw error;
        }
    },

    getAll: async () => {
        const [rows] = await db.execute(
            "SELECT user_id, name, email, role FROM users"
        );
        return rows;
    },

    findByEmail: async(email) => {
        console.log("Searching for email:", email);
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE LOWER(email) = LOWER(?)",
            [email]
        );
        return rows[0];
    },

    findById: async(id) => {
        const [rows] = await db.execute(
            "SELECT user_id, name, email, role, created_at, password FROM users WHERE user_id = ?",
            [id]
        );
        return rows[0];
    },

    updateRole: async(id, role) => {
        await db.execute(
            "UPDATE users SET role = ? WHERE user_id = ?",
            [role, id]
        );
    },

    updatePassword: async(id, hashedPassword) => {
        await db.execute(
            "UPDATE users SET password = ? WHERE user_id = ?",
            [hashedPassword, id]
        );
    },

    savePasswordResetToken: async(id, token, expires) => {
        await db.execute(
            "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?",
            [token, expires, id]
        );
    },

    findByResetToken: async(token) => {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE reset_token = ?",
            [token]
        );
        return rows[0];
    },

    clearPasswordResetToken: async(id) => {
        await db.execute(
            "UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?",
            [id]
        );
    },
};

module.exports = user;