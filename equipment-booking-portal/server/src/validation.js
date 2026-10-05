import mongoose from 'mongoose';

const ITEM_TYPES = ['Equipment', 'Facility'];
const ITEM_STATUSES = ['Available', 'In Use', 'Maintenance'];

export function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id)
        && new mongoose.Types.ObjectId(id).toString() === id;
}

export function parseItemType(value) {
    const type = String(value || '').trim();
    if (!ITEM_TYPES.includes(type)) {
        return { error: 'Type must be Equipment or Facility.' };
    }
    return { type };
}

export function parseItemStatus(value, fallback = 'Available') {
    const status = String(value == null || value === '' ? fallback : value).trim();
    if (!ITEM_STATUSES.includes(status)) {
        return { error: 'Status must be Available, In Use, or Maintenance.' };
    }
    return { status };
}

export function parseBookingDate(value) {
    const date = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return { error: 'Enter a valid date.' };
    }

    const [year, month, day] = date.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (
        parsed.getUTCFullYear() !== year
        || parsed.getUTCMonth() !== month - 1
        || parsed.getUTCDate() !== day
    ) {
        return { error: 'Enter a valid date.' };
    }

    const today = new Date().toISOString().slice(0, 10);
    if (date < today) {
        return { error: 'Choose today or a future date.' };
    }

    return { date };
}
