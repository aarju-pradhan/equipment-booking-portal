import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import ErrorBadge from '../components/features/ErrorBadge.jsx';
import Spinner from '../components/features/Spinner.jsx';
import { NSW_CAMPUSES } from '../data/campuses.js';

const emptyForm = {
    code: '',
    name: '',
    type: 'Equipment',
    category: '',
    status: 'Available',
    description: '',
    image: '',
    campusId: 'miller'
};

function ItemFields({ form, onChange, idPrefix }) {
    return (
        <>
            <div className="profile-grid">
                <div className="form-field">
                    <label htmlFor={`${idPrefix}-code`}>Code</label>
                    <input id={`${idPrefix}-code`} className="text-input" name="code" value={form.code} onChange={onChange} />
                </div>
                <div className="form-field">
                    <label htmlFor={`${idPrefix}-name`}>Name</label>
                    <input id={`${idPrefix}-name`} className="text-input" name="name" value={form.name} onChange={onChange} />
                </div>
                <div className="form-field">
                    <label htmlFor={`${idPrefix}-type`}>Type</label>
                    <select id={`${idPrefix}-type`} className="text-input" name="type" value={form.type} onChange={onChange}>
                        <option value="Equipment">Equipment</option>
                        <option value="Facility">Facility</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor={`${idPrefix}-category`}>Category</label>
                    <input id={`${idPrefix}-category`} className="text-input" name="category" value={form.category} onChange={onChange} />
                </div>
                <div className="form-field">
                    <label htmlFor={`${idPrefix}-status`}>Status</label>
                    <select id={`${idPrefix}-status`} className="text-input" name="status" value={form.status} onChange={onChange}>
                        <option value="Available">Available</option>
                        <option value="In Use">In Use</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor={`${idPrefix}-image`}>Image URL</label>
                    <input id={`${idPrefix}-image`} className="text-input" name="image" value={form.image} onChange={onChange} />
                </div>
            </div>
            <div className="form-field">
                <label htmlFor={`${idPrefix}-campus`}>Campus</label>
                <select id={`${idPrefix}-campus`} className="text-input" name="campusId" value={form.campusId} onChange={onChange}>
                    {NSW_CAMPUSES.map((campus) => (
                        <option key={campus.id} value={campus.id}>
                            {campus.name} — {campus.address}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-field">
                <label htmlFor={`${idPrefix}-description`}>Description</label>
                <textarea id={`${idPrefix}-description`} className="text-input" name="description" rows="3" value={form.description} onChange={onChange} />
            </div>
        </>
    );
}

function Admin() {
    const [items, setItems] = useState([]);
    const [addForm, setAddForm] = useState(emptyForm);
    const [editForm, setEditForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const loadItems = async () => {
        const data = await apiRequest('/equipment');
        setItems(data);
    };

    useEffect(() => {
        loadItems()
            .catch((err) => {
                setMessage(err.message);
                setIsError(true);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAddChange = (e) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            await apiRequest('/equipment', {
                method: 'POST',
                body: JSON.stringify(addForm)
            });
            setAddForm(emptyForm);
            setMessage('Catalog item created.');
            await loadItems();
        } catch (err) {
            setMessage(err.message);
            setIsError(true);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            await apiRequest(`/equipment/${editingId}`, {
                method: 'PUT',
                body: JSON.stringify(editForm)
            });
            setEditingId('');
            setEditForm(emptyForm);
            setMessage('Catalog item updated.');
            await loadItems();
        } catch (err) {
            setMessage(err.message);
            setIsError(true);
        }
    };

    const editItem = (item) => {
        setEditingId(item.id);
        setEditForm({
            code: item.code || '',
            name: item.name,
            type: item.type,
            category: item.category,
            status: item.status,
            description: item.description,
            image: item.image || '',
            campusId: item.campusId || 'miller'
        });
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this catalog item?')) return;
        try {
            await apiRequest(`/equipment/${id}`, { method: 'DELETE' });
            if (editingId === id) {
                setEditingId('');
                setEditForm(emptyForm);
            }
            await loadItems();
            setMessage('Catalog item deleted.');
            setIsError(false);
        } catch (err) {
            setMessage(err.message);
            setIsError(true);
        }
    };

    return (
        <main id="main-content" className="page">
            <h1>Admin catalog</h1>
            <p className="muted">Create, update, or remove equipment and facilities. Changes are saved in MongoDB.</p>

            {message && (
                <div className={`feedback ${isError ? 'feedback-error' : 'feedback-success'}`} role="status">
                    {message}
                </div>
            )}

            <form className="card stack" onSubmit={handleAdd} style={{ margin: '1.5rem 0' }}>
                <h2>Add item</h2>
                <ItemFields form={addForm} onChange={handleAddChange} idPrefix="add" />
                <div className="filters">
                    <button type="submit" className="btn btn-primary">Add item</button>
                </div>
            </form>

            {isLoading ? <Spinner /> : (
                <div className="card-grid">
                    {items.map((item) => (
                        <React.Fragment key={item.id}>
                            <article className="equip-card">
                                <h3>{item.name}</h3>
                                <p className="muted">{item.code} · {item.type} · {item.status}</p>
                                <p className="muted">{item.campusName}</p>
                                <p className="muted">{item.address}</p>
                                <p>{item.description}</p>
                                <div className="card-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => editItem(item)}>Edit</button>
                                    <button type="button" className="btn btn-danger" onClick={() => deleteItem(item.id)}>Delete</button>
                                </div>
                            </article>
                            {editingId === item.id && (
                                <form className="card stack admin-edit-panel" onSubmit={handleSaveEdit}>
                                    <h2>Edit {item.name}</h2>
                                    <ItemFields form={editForm} onChange={handleEditChange} idPrefix="edit" />
                                    <div className="filters">
                                        <button type="submit" className="btn btn-primary">Save item</button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setEditingId('');
                                                setEditForm(emptyForm);
                                            }}
                                        >
                                            Cancel edit
                                        </button>
                                    </div>
                                </form>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
            {!isLoading && items.length === 0 && !message && (
                <ErrorBadge message="No catalog items yet." />
            )}
        </main>
    );
}

export default Admin;
