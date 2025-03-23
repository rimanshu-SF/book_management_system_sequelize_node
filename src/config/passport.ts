// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import User from '../models/user.model';
// import dotenv from 'dotenv';

// dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: 'http://localhost:4004/auth/google/callback',
//       passReqToCallback: true,
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         const state = req.query.state as string;
//         const existingUser = await User.findOne({ where: { googleId: profile.id } });

//         if (state === 'login') {
//           // Handle Login
//           if (existingUser) {
//             return done(null, existingUser);
//           } else {
//             return done(null, false, { message: 'User not found. Please sign up.' });
//           }
//         } else if (state === 'signup') {
//           // Handle Signup
//           if (!existingUser) {
//             const newUser = await User.create({
//               googleId: profile.id,
//               email: profile.emails?.[0]?.value!,
//               displayName: profile.displayName,
//             });
//             return done(null, newUser);
//           } else {
//             return done(null, existingUser, { message: 'User already exists. Please login.' });
//           }
//         }
//       } catch (error) {
//         return done(error, false);
//       }
//     },
//   ),
// );

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findByPk(googleId);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

// export default passport;
