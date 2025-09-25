const db = require('../db');

const Genre = {
    async create(name) {
        const sql = 'INSERT INTO genres(name) VALUES(?)';
        const [result] = await db.query(sql, [name]);
        return result;
    },

    async getAll() {
        const [rows] = await db.query('SELECT genre_id, name FROM genres');
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query('SELECT genre_id, name FROM genres WHERE genre_id = ?', [id]);
        return rows[0];
    },

    async update(id, name) {
        const sql = 'UPDATE genres SET name = ? WHERE genre_id = ?';
        const [result] = await db.query(sql, [name, id]);
        return result;
    },

    async remove(id) {
        const [result] = await db.query('DELETE FROM genres WHERE genre_id = ?', [id]);
        return result;
    },
};

module.exports = Genre;