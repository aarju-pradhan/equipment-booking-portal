import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { Equipment } from '../models/Equipment.js';
import { requireAuth } from '../middleware/auth.js';

export const bookingsRouter = Router();

function toBookingClient(booking) {
    const equipment = booking.equipment;
    return {
        bookingId: booking._id.toString(),
        id: equipment?._id?.toString() || booking.equipment.toString(),
        date: booking.date,
        name: equipment?.name || 'Unknown item',
        type: equipment?.type || '',
        category: equipment?.category || '',
        status: equipment?.status || 'Available',
        description: equipment?.description || '',
        image: equipment?.image || '',
        campusId: equipment?.campusId || '',
        campusName: equipment?.campusName || '',
        address: equipment?.address || ''
    };
}

bookingsRouter.get('/', requireAuth, async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
        const bookings = await Booking.find(filter).populate('equipment').sort({ date: 1 });
        res.json(bookings.map(toBookingClient));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not load bookings.' });
    }
});

bookingsRouter.post('/', requireAuth, async (req, res) => {
    const equipmentId = String(req.body.id || req.body.equipmentId || '').trim();
    const date = String(req.body.date || '').trim();

    if (!equipmentId || !date) {
        return res.status(400).json({ message: 'Choose an item and a date before booking.' });
    }

    try {
        const item = await Equipment.findById(equipmentId);
        if (!item) {
            return res.status(404).json({ message: 'Catalog item not found.' });
        }
        if (item.status === 'Maintenance') {
            return res.status(400).json({ message: `${item.name} is under maintenance.` });
        }

        const exists = await Booking.findOne({ equipment: item._id, date });
        if (exists) {
            return res.status(409).json({ message: `${item.name} is already booked for ${date}.` });
        }

        const booking = await Booking.create({
            user: req.user._id,
            equipment: item._id,
            date
        });
        await booking.populate('equipment');

        return res.status(201).json(toBookingClient(booking));
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'That item is already booked for this date.' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Could not create the booking.' });
    }
});

bookingsRouter.delete('/:id', requireAuth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only cancel your own bookings.' });
        }

        await booking.deleteOne();
        return res.json({ message: 'Booking cancelled.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not cancel the booking.' });
    }
});
