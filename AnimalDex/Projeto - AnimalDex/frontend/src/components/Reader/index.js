import React from 'react';
import { Link } from "react-router-dom";
import './style.css';

const Reader = () => {

    return (
        <div class="body-reader">
            <div class="top-bar-reader">
                <div class="logo">
                    <img src={require('../../assets/LogoSENAC.png')} className='img-reader' alt="Logo" />
                </div>

                <div class="usuario-reader">
                    <p className='p-reader'>Olá, João Otavio Duarte de Souza</p>
                    <div class="user-icon">J</div>
                    <div class="dropdown-menu">
                        <ul className='ul-reader'>
                            <li className='li-reader'>
                                <Link to="/" className="itens">Meu Perfil</Link>
                            </li>
                            <li className='li-reader'>
                                <Link to="/" className="itens">Tutorial de captura</Link>
                            </li>
                            <li className='li-reader'>
                                <Link to="/" className="itens">Sair</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Reader;