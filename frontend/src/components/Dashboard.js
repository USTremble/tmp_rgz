import React, { useEffect, useState, useRef } from 'react'; // ДОБАВИЛ useRef СЮДА
import api from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [data, setData] = useState({ faults: [], service: [] });
    const isFirstLoad = useRef(true);

    const fetchData = async () => {
        try {
            const res = await api.get('/sensors/urgent');
            if (!isFirstLoad.current && res.data.faults.length > data.faults.length) {
                toast.error('ОБНАРУЖЕН НОВЫЙ СБОЙ В СИСТЕМЕ!', {
                    style: { background: '#c0392b', color: '#fff', fontWeight: 'bold' }
                });
            }
            setData(res.data);
            isFirstLoad.current = false;
        } catch (e) {
            console.log("Ошибка обновления данных");
        }
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(fetchData, 10000);
        return () => clearInterval(timer);
    }, [data.faults.length]); 

    return (
        <div>
            <h2 style={{ color: '#c0392b', borderBottom: '2px solid #c0392b', paddingBottom: '10px' }}>
                Активные сигналы сбоя ({data.faults.length})
            </h2>
            <div style={{ marginBottom: '40px', marginTop: '20px' }}>
                {data.faults.length === 0 ? (
                    <p style={{ color: '#27ae60' }}>✅ Критических сбоев не зафиксировано.</p>
                ) : (
                    data.faults.map(f => (
                        <div key={f.id} style={{ background: '#fff5f5', padding: '15px', borderLeft: '5px solid #c0392b', marginBottom: '10px', borderRadius: '4px' }}>
                            <strong>Устройство: {f.name}</strong> <br/>
                            <small>Зона ID: {f.zone_id} | Требуется немедленное вмешательство!</small>
                        </div>
                    ))
                )}
            </div>

            <h2 style={{ color: '#2980b9', borderBottom: '2px solid #2980b9', paddingBottom: '10px' }}>
                📅 Плановое обслуживание
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Оборудование, не проходившее проверку более 30 дней:</p>
            <div style={{ marginTop: '20px' }}>
                {data.service.length === 0 ? (
                    <p style={{ color: '#7f8c8d' }}>Все датчики обслужены вовремя.</p>
                ) : (
                    data.service.map(s => (
                        <div key={s.id} style={{ background: '#f0f7ff', padding: '15px', borderLeft: '5px solid #2980b9', marginBottom: '10px', borderRadius: '4px' }}>
                            <strong>{s.name}</strong> <br/>
                            <small>Последний сигнал: {s.date}</small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;