import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './style.css';

const RegistroCard = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (email !== confirmEmail) {
            setError('Os e-mails não coincidem.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/registro/', {
                first_name: firstName,
                last_name: lastName,
                username,
                senha: password,
                email,
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            navigate('/home-user');
        } catch (err) {
            if (err.response && err.response.data) {
                // Mostra mensagem específica do backend, se existir
                if (err.response.data.username) {
                    setError(err.response.data.username[0]);
                } else {
                    setError('Erro ao registrar');
                }
                console.log('Erro detalhado:', err.response.data);
            } else {
                setError('Erro ao registrar');
            }
        }
    };

    return (
        <>
            <div className="Body-registro">
                <div className="container-registro">
                    <div className="card-registro">
                        <h1 className='h1-registro'>Criar Conta</h1>
                        <form className='form-registro' onSubmit={handleRegister}>
                            <label htmlFor="nome" className='label-registro'>Nome</label>
                            <input
                                className='input-registro'
                                type="text"
                                id="nome"
                                placeholder="Digite seu nome"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />

                            <label htmlFor="sobrenome" className='label-registro'>Sobrenome</label>
                            <input
                                className='input-registro'
                                type="text"
                                id="sobrenome"
                                placeholder="Digite seu sobrenome"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />

                            <label htmlFor="usuario" className='label-registro'>Nome de Usuário</label>
                            <input
                                className='input-registro'
                                type="text"
                                id="usuario"
                                placeholder="Digite seu nome de usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />

                            <label htmlFor="email" className='label-registro'>E-mail</label>
                            <input
                                className='input-registro'
                                type="email"
                                id="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="confirmar-email" className='label-registro'>Confirmar E-mail</label>
                            <input
                                className='input-registro'
                                type="email"
                                id="confirmar-email"
                                placeholder="Confirme seu email"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="senha" className='label-registro'>Senha</label>
                            <input
                                className='input-registro'
                                type="password"
                                id="senha"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <label htmlFor="confirmar-senha" className='label-registro'>Confirmar Senha</label>
                            <input
                                className='input-registro'
                                type="password"
                                id="confirmar-senha"
                                placeholder="Confirme sua senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <div className="termos">
                                <input type="checkbox" id="aceitar-termos" className='input-termo' required />
                                <label htmlFor="aceitar-termos" className='label-termo'>
                                Li e aceito os <a className='a-termo' href="/termos">termos de uso</a> e a <a className='a-termo' href="/privacidade">política de privacidade</a>.
                                </label>
                            </div>

                            <button className='btn-submit-registro' type="submit">Criar conta</button>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <p className="p-registro">
                            Já tem uma conta? <Link className='entrar-registro' to="/login">Entrar</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegistroCard;