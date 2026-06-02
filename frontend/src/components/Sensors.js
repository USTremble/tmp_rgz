import React, { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Sensors = () => {
    const [sensors, setSensors] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            const res = await api.get(`/sensors?page=${page}&search=${search}`);
            setSensors(res.data.sensors);
            setTotalPages(res.data.total_pages);
        } catch (e) {
            console.error("Ошибка загрузки данных:", e);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Удалить этот датчик из системы мониторинга?")) {
            try {
                await api.delete(`/sensors/${id}`);
                toast.success("Датчик удален");
                loadData();
            } catch (e) {
                toast.error("Ошибка при удалении");
            }
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'failure' : 'active';
        try {
            await api.post('/sensor/report', { sensor_id: id, status: newStatus });
            toast.success(newStatus === 'failure' ? "Сигнал сбоя отправлен!" : "Сигнал восстановления отправлен");
            loadData();
        } catch (e) {
            toast.error("Ошибка связи с датчиком");
        }
    };

    useEffect(() => {
        loadData();
    }, [page, search]);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Управление оборудованием</h2>
                <button 
                    onClick={() => navigate('/add-sensor')} 
                    style={{ background: '#2ecc71', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Установить новый датчик
                </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Поиск по названию или серийному номеру..." 
                    value={search}
                    onChange={(e) => {setSearch(e.target.value); setPage(1);}}
                    style={{ padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Серийный номер</th>
                        <th>Статус системы</th>
                        <th>Управление (Имитация)</th>
                        <th>Администрирование</th>
                    </tr>
                </thead>
                <tbody>
                    {sensors.length > 0 ? sensors.map(s => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{s.sn || '—'}</td>
                            <td style={{ fontWeight: 'bold', color: s.status === 'active' ? '#27ae60' : '#e74c3c' }}>
                                {s.status === 'active' ? '● РАБОТАЕТ' : '● СБОЙ'}
                            </td>
                            <td>
                                <button 
                                    onClick={() => toggleStatus(s.id, s.status)}
                                    style={{ background: s.status === 'active' ? '#f39c12' : '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    {s.status === 'active' ? 'Спровоцировать сбой' : 'Зафиксировать починку'}
                                </button>
                            </td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(s.id)} 
                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="6" style={{textAlign: 'center'}}>Датчики не найдены</td></tr>
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>« Назад</button>
                <span>Страница {page} из {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Вперед »</button>
            </div>
        </div>
    );
};

export default Sensors;