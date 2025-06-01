import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const HomeUser_logada = () => {
    const explorarRef = useRef(null);
    const modalRef = useRef(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [ultimasCapturas, setUltimasCapturas] = useState([]);
    const navigate = useNavigate();

    // Buscar dados do usuário
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            axios
                .get('http://127.0.0.1:8000/api/perfil/', {
                    headers: { Authorization: `Token ${token}` },
                })
                .then(response => setUser(response.data))
                .catch(() => {
                    setError('Erro ao carregar perfil');
                    setUser(null);
                });
        }
    }, [navigate]);

    // Buscar últimas capturas
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        axios
            .get('http://127.0.0.1:8000/api/perfil/identificacoes/?page_size=3', {
                headers: { Authorization: `Token ${token}` },
            })
            .then(response => setUltimasCapturas(response.data.results || response.data))
            .catch(() => setUltimasCapturas([]));
    }, []);

    // Lógica do modal
    useEffect(() => {
        const explorarDiv = explorarRef.current;
        const modal = modalRef.current;

        if (!explorarDiv || !modal) return;

        const openModal = () => {
            modal.style.display = 'flex';
        };

        const closeModal = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        explorarDiv.addEventListener('click', openModal);
        window.addEventListener('click', closeModal);

        return () => {
            explorarDiv.removeEventListener('click', openModal);
            window.removeEventListener('click', closeModal);
        };
    }, []);

    const getTituloNivel = (nivel) => {
        if (nivel >= 20) return "Pesquisador";
        if (nivel > 10) return "Colecionador";
        if (nivel > 5) return "Aventureiro";
        return "Iniciante";
    };

    return (
        <>
            <div id="explorarModal" className="modal" ref={modalRef}>
                <div className="modal-content">
                    <h2 className="h2-modal">Explorar Animais</h2>
                    <div className="busca-btn">
                        <input type="text" className="intut-modal" placeholder="Digite o nome do animal..." />
                        <Link to="/explorar" className="btn-modal">Buscar</Link>
                    </div>
                </div>
            </div>

            <div className="body-Home-User">
                <div className="espaco-HomeUser"></div>
                <div className="container-HomeUser">
                    <div className="cardUser">
                        <h1 className="h1-cardUser">
                            {error
                                ? 'Erro ao carregar perfil'
                                : user && user.username
                                    ? `Bem-vindo de volta, ${user.username}!`
                                    : 'Carregando...'}
                        </h1>
                        <p className="p-cardUser">Continue sua jornada de descobertas no mundo animal.</p>
                        {error && <p className="error">{error}</p>}
                    </div>

                    {/* NOVO CARD DE LINK PARA MINHA COLEÇÃO */}
                    <Link to="/animaldex" className="cardMinhaColecao">
                        <div className="icon-minha-colecao">📚</div>
                        <div>
                            <h3 className="h3-minha-colecao">Minha Coleção</h3>
                            <p className="p-minha-colecao">Veja todos os animais que você já identificou!</p>
                        </div>
                    </Link>

                    <div className="statusUser">
                        <div className="descobertas">
                            <div className="icon-descobertas"> 🌟 </div>
                            <div className="content-descobertas">
                                <h3 className="h3-content-descobertas">
                                    {user && user.animais_descobertos !== undefined
                                        ? user.animais_descobertos
                                        : 0}
                                </h3>
                                <p className="p-h3-content-descobertas"> Animais Descobertos </p>
                            </div>
                        </div>
                        <div className="level">
                            <div className="icon-level"> 🏆 </div>
                            <p className="p-level" style={{ marginTop: 10, marginBottom: 5 }}>
                                {getTituloNivel(Number(user && (user.nivel || user.nivel_atual) || 0))}
                            </p>
                            <h3 className="h3-level" style={{ margin: 0 }}>
                                {user && (user.nivel || user.nivel_atual) ? (user.nivel || user.nivel_atual) : '0'}
                            </h3>
                            <div className="xp-bar-container">
                                <div
                                    className="xp-bar"
                                    style={{
                                        width: user && user.xp !== undefined && user.xp_para_proximo_nivel
                                            ? `${Math.max(8, Math.min(100, Math.round((user.xp / user.xp_para_proximo_nivel) * 100)))}%`
                                            : '8%',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span className="xp-bar-text">
                                        XP: {user && user.xp ? user.xp : 0}
                                        {user && user.xp_para_proximo_nivel ? ` / ${user.xp_para_proximo_nivel}` : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="explorar-capturar">
                        <Link to="/explorar" className="explorar" style={{ textDecoration: 'none' }}>
                            <h2 className="h2-explorar-capturar"> Explorar Animal </h2>
                            <p className="p-explorar-capturar"> Descubra novos animais e aprenda mais sobre eles </p>
                        </Link>
                        <Link to="/identificar" className="capturar-link" style={{ textDecoration: 'none' }}>
                            <div className="capturar">
                                <h2 className="h2-explorar-capturar"> Capturar Animal </h2>
                                <p className="p-explorar-capturar"> Encontre e capture novos animais para sua coleção </p>
                            </div>
                        </Link>
                    </div>

                    <div className="sesao2">
                        <div className="extincao">
                            <h2 className="h2-extincao"> Espécies em Risco </h2>
                            <div className="animal-extincao">
                                <div className="icon-animal">
                                    <img src={require('../../assets/onca_pintada.jpg')} className="icon-extincao" alt="Onça-pintada" />
                                    <div className="animal-extincao-content">
                                        <h3 className="h3-secao2">Onça-pintada</h3>
                                        <p className="p-secao2"> Vulnerável </p>
                                    </div>
                                </div>
                                <div className="quantidade-extincao">
                                    Restam apenas 173.000 na natureza
                                </div>
                            </div>

                            <div className="animal-extincao">
                                <div className="icon-animal">
                                    <img src={require('../../assets/arara_azul.jpg')} className="icon-extincao" alt="Arara-azul" />
                                    <div className="animal-extincao-content">
                                        <h3 className="h3-secao2"> Arara-azul </h3>
                                        <p className="p-secao2"> Em perigo </p>
                                    </div>
                                </div>
                                <div className="quantidade-extincao">
                                    Restam apenas 6.500 na natureza
                                </div>
                            </div>

                            <div className="animal-extincao">
                                <div className="icon-animal">
                                    <img src={require('../../assets/peixe_boi.webp')} className="icon-extincao" alt="Peixe-boi" />
                                    <div className="animal-extincao-content">
                                        <h3 className="h3-secao2"> Peixe-boi </h3>
                                        <p className="p-secao2"> Criticamente em perigo </p>
                                    </div>
                                </div>
                                <div className="quantidade-extincao">
                                    Restam apenas 2.500 na natureza
                                </div>
                            </div>
                        </div>

                        <div className="evento-natureza">
                            <h2 className="h2-evento-natureza"> Evento da Natureza </h2>
                            <div className="evento">
                                <div className="icon-evento-natureza">
                                    <div className="icon-evento">🐋</div>
                                    <div className="content-evento">
                                        <h3 className="h3-secao2"> Migração das baleias jubarte </h3>
                                        <p className="p-secao2"> Junho a Novembro </p>
                                    </div>
                                </div>
                            </div>
                            <div className="evento">
                                <div className="icon-evento-natureza">
                                    <div className="icon-evento">🐢</div>
                                    <div className="content-evento">
                                        <h3 className="h3-secao2"> Desovas das tartarugas </h3>
                                        <p className="p-secao2"> Setembro a Março </p>
                                    </div>
                                </div>
                            </div>
                            <div className="evento">
                                <div className="icon-evento-natureza">
                                    <div className="icon-evento">🦩</div>
                                    <div className="content-evento">
                                        <h3 className="h3-secao2"> Reprodução dos flamingos </h3>
                                        <p className="p-secao2"> Agosto a Outubro </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sesao3">
                        <div className="habitat-da-semana">
                            <h2 className="h2-habitat-da-semana"> Habitat da Semana </h2>
                            <div className="img-CuriosityDay">
                                <img src={require('../../assets/pantanal.jpg')} className="foto-animal" />
                            </div>
                            <h3 className="h3-habitat"> Pantanal </h3>
                            <p className="p-habitat-da-semana"> Maior planície alagada do mundo </p>
                            <h3 className="h3-habitat-especie"> Espécies típicas: </h3>
                            <ul className="ul-habitat-da-semana">
                                <li className="li-habitat-da-semana"> Onça-pintada </li>
                                <li className="li-habitat-da-semana"> Arara-azul </li>
                                <li className="li-habitat-da-semana"> Jacaré </li>
                            </ul>
                        </div>

                        <div className="CuriosityDay">
                            <h2 className="h2-CuriosityDay">Curiosidade do Dia</h2>
                            <div className="img-CuriosityDay">
                                <img src={require('../../assets/tiger.jpg')} className="foto-animal" />
                            </div>
                            <h3 className="title-Curiosity"> Tigre Nadador </h3>
                            <p className="content-CuriosityDay">
                                Sabia que os tigres são excelentes<br />
                                nadadores e adoram água? Eles podem<br />
                                nadar por até 6km!
                            </p>
                        </div>
                    </div>

                    <div className="RecentActivities">
                        <h3>Últimos Animais Identificados</h3>
                        <div className="Activities">
                            {ultimasCapturas.length === 0 ? (
                                <p className="p-RecentActivities">Você ainda não identificou nenhum animal.</p>
                            ) : (
                                ultimasCapturas.slice(0, 3).map((captura, idx) => (
                                    <div className="CapturedAnimal" key={idx}>
                                        <img
                                            src={
                                                captura.imagem
                                                    ? (captura.imagem.startsWith('http')
                                                        ? captura.imagem
                                                        : `http://127.0.0.1:8000${captura.imagem}`)
                                                    : "https://via.placeholder.com/100"
                                            }
                                            className="ImgAnimal"
                                            alt={captura.animal?.nome_comum || 'Animal'}
                                        />
                                        <div className="content-RecentActivities">
                                            <h3 className="h3-RecentActivities">{captura.animal?.nome_comum}</h3>
                                            <p className="p-RecentActivities">{captura.animal?.nome_cientifico}</p>
                                            <p className="p-RecentActivities">
                                                {captura.data_identificacao}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="espaco-HomeUser"></div>
            </div>
        </>
    );
};

export default HomeUser_logada;