import { Request, Response } from 'express';
import passport from 'passport';

export const googleSignup = (req: Request, res: Response) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'signup',
  })(req, res);
};

export const googleSignupCallback = (req: Request, res: Response) => {
    const token = (req.user as any)?.token;
  
    if (token) {
      res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    } else {
      res.redirect(`http://localhost:5173/signup?error=signup_failed`);
    }
  };