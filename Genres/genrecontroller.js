const Genre = require('./genreModel');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const result = await Genre.create(name);
        res.status(201).json({ message: 'Genre created', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const rows = await Genre.getAll();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getById = async (req, res) => {
    try {
        const genre = await Genre.getById(req.params.id);
        if (!genre) return res.status(404).json({ message: 'Genre not found' });
        res.json(genre);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Genre name is required' });
        await Genre.update(req.params.id, name);
        res.json({ message: 'Genre updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.remove = async (req, res) => {
    try {
        await Genre.remove(req.params.id);
        res.json({ message: 'Genre deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};