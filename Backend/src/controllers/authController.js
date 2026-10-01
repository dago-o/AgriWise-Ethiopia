import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({
            message: 'The user is created successfully',
            user
        });
    } catch (error) {
        console.error('Registration error:', error);

        res.status(400).json({
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);

        res.status(200).json({
            message: 'You logged in successfully',
            user
        });
    } catch (error) {
        console.error('Login error:', error);

        res.status(401).json({
            message: error.message
        });
    }
};