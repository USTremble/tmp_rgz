import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [form, setForm] = useState({ 
        username: '', 
        password: '', 
        confirmPassword: '' 
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        
        // ТВОЯ рабочая проверка
        const pass = form.password;
        const conf = form.confirmPassword;

        if (pass !== conf) {
            return toast.error("Пароли не совпадают!");
        }

        if (pass.length < 4) {
            return toast.error("Пароль слишком короткий!");
        }

        const loadToast = toast.loading("Создание аккаунта...");
        try {
            await api.post('/register', { 
                username: form.username, 
                password: form.password 
            });
            toast.success("Регистрация завершена! Войдите.", { id: loadToast });
            navigate('/login');
        } catch (err) {
            const message = err.response?.data?.error || "Ошибка регистрации";
            toast.error(message, { id: loadToast });
        }
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e1e8ed',
        boxSizing: 'border-box',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginTop: '8px',
        marginBottom: '20px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '1rem'
    };

    const buttonStyle = {
        width: '100%',
        padding: '14px',
        background: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        marginTop: '10px'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={cardStyle}>
                <h2 style={{ textAlign: 'center', color: '#1a2a3a', marginBottom: '30px' }}>Регистрация</h2>
                <form onSubmit={handleRegister}>
                    <label style={{ fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Имя пользователя:</label>
                    <input 
                        type="text" 
                        required 
                        value={form.username}
                        style={inputStyle}
                        onChange={e => setForm({...form, username: e.target.value})} 
                    />
                    
                    <label style={{ fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Пароль:</label>
                    <input 
                        type="password" 
                        required 
                        value={form.password}
                        style={inputStyle}
                        onChange={e => setForm({...form, password: e.target.value})} 
                    />
                    
                    <label style={{ fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Подтвердите пароль:</label>
                    <input 
                        type="password" 
                        required 
                        value={form.confirmPassword}
                        style={inputStyle}
                        onChange={e => setForm({...form, confirmPassword: e.target.value})} 
                    />
                    
                    <button type="submit" style={buttonStyle}>Зарегистрироваться</button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Уже есть аккаунт? </span>
                    <b onClick={() => navigate('/login')} style={{ color: '#3498db', cursor: 'pointer', fontSize: '0.9rem' }}>Войти</b>
                </div>
            </div>
        </div>
    );
};

export default Register;