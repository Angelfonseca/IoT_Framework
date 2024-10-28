const User = require('../models/user.model');

const createToken = require('../utils/utils');

const UserController = {
    getAll: async (req, res) => {
        try {
            const data = await User.find();
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener los usuarios' });
        }
    },

    create: async (req, res) => {
        try {
            const data = req.body;
            const newUser = new User(data);
            await newUser.save();
            res.json(newUser);
        } catch (err) {
            res.status(500).json({ message: 'Error al crear el usuario' });
        }
    },

    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const data = await User.findById(id);
            if (!data) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener el usuario' });
        }
    },

    updateById: async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json({ message: 'Actualizado', updatedUser });
        } catch (err) {
            res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    },

    deleteById: async (req, res) => {
        try {
            const id = req.params.id;
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json({ message: 'Eliminado' });
        } catch (err) {
            res.status(500).json({ message: 'Error al eliminar el usuario' });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log(username);
            const user = await User.findOne({ username });
            console.log(user);
            if (!user) {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }

            const isMatch = await user.checkPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }
            const token = createToken(user);
            console.log(token);
            res.status(200).json({ token, user });
        } catch (err) {
            throw err;
          
            
        }
    }
};

module.exports = UserController;
