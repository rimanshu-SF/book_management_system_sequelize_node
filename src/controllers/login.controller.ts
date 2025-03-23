import { Request, Response } from 'express';
import passport from 'passport';

export const googleLogin = (req: Request, res: Response) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'login',
  })(req, res);
};

export const googleLoginCallback = (req: Request, res: Response) => {
    const token = (req.user as any)?.token;
  
    if (token) {
      res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    } else {
      res.redirect(`http://localhost:5173/login?error=login_failed`);
    }
  };