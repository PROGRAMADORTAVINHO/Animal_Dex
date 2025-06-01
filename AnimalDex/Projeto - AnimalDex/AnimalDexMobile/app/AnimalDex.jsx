import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const style = `
.body-animaldex-mobile {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8f6ef 0%, #f7ffe0 100%);
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #333;
    padding-bottom: 24px;
}
.top-bar-mobile {
    width: 100vw;
    left: 0;
    top: 0;
    margin-left: calc(-50vw + 50%);
    margin-bottom: 18px;
    background: linear-gradient(90deg, #e0e7ef 60%, #f7ffe0 100%);
    border-bottom: 2px solid #b6e388;
    box-shadow: 0 2px 8px rgba(20, 83, 45, 0.08);
    display: flex;
    align-items: center;
    padding: 0 12px;
    position: relative;
    z-index: 10;
    height: 54px;
}
.back-button-mobile {
    color: #14532d;
    background: #e8f6ef;
    border-radius: 8px;
    padding: 7px 14px;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    border: 1px solid #b6e388;
    transition: background 0.2s, color 0.2s;
    margin-right: 10px;
}
.back-button-mobile:hover {
    background: #bbf7d0;
    color: #14532d;
}
.title-mobile {
    font-size: 20px;
    font-weight: bold;
    color: #14532d;
    letter-spacing: 1px;
    margin: 0 auto;
    text-shadow: 0 1px 0 #fff, 0 2px 8px #b6e38844;
}
.container-animaldex-mobile {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 0 6px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}
.card-animal-mobile {
    background: #fff;
    border-radius: 18px 18px 40px 18px;
    box-shadow: 0 6px 24px rgba(20, 83, 45, 0.10), 0 1.5px 0 #a3e63511 inset;
    overflow: hidden;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.img-animal-mobile {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 18px 18px 0 0;
    background: #e0e7ef;
}
.overlay-mobile {
    padding: 16px 12px 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.overlay-title-mobile {
    font-size: 1.2em;
    font-weight: bold;
    color: #14532d;
    margin: 0 0 2px 0;
}
.overlay-subtitle-mobile {
    font-size: 1em;
    color: #007bff;
    margin: 0 0 6px 0;
}
.overlay-description-mobile {
    font-size: 0.98em;
    color: #444;
    margin-bottom: 8px;
}
.overlay-footer-mobile {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}
.overlay-tag-mobile {
    background: linear-gradient(90deg, #a3e635 60%, #65a30d 100%);
    color: #14532d;
    padding: 4px 10px;
    border-radius: 15px;
    font-weight: bold;
    font-size: 0.95em;
}
.overlay-date-mobile {
    color: #888;
    font-size: 0.92em;
    margin-left: auto;
}
.error-mobile {
    color: #e74c3c;
    text-align: center;
    margin: 18px 0;
}
.empty-mobile {
    text-align: center;
    color: #888;
    margin: 40px 0;
}
`;

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

const AnimalDexMobile = () => {
    const [capturas, setCapturas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Adiciona o style apenas uma vez
        if (!document.getElementById('animaldex-mobile-style')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'animaldex-mobile-style';
            styleTag.innerHTML = style;
            document.head.appendChild(styleTag);
        }
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
        <div className="body-animaldex-mobile">
            <div className="top-bar-mobile">
                <Link to="/home-user" className="back-button-mobile">← Voltar</Link>
                <div className="title-mobile">Minha Coleção</div>
            </div>
            <div className="container-animaldex-mobile">
                {error && <p className="error-mobile">{error}</p>}
                {capturas.length === 0 ? (
                    <div className="empty-mobile">
                        <h2>Você ainda não identificou nenhum animal.</h2>
                        <p>Capture animais para vê-los aqui no seu almanaque!</p>
                    </div>
                ) : (
                    Object.values(
                        capturas.reduce((acc, captura) => {
                            const id = captura.animal?.id;
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
                    .sort((a, b) => new Date(b.data_identificacao) - new Date(a.data_identificacao))
                    .map((captura, idx) => {
                        const nivelPerigo = captura.animal?.nivel_perigo ?? captura.animal?.perigo;
                        const nivelExtincao = captura.animal?.nivel_extincao;
                        return (
                            <div className="card-animal-mobile" key={idx}>
                                <img
                                    src={
                                        captura.imagem
                                            ? (captura.imagem.startsWith('http')
                                                ? captura.imagem
                                                : `http://127.0.0.1:8000${captura.imagem}`)
                                            : "https://via.placeholder.com/300x200?text=Sem+Imagem"
                                    }
                                    alt={captura.animal?.nome_comum || 'Animal'}
                                    className="img-animal-mobile"
                                />
                                <div className="overlay-mobile">
                                    <h2 className="overlay-title-mobile">{captura.animal?.nome_comum || 'Animal'}</h2>
                                    <h3 className="overlay-subtitle-mobile">{captura.animal?.nome_cientifico || ''}</h3>
                                    <p className="overlay-description-mobile">
                                        {captura.animal?.descricao || 'Sem descrição disponível.'}
                                    </p>
                                    <div className="overlay-footer-mobile">
                                        <span className="overlay-tag-mobile">
                                            {getDescricaoPerigo(nivelPerigo)}
                                        </span>
                                        <span className="overlay-tag-mobile">
                                            {getDescricaoExtincao(nivelExtincao)}
                                        </span>
                                        <span className="overlay-date-mobile">
                                            {new Date(captura.data_identificacao).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AnimalDexMobile;