import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

const Reader = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
            console.log('Nenhum token encontrado, redirecionando para login');
            navigate('/login');
        } else {
            axios
                .get('http://127.0.0.1:8000/api/perfil/', {
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
                    setUser(null);
                });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    console.log('Estado user:', user);

    return (
        <div className="body-reader">
            <div className="top-bar-reader">
                <div className="logo">
                    <img src={require('../../assets/logo.png')} className="img-reader" alt="Logo" />
                </div>
                <div className="usuario-reader">
                    {error && <p className="error">{error}</p>}
                    <p className="p-reader">
                        {user && user.username ? `Olá, ${user.username}` : 'Carregando...'}
                    </p>
                    <div className="user-icon">
                        {user && user.username ? user.username[0] : '...'}
                    </div>
                    <div className="dropdown-menu">
                        <ul className="ul-reader">
                            <li className="li-reader">
                                <Link to="/perfil" className="itens">Meu Perfil</Link>
                            </li>
                            <li className="li-reader">
                                <Link to="/" className="itens">Tutorial de captura</Link>
                            </li>
                            <li className="li-reader">
                                <Link to="/" className="itens" onClick={handleLogout}>Sair</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reader;