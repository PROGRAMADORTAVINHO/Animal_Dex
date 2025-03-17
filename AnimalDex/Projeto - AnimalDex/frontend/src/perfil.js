import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redireciona para o login se não houver token
        } else {
            // Busca as informações do usuário
            axios.get('http://127.0.0.1:8000/api/perfil/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then(response => {
                console.log('Resposta do perfil:', response.data);
                setUser(response.data);
            })
            .catch(err => {
                console.error('Erro ao carregar perfil:', err.response ? err.response.data : err.message);
                setError('Erro ao carregar perfil');
            });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove o token
        navigate('/login'); // Redireciona para o login
    };

    return (
        <div>
            <h2>Perfil</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user && (
                <div>
                    <p>Nome de usuário: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Nome: {user.first_name}</p>
                </div>
            )}
            <button onClick={handleLogout}>Sair</button>
        </div>
    );
};

export default Perfil;