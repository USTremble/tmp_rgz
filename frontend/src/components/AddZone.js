import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddZone = () => {
    const [form, setForm] = useState({ name: '', location: '', responsible: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/zones', form);
            toast.success("Новая зона создана!");
            navigate('/zones');
        } catch (err) {
            toast.error("Ошибка при создании");
        }
    };

    const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ width: '100%', maxWidth: '500px', padding: '30px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h2 style={{ textAlign: 'center', color: '#1a2a3a', marginBottom: '25px', borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>Регистрация новой зоны</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Название зоны:</label>
                        <input type="text" required placeholder="Например: Цех сборки" style={inputStyle} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Локация:</label>
                        <input type="text" required placeholder="Сектор / Этаж" style={inputStyle} onChange={e => setForm({...form, location: e.target.value})} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Ответственный:</label>
                        <input type="text" required placeholder="ФИО инженера" style={inputStyle} onChange={e => setForm({...form, responsible: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" style={{ flex: 1, background: '#2ecc71', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Создать зону</button>
                        <button type="button" onClick={() => navigate('/zones')} style={{ flex: 1, background: '#95a5a6', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer' }}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddZone;