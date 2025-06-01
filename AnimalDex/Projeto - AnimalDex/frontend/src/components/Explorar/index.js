import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './style.css';

// Funções de tradução dos níveis
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

const ExplorarCard = () => {
    const [animais, setAnimais] = useState([]);
    const [capturados, setCapturados] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtroPerigo, setFiltroPerigo] = useState('');
    const [filtroExtincao, setFiltroExtincao] = useState('');

    // Busca todos os animais do BD
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/animais/')
            .then(res => res.json())
            .then(data => setAnimais(data.results || data))
            .catch(() => setAnimais([]));
    }, []);

    // Busca animais capturados pelo usuário e salva a imagem mais recente de cada animal
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('http://127.0.0.1:8000/api/perfil/identificacoes/', {
            headers: { Authorization: `Token ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                // Mapeia a captura mais recente de cada animal capturado
                const capturas = (data.results || data);
                const capturadosIds = [];
                const imagensPorAnimal = {};
                capturas.forEach(captura => {
                    const id = captura.animal?.id;
                    if (!id) return;
                    capturadosIds.push(id);
                    // Se já existe, compara datas e mantém a mais recente
                    if (
                        !imagensPorAnimal[id] ||
                        new Date(captura.data_identificacao) > new Date(imagensPorAnimal[id].data_identificacao)
                    ) {
                        imagensPorAnimal[id] = {
                            imagem: captura.imagem,
                            data_identificacao: captura.data_identificacao
                        };
                    }
                });
                setCapturados(capturadosIds);
                // Salva no state as imagens mais recentes por animal
                setImagensCapturadas(imagensPorAnimal);
            })
            .catch(() => {
                setCapturados([]);
                setImagensCapturadas({});
            });
    }, []);

    // State para imagens das capturas
    const [imagensCapturadas, setImagensCapturadas] = useState({});

    // Filtro e busca
    const animaisFiltrados = animais.filter(animal => {
        const buscaLower = busca.toLowerCase();
        const matchNome = animal.nome_comum?.toLowerCase().includes(buscaLower) || animal.nome_cientifico?.toLowerCase().includes(buscaLower);
        const matchPerigo = filtroPerigo ? String(animal.nivel_perigo) === filtroPerigo : true;
        const matchExtincao = filtroExtincao ? String(animal.nivel_extincao) === filtroExtincao : true;
        return matchNome && matchPerigo && matchExtincao;
    });

    return (
        <div className="body-explorar">
            <div className="top-bar-explorar">
                <Link to="/home-user" className="back-button-explorar">← Voltar</Link>
                <div className="title_reader">Explorar Animais</div>
            </div>

            <div className="explorar-filtros">
                <input
                    type="text"
                    className="input-explorar"
                    placeholder="Buscar por nome comum ou científico..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
                <select
                    className="select-explorar"
                    value={filtroPerigo}
                    onChange={e => setFiltroPerigo(e.target.value)}
                >
                    <option value="">Todos os níveis de perigo</option>
                    <option value="1">Perigo mínimo</option>
                    <option value="2">Pouco perigoso</option>
                    <option value="3">Perigo moderado</option>
                    <option value="4">Perigo alto</option>
                    <option value="5">Perigo extremo</option>
                </select>
                <select
                    className="select-explorar"
                    value={filtroExtincao}
                    onChange={e => setFiltroExtincao(e.target.value)}
                >
                    <option value="">Todos os níveis de extinção</option>
                    <option value="1">Pouco ameaçado</option>
                    <option value="2">Quase ameaçado</option>
                    <option value="3">Vulnerável</option>
                    <option value="4">Em perigo</option>
                    <option value="5">Criticamente em perigo</option>
                </select>
            </div>

            <div className="explorar-grid">
                {animaisFiltrados.length === 0 ? (
                    <div className="nenhum-animal">Nenhum animal encontrado.</div>
                ) : (
                    animaisFiltrados.map((animal, idx) => {
                        const foiCapturado = capturados.includes(animal.id);
                        let urlImagem = '';

                        if (foiCapturado && imagensCapturadas[animal.id]?.imagem) {
                            urlImagem = imagensCapturadas[animal.id].imagem.startsWith('http')
                                ? imagensCapturadas[animal.id].imagem
                                : `http://127.0.0.1:8000${imagensCapturadas[animal.id].imagem}`;
                        }

                        return (
                            <div className="card-animal-explorar" key={idx}>
                                {foiCapturado && urlImagem ? (
                                    <img
                                        src={urlImagem}
                                        alt={animal.nome_comum || 'Animal'}
                                        className="img-animal-explorar"
                                        onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x200?text=Sem+Imagem"; }}
                                    />
                                ) : (
                                    <div className="img-animal-explorar img-animal-oculto">
                                        <span className="interrogacao-animal">?</span>
                                    </div>
                                )}
                                <div className="overlay-explorar">
                                    <h2 className="overlay-title-explorar">{animal.nome_comum}</h2>
                                    <h3 className="overlay-subtitle-explorar">{animal.nome_cientifico}</h3>
                                    <p className="overlay-description-explorar">
                                        {animal.descricao || 'Sem descrição disponível.'}
                                    </p>
                                    <div className="overlay-footer-explorar">
                                        <span className="overlay-tag-explorar">
                                            {getDescricaoPerigo(animal.nivel_perigo)}
                                        </span>
                                        <span className="overlay-tag-explorar">
                                            {getDescricaoExtincao(animal.nivel_extincao)}
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

export default ExplorarCard;