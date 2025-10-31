import express from "express";
import passport from 'passport'
import { createUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

authRouter.get('/google', (req, res, next) => {
	try {
		const strat = passport && typeof passport._strategy === 'function' && passport._strategy('google');
		if (!strat) return res.status(501).json({ error: 'Google OAuth not configured on server' });
		return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
	} catch (err) {
		console.error('Error starting Google auth flow', err);
		return res.status(500).json({ error: 'Unable to start Google OAuth' });
	}
});

authRouter.get('/google/callback', (req, res, next) => {
	try {
		const strat = passport && typeof passport._strategy === 'function' && passport._strategy('google');
		if (!strat) return res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
		return passport.authenticate('google', { session: false, failureRedirect: process.env.CLIENT_URL || 'http://localhost:5173' })(req, res, next);
	} catch (err) {
		console.error('Error handling Google callback', err);
		return res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
	}
}, async (req, res) => {
	try {
		const payload = req.user || {};
		const { generateToken } = await import('../utils/generateToken.js');
		generateToken(res, payload);
		const redirectTo = `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`;
		return res.redirect(redirectTo);
	} catch (err) {
		console.error('OAuth callback error', err);
		return res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
	}
});

export default authRouter;
