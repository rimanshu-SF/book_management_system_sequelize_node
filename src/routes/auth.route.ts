import express, { Request, Response } from 'express';
import { googleLogin, googleSignup } from '../controllers/auth.controller';

const router = express.Router();

router.get('/google/login', async (req: Request, res: Response) => {
    try {
        await googleLogin(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error in Google login route',
            error: (error as Error).message,
        });
    }
});

router.get('/google/signup', async (req: Request, res: Response) => {
    try {
        await googleSignup(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error in Google signup route',
            error: (error as Error).message,
        });
    }
});

export { router };