import React, { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const Subscriptions = () => {
    const [zones, setZones] = useState([]);
    const [mySubs, setMySubs] = useState([]);

    const loadData = async () => {
        try {
            const resZones = await api.get('/zones');
            const resSubs = await api.get('/subscriptions');
            setZones(resZones.data || []);
            setMySubs(resSubs.data || []);
        } catch (e) {
            toast.error("Ошибка связи с сервером");
        }
    };

    useEffect(() => { loadData() }, []);

    const toggleSub = async (zoneId) => {
        try {
            await api.post('/subscriptions/toggle', { zone_id: zoneId });
            loadData();
            toast.success("Статус подписки изменен");
        } catch (e) {
            toast.error("Не удалось изменить подписку");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Управление оповещениями</h2>
            <small>Вы можете управлять своими подписками на оповещения о состоянии датчиков. При изменении статуса датчика вы будете получать немедленное уведомления.</small>
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                {zones.map(z => (
                    <div key={z.id} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><b>{z.name}</b> ({z.location})</span>
                        <button 
                            onClick={() => toggleSub(z.id)}
                            style={{
                                background: mySubs.includes(z.id) ? '#e74c3c' : '#3498db',
                                color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer'
                            }}
                        >
                            {mySubs.includes(z.id) ? "Отписаться" : "Подписаться"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Subscriptions;