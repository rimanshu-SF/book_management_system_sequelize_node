import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { oauth2client } from '../config/googleConfig';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1d';

const getGoogleUserData = async (code: string) => {
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    return userRes.data;
};

const generateToken = (user: User) => {
    return jwt.sign(
        { 
            id: user.id,
            email: user.email 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ 
                success: false, 
                message: 'Authorization code not provided' 
            });
        }

        const { email, id: googleId } = await getGoogleUserData(code as string);
        
        const user = await User.findOne({ where: { email, googleId } });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please sign up first.'
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            message: 'Login successful'
        });
    } catch (error: any) {
        console.error('Google login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const googleSignup = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ 
                success: false, 
                message: 'Authorization code not provided' 
            });
        }

        const { email, name, id: googleId } = await getGoogleUserData(code as string);
        
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please login instead.'
            });
        }

        const user = await User.create({
            name,
            email,
            googleId,
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            message: 'Signup successful'
        });
    } catch (error: any) {
        console.error('Google signup error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};