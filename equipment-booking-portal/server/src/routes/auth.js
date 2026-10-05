import { Router } from 'express';
import { User } from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';

export const authRouter = Router();

function validateRegister(body) {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const studentId = String(body.studentId || '').trim();
    const password = String(body.password || '');

    if (!name || !email || !studentId || !password) {
        return { error: 'All fields are required.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: 'Enter a valid email address.' };
    }
    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' };
    }
    return { name, email, studentId, password };
}

authRouter.post('/register', async (req, res) => {
    const parsed = validateRegister(req.body);
    if (parsed.error) {
        return res.status(400).json({ message: parsed.error });
    }

    try {
        const exists = await User.findOne({
            $or: [{ email: parsed.email }, { studentId: parsed.studentId }]
        });
        if (exists) {
            return res.status(409).json({ message: 'An account with this email or student ID already exists.' });
        }

        const user = await User.create({
            name: parsed.name,
            email: parsed.email,
            studentId: parsed.studentId,
            password: parsed.password,
            role: 'student'
        });

        return res.status(201).json({
            token: signToken(user),
            user: user.toSafeObject()
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not create the account.' });
    }
});

authRouter.post('/login', async (req, res) => {
    const studentId = String(req.body.studentId || '').trim();
    const password = String(req.body.password || '');

    if (!studentId || !password) {
        return res.status(400).json({ message: 'Enter both your student ID and password.' });
    }

    try {
        const user = await User.findOne({ studentId });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid student ID or password.' });
        }

        return res.json({
            token: signToken(user),
            user: user.toSafeObject()
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not sign in.' });
    }
});

authRouter.get('/me', requireAuth, (req, res) => {
    res.json({ user: req.user.toSafeObject() });
});

authRouter.put('/profile', requireAuth, async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const studentId = String(req.body.studentId || '').trim();

    if (!name || !email || !studentId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Enter a valid email address.' });
    }

    try {
        const clash = await User.findOne({
            _id: { $ne: req.user._id },
            $or: [{ email }, { studentId }]
        });
        if (clash) {
            return res.status(409).json({ message: 'That email or student ID is already in use.' });
        }

        req.user.name = name;
        req.user.email = email;
        req.user.studentId = studentId;
        await req.user.save();

        return res.json({ user: req.user.toSafeObject() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not update the profile.' });
    }
});
