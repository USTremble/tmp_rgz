import React, { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const CreateReport = () => {
    const [loading, setLoading] = useState(false);

    const sendReport = async () => {
        setLoading(true);
        const loadToast = toast.loading("Сбор данных и отправка...");
        try {
            const res = await api.post('/reports/create');
            toast.success(res.data.message, { id: loadToast });
        } catch (e) {
            const errorMsg = e.response?.data?.error || "Ошибка при генерации";
            toast.error(errorMsg, { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📊</div>
            <h2>Генерация системного отчета</h2>
            <p style={{ color: '#666', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px auto' }}>
                Система просканирует все зоны мониторинга и отправит детальную сводку о неисправностях на ваш привязанный аккаунт Telegram.
            </p>
            <button 
                onClick={sendReport} 
                disabled={loading}
                style={{ 
                    padding: '15px 40px', 
                    background: loading ? '#ccc' : '#1a2a3a', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '30px', 
                    fontSize: '1.1rem', 
                    cursor: loading ? 'default' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s'
                }}
            >
                {loading ? "Отправка..." : "Сформировать и отправить отчет"}
            </button>
        </div>
    );
};
export default CreateReport;