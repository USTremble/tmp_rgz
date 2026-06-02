import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const ZoneSensors = () => {
    const { zoneId } = useParams();
    const [sensors, setSensors] = useState([]);
    const navigate = useNavigate();

    const load = async () => {
        try {
            const res = await api.get(`/zones/${zoneId}/sensors`);
            setSensors(res.data);
        } catch (e) {
            console.error("Ошибка загрузки");
        }
    };

    const toggle = async (id, status) => {
        try {
            await api.post('/sensors/report', { 
                sensor_id: id, 
                status: status === 'active' ? 'failure' : 'active' 
            });
            toast.success("Статус изменен");
            load();
        } catch (e) {
            toast.error("Ошибка при смене статуса");
        }
    };

    const deleteSensor = async (id) => {
        if (window.confirm("Вы действительно хотите удалить этот датчик из системы?")) {
            try {
                await api.delete(`/sensors/${id}`);
                toast.success("Датчик полностью удален");
                load();
            } catch (e) {
                toast.error("Ошибка при удалении");
            }
        }
    };

    useEffect(() => { 
        load(); 
    }, [zoneId]);

    return (
        <div>
            <button 
            onClick={() => navigate('/zones')} 
            style={{ 
                background: 'none', 
                border: '1px solid #1a2a3a', 
                color: '#1a2a3a', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                marginBottom: '25px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
            }}
            >
            ← К списку зон
        </button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Датчики в зоне #{zoneId}</h2>
                <button 
                    onClick={() => navigate('/add-sensor', { state: { zoneId: zoneId} })} 
                    style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Добавить датчик
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {sensors.length > 0 ? sensors.map(s => (
                    <div key={s.id} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', background: s.status === 'failure' ? '#fff5f5' : 'white' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ fontSize: '1.1rem' }}>{s.name}</strong> <br/> 
                            <small>ID: {s.id} | SN: {s.sn}</small>
                            <small>Последняя проверка: {s.last_date}</small>
                        </div>
                        
                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: s.status === 'active' ? '#27ae60' : '#e74c3c', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                ● {s.status.toUpperCase()}
                            </span>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    onClick={() => toggle(s.id, s.status)} 
                                    style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', background: '#fff' }}
                                >
                                    {s.status === 'active' ? 'Сбой' : 'Починить'}
                                </button>
                                <button 
                                    onClick={() => navigate(`/sensors/edit/${s.id}`)} 
                                    style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #3498db', color: '#3498db', background: '#fff', cursor: 'pointer' }}
                                >
                                    Изменить
                                </button>
                                <button 
                                    onClick={() => deleteSensor(s.id)} 
                                    style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: '#f8d7da', color: '#721c24' }}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p style={{ color: '#999', gridColumn: '1 / 3' }}>В этой зоне пока нет установленных датчиков.</p>
                )}
            </div>
        </div>
    );
};

export default ZoneSensors;