import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const HomeUser_logada = () => {
    const explorarRef = useRef(null);
    const modalRef = useRef(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Lógica para buscar dados do usuário
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
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
                            {user && user.first_name
                                ? `Bem-vindo de volta, ${user.first_name}!`
                                : 'Carregando...'}
                        </h1>
                        <p className="p-cardUser">Continue sua jornada de descobertas no mundo animal.</p>
                        {error && <p className="error">{error}</p>}
                    </div>

                    <div className="statusUser">
                        <div className="descobertas">
                            <div className="icon-descobertas"> 🌟 </div>
                            <div className="content-descobertas">
                                <h3 className="h3-content-descobertas"> 0 </h3>
                                <p className="p-h3-content-descobertas"> Animais Descobertos </p>
                            </div>
                        </div>
                        <div className="level">
                            <div className="icon-level"> 🏆 </div>
                            <h3 className="h3-level"> Iniciante </h3>
                            <p className="p-level"> Seu nível </p>
                        </div>
                    </div>

                    <div className="explorar-capturar">
                        <div className="explorar" ref={explorarRef}>
                            <h2 className="h2-explorar-capturar"> Explorar Animal </h2>
                            <p className="p-explorar-capturar"> Descubra novos animais e aprenda mais sobre eles </p>
                        </div>
                        <div className="capturar">
                            <h2 className="h2-explorar-capturar"> Capturar Animal </h2>
                            <p className="p-explorar-capturar"> Encontre e capture novos animais para sua coleção </p>
                        </div>
                    </div>

                    <div className="sesao2">
                        <div className="extincao">
                            <h2 className="h2-extincao"> Espécies em Risco </h2>
                            <div className="animal-extincao">
                                <div className="icon-animal">
                                    <div className="icon-extincao">🐆</div>
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
                                    <div className="icon-extincao">🦜</div>
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
                                    <div className="icon-extincao">🐋</div>
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
                        <h3>Capturas Recentes</h3>
                        <div className="Activities">
                            <div className="CapturedAnimal">
                                <img src={require('../../assets/capivara.jpg')} className="ImgAnimal" />
                            </div>
                            <div className="content-RecentActivities">
                                <h3 className="h3-RecentActivities">Capivara</h3>
                                <p className="p-RecentActivities">Hydrochoerus hydrochaeris</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="espaco-HomeUser"></div>
            </div>
        </>
    );
};

export default HomeUser_logada;