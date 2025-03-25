import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './style.css';

const RegistroCard = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/registro/', {
                username,
                password,
                email,
            });
            // Faz login automaticamente após o registro
            const loginResponse = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password,
            });
            const token = loginResponse.data.token;
            localStorage.setItem('token', token); // Armazena o token no localStorage
            navigate('/perfil'); // Redireciona para a página de perfil
        } catch (err) {
            setError('Erro ao registrar');
        }
    };

    return (
        <>
            <div className="Body-registro">
                <div class="container-registro">
                    <div class="card-registro">
                        <h1 className='h1-registro'>Criar Conta</h1>
                        <form className='form-registro'>
                            <label for="nome" className='label-registro'>Nome Completo</label>
                            <input 
                                className='input-registro'
                                type="text" 
                                id="nome" 
                                placeholder="Digite seu nome completo"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                required />

                            <label for="usuario" className='label-registro'>Nome de Usuário</label>
                            <input 
                                className='input-registro'
                                type="text" 
                                id="usuario" 
                                placeholder="Digite seu nome de usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                required />

                            <label for="email" className='label-registro'>E-mail</label>
                            <input 
                                className='input-registro'  
                                type="email" 
                                id="email" 
                                placeholder="Digite seu email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required />

                            <label for="confirmar-email" className='label-registro'>Confirmar E-mail</label>
                            <input 
                                className='input-registro'
                                type="email"
                                id="confirmar-email" 
                                placeholder="Confirme seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required />

                            <label for="senha" className='label-registro'>Senha</label>
                            <input 
                                className='input-registro'
                                type="password" id="senha"
                                placeholder="Digite sua senha" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />

                            <label for="confirmar-senha" className='label-registro'>Confirmar Senha</label>
                            <input 
                                className='input-registro' 
                                type="password" 
                                id="confirmar-senha" 
                                placeholder="Confirme sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required />

                            <div class="termos">
                                <input type="checkbox" id="aceitar-termos" className='input-termo' required />
                                <label for="aceitar-termos" className='label-termo'>
                                    Li e aceito os <a className='a-termo' href="#">termos de uso</a> e a <a className='a-termo'  href="#">política de privacidade</a>.
                                </label>
                            </div>

                            <button className='btn-submit-registro' type="submit">Criar conta</button>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <p className="p-registro">
                            Já tem uma conta? <Link className='entrar-registro' to="/login">Entrar</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegistroCard;