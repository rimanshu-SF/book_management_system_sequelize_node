import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { oauth2client } from '../config/googleConfig';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1d';

const googleLogin = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;
        console.log("AuthCode", code)
        if (!code) {
            return res.status(400).json({ 
                success: false, 
                message: 'Authorization code not provided' 
            });
        }

        const googleRes = await oauth2client.getToken(code as string);
        oauth2client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        
        const { email, name, id: googleId } = userRes.data;

        let user = await User.findOne({ where: { email } });
        
        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
            });
        } else if (!user.googleId) {
            await user.update({ googleId });
        }

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

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

export default googleLogin;