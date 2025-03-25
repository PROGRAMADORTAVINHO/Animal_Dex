import React from 'react';
import { Link } from "react-router-dom";
import './style.css';

const PerfilCard = () => {

    return (
        <div className="body-perfil">
            <div className="top-bar-perfil">
                <Link to="/" className="back-button-perfil">← Voltar</Link>
                <div className="title_reader">Perfil</div>
            </div>

            <div className="container">
                <div className="card-perfil">
                    <h1 className='h1-perfil'>Informações Pessoais</h1>

                    <div className="avatar-perfil">
                        <span>U</span>
                    </div>

                    <form>
                        <label
                            htmlFor="nome"
                            className="label-perfil"
                        > Nome: </label>
                        <input
                            type="text"
                            id="nome"
                            placeholder="Seu nome"
                            className="input-perfil"
                            required
                        />

                        <label
                            htmlFor="email"
                            className="label-perfil"
                        > E-mail: </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Seu email"
                            className="input-perfil"
                            required
                        />

                        <button type="submit" className="save-btn">Salvar Alterações</button>
                    </form>

                    <form>
                        <h1 className='h1-perfil-senha'>Segurança</h1>

                        <label htmlFor="senha_atual" className="label-perfil">Senha Atual:</label>
                        <input
                            type="password"
                            id="senha_atual"
                            placeholder="Digite sua senha atual"
                            className="input-perfil"
                            required
                        />

                        <label htmlFor="nova_senha" className="label-perfil">Nova Senha:</label>
                        <input
                            type="password"
                            id="nova_senha"
                            placeholder="Digite sua nova senha"
                            className="input-perfil"
                            required
                        />

                        <label htmlFor="confirmar_senha" className='label-perfil'>Confirmar Nova Senha</label>
                        <input
                            type="password"
                            id="confirmar_senha"
                            placeholder="Confirme sua nova senha"
                            className="input-perfil"
                            required
                        />

                        <button type="submit" className="change-btn">Alterar Senha</button>
                    </form>
                </div>
            </div>
            <div className="espaco-perfil"></div>
        </div>
    );
};
export default PerfilCard;