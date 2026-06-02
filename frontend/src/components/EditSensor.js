import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const EditSensor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', serial_number: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSingleSensor = async () => {
            try {
                
                const res = await api.get(`/sensors/${id}`);
                setForm({
                    name: res.data.name,
                    serial_number: res.data.sn || ''
                });
                setLoading(false);
            } catch (e) {
                toast.error("Ошибка связи с сервером");
                setLoading(false);
            }
        };
        loadSingleSensor();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Сохранение...");
        try {
            await api.put(`/sensors/${id}`, form);
            toast.success("Данные обновлены", { id: loadToast });
            navigate(-1);
        } catch (e) {
            toast.error("Ошибка при сохранении", { id: loadToast });
        }
    };

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Загрузка...</div>;

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
                Редактирование датчика #{id}
            </h2>
            <form onSubmit={handleSave} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>Название устройства:</label>
                <input 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <label>Серийный номер:</label>
                <input 
                    value={form.serial_number} 
                    onChange={e => setForm({...form, serial_number: e.target.value})} 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#3498db', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}>
                        Сохранить
                    </button>
                    <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, background: '#95a5a6', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}>
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};
export default EditSensor;