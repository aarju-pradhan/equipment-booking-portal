// Run from the server/ folder (so 'mongoose' resolves) with the API running on port 5000
// and MONGODB_URI set to a TEST database that has been seeded (npm run seed).
// Usage: node api-tests.mjs
import mongoose from 'mongoose';

const BASE = 'http://127.0.0.1:5000/api';
const results = [];
const future = (days) => new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);

async function call(method, path, { token, body } = {}) {
    const res = await fetch(BASE + path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    });
    let data = null;
    try { data = await res.json(); } catch { /* empty */ }
    return { status: res.status, data };
}

function record(id, name, expected, actual, ok, note = '') {
    results.push({ id, name, expected, actual, ok, note });
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}  ${name}  expected=${expected} actual=${actual} ${note}`);
}

const stamp = Date.now();
const newUser = { name: 'Test Student', email: `t${stamp}@cihe.edu.au`, studentId: `s${stamp}`, password: 'Passw0rd!' };

// Auth
let r = await call('POST', '/auth/register', { body: newUser });
record('A1', 'Register valid student', 201, r.status, r.status === 201 && r.data?.user?.role === 'student' && !!r.data?.token);
const tokenNew = r.data?.token;

r = await call('POST', '/auth/register', { body: newUser });
record('A2', 'Register duplicate email/ID', 409, r.status, r.status === 409);

r = await call('POST', '/auth/register', { body: { ...newUser, email: 'bad-email', studentId: 'x1' } });
record('A3', 'Register invalid email', 400, r.status, r.status === 400);

r = await call('POST', '/auth/register', { body: { ...newUser, email: `p${stamp}@cihe.edu.au`, studentId: `p${stamp}`, password: '123' } });
record('A4', 'Register short password', 400, r.status, r.status === 400);

r = await call('POST', '/auth/register', { body: { name: 'Sneaky', email: `z${stamp}@cihe.edu.au`, studentId: `z${stamp}`, password: 'Passw0rd!', role: 'admin' } });
record('A5', 'Register with role=admin in body stays student', 'student', r.data?.user?.role, r.data?.user?.role === 'student');

r = await call('POST', '/auth/login', { body: { studentId: 's1234567', password: 'Student123!' } });
record('A6', 'Login valid (seed student)', 200, r.status, r.status === 200 && !!r.data?.token);
const tokenStudent = r.data?.token;

r = await call('POST', '/auth/login', { body: { studentId: 's1234567', password: 'wrong' } });
record('A7', 'Login wrong password', 401, r.status, r.status === 401);

r = await call('POST', '/auth/login', { body: { studentId: { $ne: null }, password: { $ne: null } } });
record('A8', 'Login NoSQL operator injection rejected', 401, r.status, r.status === 401 || r.status === 400);

r = await call('POST', '/auth/login', { body: { studentId: 'admin01', password: 'Admin123!' } });
const tokenAdmin = r.data?.token;
record('A9', 'Login valid (seed admin)', 200, r.status, r.status === 200 && r.data?.user?.role === 'admin');

r = await call('GET', '/auth/me', { token: tokenStudent });
record('A10', 'GET /auth/me with token', 200, r.status, r.status === 200 && r.data?.user?.studentId === 's1234567' && r.data.user.password === undefined);

r = await call('GET', '/auth/me', { token: tokenStudent + 'x' });
record('A11', 'Tampered token rejected', 401, r.status, r.status === 401);

r = await call('PUT', '/auth/profile', { token: tokenNew, body: { name: 'Test Student', email: 'demo.student@cihe.edu.au', studentId: newUser.studentId } });
record('A12', 'Profile update clashing with another user', 409, r.status, r.status === 409);

r = await call('PUT', '/auth/profile', { token: tokenNew, body: { name: 'Renamed', email: newUser.email, studentId: newUser.studentId, role: 'admin' } });
record('A13', 'Profile update ignores role field', 'student', r.data?.user?.role, r.status === 200 && r.data?.user?.role === 'student' && r.data.user.name === 'Renamed');

// Equipment
r = await call('GET', '/equipment');
record('E1', 'Catalog without token', 401, r.status, r.status === 401);

r = await call('GET', '/equipment', { token: tokenStudent });
const items = r.data || [];
record('E2', 'Catalog with token returns items', 'items returned', `${items.length} items`, r.status === 200 && items.length > 0);

const available = items.find((i) => i.status === 'Available');
const maintenance = items.find((i) => i.status === 'Maintenance');
const inUse = items.find((i) => i.status === 'In Use');

r = await call('POST', '/equipment', { token: tokenStudent, body: { code: 'T-1', name: 'x', type: 'Equipment', category: 'x', description: 'x' } });
record('E3', 'Student cannot create catalog item', 403, r.status, r.status === 403);

const code = `TEST-${stamp}`;
r = await call('POST', '/equipment', { token: tokenAdmin, body: { code, name: 'Test Projector', type: 'Equipment', category: 'Audio/Visual', description: 'Test item', campusId: 'cbd' } });
record('E4', 'Admin creates catalog item', 201, r.status, r.status === 201 && r.data?.campusName?.includes('CBD'));
const newItemId = r.data?.id;

r = await call('POST', '/equipment', { token: tokenAdmin, body: { code, name: 'Dup', type: 'Equipment', category: 'x', description: 'x' } });
record('E5', 'Duplicate item code', 409, r.status, r.status === 409);

r = await call('POST', '/equipment', { token: tokenAdmin, body: { code: 'bad', name: 'x', type: 'Vehicle', category: 'x', description: 'x' } });
record('E6', 'Invalid item type', 400, r.status, r.status === 400);

r = await call('PUT', `/equipment/${newItemId}`, { token: tokenAdmin, body: { status: 'Maintenance', name: 'Test Projector v2' } });
record('E7', 'Admin updates item', 200, r.status, r.status === 200 && r.data?.status === 'Maintenance');

r = await call('PUT', `/equipment/${newItemId}`, { token: tokenStudent, body: { name: 'hack' } });
record('E8', 'Student cannot update item', 403, r.status, r.status === 403);

r = await call('PUT', `/equipment/${newItemId}`, { token: tokenAdmin, body: { status: 'Broken' } });
record('E9', 'Update with invalid status enum', '400', r.status, r.status === 400, r.status === 500 ? '(server returns 500: no validation error handling)' : '');

// Bookings
const d1 = future(10);
r = await call('POST', '/bookings', { token: tokenStudent, body: { id: available.id, date: d1 } });
record('B1', 'Student books available item', 201, r.status, r.status === 201);
const booking1 = r.data?.bookingId;

r = await call('POST', '/bookings', { token: tokenNew, body: { id: available.id, date: d1 } });
record('B2', 'Second user, same item and date', 409, r.status, r.status === 409);

r = await call('POST', '/bookings', { token: tokenStudent, body: { id: maintenance.id, date: future(11) } });
record('B3', 'Book item under maintenance', 400, r.status, r.status === 400);

r = await call('POST', '/bookings', { token: tokenStudent, body: { id: available.id } });
record('B4', 'Book without date', 400, r.status, r.status === 400);

r = await call('POST', '/bookings', { token: tokenStudent, body: { id: '000000000000000000000000', date: future(12) } });
record('B5', 'Book non-existent item', 404, r.status, r.status === 404);

r = await call('POST', '/bookings', { token: tokenStudent, body: { id: 'not-an-id', date: future(12) } });
record('B6', 'Book with malformed item id', '400/404', r.status, r.status === 400 || r.status === 404, r.status === 500 ? '(server returns 500 on malformed id)' : '');

// Concurrency
const d2 = future(20);
const [c1, c2, c3] = await Promise.all([
    call('POST', '/bookings', { token: tokenStudent, body: { id: available.id, date: d2 } }),
    call('POST', '/bookings', { token: tokenNew, body: { id: available.id, date: d2 } }),
    call('POST', '/bookings', { token: tokenAdmin, body: { id: available.id, date: d2 } })
]);
const statuses = [c1.status, c2.status, c3.status].sort();
record('B7', '3 simultaneous requests, same item and date', 'one 201, two 409', statuses.join('/'), statuses.filter((s) => s === 201).length === 1 && statuses.filter((s) => s === 409).length === 2);

r = await call('DELETE', `/bookings/${booking1}`, { token: tokenNew });
record('B10', "Student cancels another student's booking", 403, r.status, r.status === 403);

r = await call('DELETE', `/bookings/${booking1}`, { token: tokenStudent });
record('B11', 'Student cancels own booking', 200, r.status, r.status === 200);

r = await call('POST', '/bookings', { token: tokenNew, body: { id: available.id, date: d1 } });
record('B12', 'Date becomes free again after cancel', 201, r.status, r.status === 201);

const newWonConcurrent = c2.status === 201 ? 1 : 0;
r = await call('GET', '/bookings', { token: tokenNew });
const expectedOwn = 1 + newWonConcurrent;
record('B8', 'Student list shows only own bookings', `${expectedOwn} rows`, `${(r.data || []).length} rows`, r.status === 200 && (r.data || []).length === expectedOwn);
const newUserCount = (r.data || []).length;

r = await call('GET', '/bookings', { token: tokenAdmin });
record('B9', 'Admin list shows all bookings', `> ${newUserCount} rows`, `${(r.data || []).length} rows`, r.status === 200 && (r.data || []).length > newUserCount);

// Server-side date validation (known gap check)
r = await call('POST', '/bookings', { token: tokenStudent, body: { id: inUse.id, date: '2020-01-01' } });
record('B13', 'Server rejects a past date', 400, r.status, r.status === 400, r.status === 201 ? '(server accepts past dates; only the client sets min=today)' : '');

r = await call('POST', '/bookings', { token: tokenStudent, body: { id: inUse.id, date: 'banana' } });
record('B14', 'Server rejects a non-date string', 400, r.status, r.status === 400, r.status === 201 ? '(server accepts any string as date)' : '');

// Delete item
r = await call('DELETE', `/equipment/${newItemId}`, { token: tokenAdmin });
record('E10', 'Admin deletes item', 200, r.status, r.status === 200);

r = await call('GET', '/nope', { token: tokenAdmin });
record('X1', 'Unknown route returns JSON 404', 404, r.status, r.status === 404 && !!r.data?.message);

// DB-level checks
await mongoose.connect(process.env.MONGODB_URI);
const users = await mongoose.connection.db.collection('users').find({}).toArray();
const allHashed = users.every((u) => typeof u.password === 'string' && u.password.startsWith('$2'));
record('S1', 'All stored passwords are bcrypt hashes', `${users.length}/${users.length}`, `${users.filter((u) => String(u.password).startsWith('$2')).length}/${users.length}`, allHashed);
const idx = await mongoose.connection.db.collection('bookings').indexes();
const hasUnique = idx.some((i) => i.unique && i.key.equipment === 1 && i.key.date === 1);
record('S2', 'Unique compound index on bookings (equipment, date)', 'present', hasUnique ? 'present' : 'missing', hasUnique);
await mongoose.disconnect();

const pass = results.filter((x) => x.ok).length;
console.log(`\nTOTAL ${pass}/${results.length} passed`);
import fs from 'fs';
fs.writeFileSync('./api-test-results.json', JSON.stringify(results, null, 2));
