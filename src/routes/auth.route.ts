import express, { Request, Response } from 'express';
import googleLogin from '../controllers/auth.controller';

const router = express.Router();

// Wrap googleLogin in an async handler to properly handle the Promise
router.get('/google', async (req: Request, res: Response) => {
    try {
        await googleLogin(req, res);
        const { code } = req.query;
        console.log("AuthCode", code)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error in Google login route',
            error: (error as Error).message,
        });
    }
});

export { router };