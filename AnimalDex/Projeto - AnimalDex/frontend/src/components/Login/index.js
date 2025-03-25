import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './style.css';

const LoginCard = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('token', token); // Armazena o token no localStorage
            navigate('/perfil'); // Redireciona para a página de perfil
        } catch (err) {
            setError('Credenciais inválidas');
        }
    };

    return (

        <div className="Body_login">
            <div className="container">
                <div className="card">
                    <h1 className='h1-login'>Bem-vindo</h1>
                    <p className='p-login'>Entre na sua conta</p>
                    <form className='form-login' onSubmit={handleLogin}>
                        <label className='label-login' for="usuario">Usuário</label>
                        <input
                            className='input-login'
                            type="text"
                            id="usuario"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <label className='label-login' htmlFor="senha">Senha</label>
                        <input
                            className='input-login'
                            type="password"
                            id="senha"
                            onChange={(e) => setPassword(e.target.value)}
                            required />

                        <button className="btn-submit-login" type="submit">Entrar</button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <p className="esqueceu-senha">
                        <Link to="/registro" className='cadastre_se-login'>Esqueceu sua senha?</Link>
                    </p>
                    <p className="cadastro">
                        Não tem uma conta? <Link to="/registro" className='cadastre_se-login'>Cadastre-se</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginCard;