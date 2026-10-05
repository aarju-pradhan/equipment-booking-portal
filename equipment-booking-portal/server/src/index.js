import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './db.js';
import { authRouter } from './routes/auth.js';
import { equipmentRouter } from './routes/equipment.js';
import { bookingsRouter } from './routes/bookings.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((value) => value.trim());

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/bookings', bookingsRouter);

app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Unexpected server error.' });
});

async function start() {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
        throw new Error('MONGODB_URI and JWT_SECRET must be set in server/.env');
    }
    await connectDb(process.env.MONGODB_URI);
    app.listen(port, () => {
        console.log(`API running on http://localhost:${port}`);
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
