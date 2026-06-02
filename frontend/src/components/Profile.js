import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const Profile = () => {
    const [tgId, setTgId] = useState('');
    const [pw, setPw] = useState({ old: '', new: '' });
    const [username, setUsername] = useState('');

    useEffect(() => {
        api.get('/profile')
            .then(res => {
                setTgId(res.data.telegram_id || '');
                setUsername(res.data.username);
            })
            .catch(err => console.error("Ошибка загрузки профиля", err));
    }, []);

    const updateTg = async () => {
        try {
            await api.patch('/profile', { telegram_id: tgId });
            toast.success("Telegram ID сохранен");
        } catch (e) {
            toast.error("Ошибка при сохранении");
        }
    };

    const updatePw = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/profile/change-password', { 
                old_password: pw.old, 
                new_password: pw.new 
            });
            
            toast.success("Пароль успешно изменен");
            setPw({ old: '', new: '' });
        } catch (e) {
            console.error("Ошибка при смене пароля:", e.response);
            const errorMsg = e.response?.data?.error || "Ошибка сервера";
            toast.error(errorMsg);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <h2 style={{ color: '#1a2a3a', borderBottom: '2px solid #3498db', paddingBottom: '10px', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                Настройки профиля: {username}
            </h2>
            
            {/* Блок Telegram */}
            <div style={{ width: '100%', maxWidth: '500px', padding: '25px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee' }}>
                <h4 style={{ marginTop: 0 }}>Уведомления системы</h4>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Ваш цифровой ID для получения алармов в Telegram:</p>
                <input type="text" value={tgId} onChange={e => setTgId(e.target.value)} style={inputStyle} />
                <button onClick={() => {
                    api.patch('/profile', { telegram_id: tgId }).then(() => toast.success("ID обновлен"));
                }} style={{ width: '100%', background: '#3498db', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Сохранить ID
                </button>
            </div>

            {/* Блок Пароля */}
            <div style={{ width: '100%', maxWidth: '500px', padding: '25px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee' }}>
                <h4 style={{ marginTop: 0 }}>Безопасность</h4>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                        await api.post('/profile/change-password', { old_password: pw.old, new_password: pw.new });
                        toast.success("Пароль изменен");
                        setPw({ old: '', new: '' });
                    } catch { toast.error("Ошибка смены пароля"); }
                }}>
                    <input type="password" placeholder="Старый пароль" value={pw.old} required style={inputStyle} onChange={e => setPw({...pw, old: e.target.value})} />
                    <input type="password" placeholder="Новый пароль" value={pw.new} required style={inputStyle} onChange={e => setPw({...pw, new: e.target.value})} />
                    <button type="submit" style={{ width: '100%', background: '#1a2a3a', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Обновить пароль
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;