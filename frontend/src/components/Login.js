import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = ({ setAuth }) => {
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        const loadToast = toast.loading("Авторизация...");
        try {
            await api.post('/login', form);
            localStorage.setItem('isLoggedIn', 'true'); 
            setAuth(true);
            toast.success("Вход выполнен успешно!", { id: loadToast });
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.error || "Неверный логин или пароль";
            toast.error(message, { id: loadToast });
        }
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '400px',
        margin: '40px auto',
        padding: '40px',
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e1e8ed',
        boxSizing: 'border-box'
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
        background: '#1a2a3a',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <div style={cardStyle}>
                <h2 style={{ textAlign: 'center', color: '#1a2a3a', marginBottom: '30px' }}>Вход в систему</h2>
                <form onSubmit={handleLogin}>
                    <label style={{ fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Логин:</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="Ваш логин"
                        style={inputStyle}
                        onChange={e => setForm({...form, username: e.target.value})} 
                    />
                    <label style={{ fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Пароль:</label>
                    <input 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        style={inputStyle}
                        onChange={e => setForm({...form, password: e.target.value})} 
                    />
                    <button type="submit" style={buttonStyle}>Войти диспетчером</button>
                </form>
                <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Новый сотрудник? </span>
                    <b onClick={() => navigate('/register')} style={{ color: '#3498db', cursor: 'pointer', fontSize: '0.9rem' }}>Зарегистрироваться</b>
                </div>
            </div>
        </div>
    );
};

export default Login;