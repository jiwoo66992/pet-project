import express from 'express';
import bcrypt from 'bcrypt';
import userModel from '../user/user.model.js';
import authMethod from './auth.methods.js';

const SALT_ROUNDS = 10;

class AuthController {
    register = async (req, res) => {
        const { email, password, name, role } = req.body;
        
        const emailLower = email.toLowerCase();

        const existingUser = await userModel.getUserByEmail(emailLower);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = {
            email: emailLower,
            name,
            password: hashedPassword,
            role
        };

        try {
            await userModel.createUser(newUser);
            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'Error registering user' });
        }
    };


    login = async (req, res) => {
        const { email, password } = req.body;
        const emailLower = email.toLowerCase();

        const user = await userModel.getUserByEmail(emailLower);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }


        const payload = { email: user.email, name: user.name };

        const token = await authMethod.generateToken(payload, process.env.JWT_TOKEN_SECRET, process.env.JWT_TOKEN_EXPIRED_TIME);

        if (!token) {
            return res.status(500).json({ message: 'Error generating token' });
        }

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                email: user.email,
                name: user.name,
            },
        });
    };

}

export default new AuthController();

