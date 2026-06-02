import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ZoneList = () => {
    const [zones, setZones] = useState([]);
    const navigate = useNavigate();

    const load = async () => {
        try {
            const res = await api.get('/zones');
            setZones(res.data);
        } catch (e) {
            console.error("Ошибка загрузки зон");
        }
    };

    const del = async (id) => {
        if (window.confirm("Удалить зону и все её датчики?")) {
            try {
                await api.delete(`/zones/${id}`);
                toast.success("Зона удалена");
                load();
            } catch (e) {
                toast.error("Ошибка при удалении");
            }
        }
    };

    useEffect(() => { load() }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: 0, color: '#1a2a3a' }}>Зоны мониторинга</h2>
                <button 
                    onClick={() => navigate('/add-zone')} 
                    style={{ 
                        background: '#2ecc71', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}
                >
                    Новая зона
                </button>
            </div>

            <table width="100%" style={{ borderCollapse: 'collapse', backgroundColor: 'white' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '12px', textAlign: 'center' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Название</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Локация</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Ответственный</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {zones.length > 0 ? zones.map(z => (
                        <tr key={z.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px', textAlign: 'center', color: '#888' }}>{z.id}</td>
                            
                            <td style={{ padding: '12px', textAlign: 'center' }}>{z.name}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{z.location}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{z.responsible}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button 
                                        onClick={() => navigate(`/zones/${z.id}/sensors`)} 
                                        style={{ background: '#3498db', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Датчики
                                    </button>
                                    <button 
                                        onClick={() => del(z.id)} 
                                        style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                Зоны еще не добавлены
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ZoneList;