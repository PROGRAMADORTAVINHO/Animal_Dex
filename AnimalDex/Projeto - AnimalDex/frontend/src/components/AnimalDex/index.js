import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './style.css';

// Funções idênticas ao IdentificarAnimais.js
const getDescricaoPerigo = (nivel) => {
    switch (Number(nivel)) {
        case 1: return "Perigo mínimo";
        case 2: return "Pouco perigoso";
        case 3: return "Perigo moderado";
        case 4: return "Perigo alto";
        case 5: return "Perigo extremo";
        default: return "Nível desconhecido";
    }
};

const getDescricaoExtincao = (nivel) => {
    switch (Number(nivel)) {
        case 1: return "Pouco ameaçado";
        case 2: return "Quase ameaçado";
        case 3: return "Vulnerável";
        case 4: return "Em perigo";
        case 5: return "Criticamente em perigo";
        default: return "Nível desconhecido";
    }
};

const AnimalDex = () => {
    const [capturas, setCapturas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('http://127.0.0.1:8000/api/perfil/identificacoes/', {
            headers: { Authorization: `Token ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setCapturas(data.results || data);
            })
            .catch(() => setError('Erro ao carregar sua coleção.'));
    }, []);

    return (
        <>
            <div className="body_minhacolecao">
                <div className="top-bar-minha-colecao">
                    <Link to="/home-user" className="back-button">← Voltar</Link>
                    <div className="title_reader">Minha Coleção</div>
                </div>

                <div className="conteiner-minhacolecao">
                    {error && <p style={{ color: 'red', width: '100%' }}>{error}</p>}
                    {capturas.length === 0 ? (
                        <div style={{ width: '100%', textAlign: 'center', marginTop: 40 }}>
                            <h2>Você ainda não identificou nenhum animal.</h2>
                            <p>Capture animais para vê-los aqui no seu almanaque!</p>
                        </div>
                    ) : (
                        // Filtra para mostrar apenas a captura mais recente de cada animal
                        Object.values(
                            capturas.reduce((acc, captura) => {
                                const id = captura.animal?.id;
                                // Se já existe, compara datas e mantém a mais recente
                                if (!id) return acc;
                                if (
                                    !acc[id] ||
                                    new Date(captura.data_identificacao) > new Date(acc[id].data_identificacao)
                                ) {
                                    acc[id] = captura;
                                }
                                return acc;
                            }, {})
                        )
                        // Ordena por data_identificacao (mais recente primeiro)
                        .sort((a, b) => new Date(b.data_identificacao) - new Date(a.data_identificacao))
                        .map((captura, idx) => {
                            const nivelPerigo = captura.animal?.nivel_perigo ?? captura.animal?.perigo;
                            const nivelExtincao = captura.animal?.nivel_extincao;

                            return (
                                <div className="card-animal" key={idx}>
                                    <img
                                        src={
                                            captura.imagem
                                                ? (captura.imagem.startsWith('http')
                                                    ? captura.imagem
                                                    : `http://127.0.0.1:8000${captura.imagem}`)
                                                : "https://via.placeholder.com/300x200?text=Sem+Imagem"
                                        }
                                        alt={captura.animal?.nome_comum || 'Animal'}
                                    />
                                    <div className="overlay">
                                        <h2 className="overlay-title">{captura.animal?.nome_comum || 'Animal'}</h2>
                                        <h3 className="overlay-subtitle">{captura.animal?.nome_cientifico || ''}</h3>
                                        <p className="overlay-description">
                                            {captura.animal?.descricao || 'Sem descrição disponível.'}
                                        </p>
                                        <div className="overlay-footer">
                                            <span className="overlay-tag">
                                                {getDescricaoPerigo(nivelPerigo)}
                                            </span>
                                            <span className="overlay-tag">
                                                {getDescricaoExtincao(nivelExtincao)}
                                            </span>
                                            <span className="overlay-date">{captura.data_identificacao}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};

export default AnimalDex;