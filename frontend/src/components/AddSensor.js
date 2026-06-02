import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useLocation } from 'react-router-dom'; // Добавлен useLocation
import toast from 'react-hot-toast';

const AddSensor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const zoneId = location.state?.zoneId;
    const zoneName = location.state?.zoneName;

    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({ 
        name: '', 
        type_name: '', 
        serial_number: '' 
    });

    useEffect(() => {
        if (!zoneId) {
            toast.error("Сначала выберите зону");
            navigate('/zones');
            return;
        }

        const fetchTypes = async () => {
            try {
                const resTypes = await api.get('/sensor_types');
                setTypes(resTypes.data);
            } catch (e) {
                console.error("Ошибка загрузки типов оборудования");
            }
        };
        fetchTypes();
    }, [zoneId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const selectedType = types.find(t => t.name.toLowerCase() === form.type_name.toLowerCase());

        if (!selectedType) {
            return toast.error("Тип оборудования не найден! Выберите из списка.");
        }

        const loadToast = toast.loading("Регистрация устройства...");
        try {
            await api.post('/sensors', {
                name: form.name,
                zone_id: zoneId,
                type_id: selectedType.id,
                serial_number: form.serial_number
            });
            toast.success("Датчик успешно установлен!", { id: loadToast });
            navigate(`/zones/${zoneId}/sensors`); // Возвращаемся в ту же зону
        } catch (err) {
            toast.error("Ошибка при сохранении", { id: loadToast });
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginTop: '5px',
        marginBottom: '15px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '1rem'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '600px', padding: '30px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#fff' }}>
                <h2 style={{ textAlign: 'center', color: '#1a2a3a', marginBottom: '30px', borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>
                    Монтаж в зоне: {zoneName || `#${zoneId}`}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <label style={{ fontWeight: '600', color: '#555' }}>Название устройства:</label>
                    <input 
                        type="text" 
                        placeholder="Например: Вытяжка В-12" 
                        required 
                        style={inputStyle}
                        onChange={e => setForm({...form, name: e.target.value})} 
                    />

                    <label style={{ fontWeight: '600', color: '#555' }}>Тип оборудования:</label>
                    <input 
                        list="types-list"
                        type="text" 
                        placeholder="Начните вводить: Вытяжка, Датчик..." 
                        required 
                        style={inputStyle}
                        onChange={e => setForm({...form, type_name: e.target.value})} 
                    />
                    <datalist id="types-list">
                        {types.map(t => <option key={t.id} value={t.name} />)}
                    </datalist>

                    <label style={{ fontWeight: '600', color: '#555' }}>Серийный номер (SN):</label>
                    <input 
                        type="text" 
                        placeholder="SN-000000"
                        style={inputStyle}
                        onChange={e => setForm({...form, serial_number: e.target.value})} 
                    />

                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button type="submit" style={{ flex: 2, padding: '14px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Зарегистрировать и запустить
                        </button>
                        <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '14px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSensor;