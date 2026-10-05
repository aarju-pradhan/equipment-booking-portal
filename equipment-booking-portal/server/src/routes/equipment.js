import { Router } from 'express';
import { Equipment } from '../models/Equipment.js';
import { Booking } from '../models/Booking.js';
import { getCampus } from '../campuses.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

export const equipmentRouter = Router();

equipmentRouter.get('/', requireAuth, async (req, res) => {
    try {
        const items = await Equipment.find().sort({ code: 1 });
        const bookings = await Booking.find({}, 'equipment date');
        const datesByItem = {};
        for (const booking of bookings) {
            const key = booking.equipment.toString();
            if (!datesByItem[key]) datesByItem[key] = [];
            datesByItem[key].push(booking.date);
        }
        res.json(items.map((item) => ({
            ...item.toClient(),
            bookedDates: datesByItem[item._id.toString()] || []
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not load the catalog.' });
    }
});

equipmentRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
    const code = String(req.body.code || '').trim();
    const name = String(req.body.name || '').trim();
    const type = String(req.body.type || '').trim();
    const category = String(req.body.category || '').trim();
    const status = String(req.body.status || 'Available').trim();
    const description = String(req.body.description || '').trim();
    const image = String(req.body.image || '').trim();
    const campus = getCampus(req.body.campusId);

    if (!code || !name || !type || !category || !description) {
        return res.status(400).json({ message: 'Code, name, type, category and description are required.' });
    }
    if (!['Equipment', 'Facility'].includes(type)) {
        return res.status(400).json({ message: 'Type must be Equipment or Facility.' });
    }

    try {
        const item = await Equipment.create({
            code,
            name,
            type,
            category,
            status,
            description,
            image,
            campusId: campus.id,
            campusName: campus.name,
            address: campus.address,
            lat: campus.lat,
            lng: campus.lng
        });
        return res.status(201).json(item.toClient());
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'An item with this code already exists.' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Could not create the catalog item.' });
    }
});

equipmentRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const item = await Equipment.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Catalog item not found.' });
        }

        const fields = ['code', 'name', 'type', 'category', 'status', 'description', 'image'];
        for (const field of fields) {
            if (req.body[field] !== undefined) {
                item[field] = String(req.body[field]).trim();
            }
        }
        if (req.body.campusId) {
            const campus = getCampus(req.body.campusId);
            item.campusId = campus.id;
            item.campusName = campus.name;
            item.address = campus.address;
            item.lat = campus.lat;
            item.lng = campus.lng;
        }

        await item.save();
        return res.json(item.toClient());
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not update the catalog item.' });
    }
});

equipmentRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const item = await Equipment.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Catalog item not found.' });
        }
        return res.json({ message: 'Catalog item deleted.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not delete the catalog item.' });
    }
});
