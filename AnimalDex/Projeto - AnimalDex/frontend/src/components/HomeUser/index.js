import React, { useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import './style.css';

const HomeUser_logada = () => {
    const explorarRef = useRef(null);
    const modalRef = useRef(null);

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

            <div id="explorarModal" class="modal" ref={modalRef}>
                <div class="modal-content">
                    <h2 class='h2-modal'>Explorar Animais</h2>
                    <div class="busca-btn">
                        <input type="text" class="intut-modal" placeholder="Digite o nome do animal..." />
                        <Link to="/explorar" class="btn-modal">Buscar</Link>
                    </div>
                </div>
            </div>

            <div class="body-Home-User">
                <div className="espaco-HomeUser"></div>
                <div class="container-HomeUser">
                    <div class="cardUser">
                        <h1 class="h1-cardUser">Bem-vindo de volta, j!</h1>
                        <p class="p-cardUser">Continue sua jornada de descobertas no mundo animal.</p>
                    </div>

                    <div class="statusUser">
                        <div class="descobertas">
                            <div class="icon-descobertas"> 🌟 </div>
                            <div class="content-descobertas">
                                <h3 class="h3-content-descobertas"> 0 </h3>
                                <p class="p-h3-content-descobertas"> Animais Descobertos </p>
                            </div>
                        </div>
                        <div class="level">
                            <div class="icon-level"> 🏆 </div>
                            <h3 class="h3-level"> Iniciante </h3>
                            <p class="p-level"> Seu nivel </p>
                        </div>
                    </div>

                    <div class="explorar-capturar">
                        <div class="explorar" ref={explorarRef}>
                            <h2 class='h2-explorar-capturar'> Explorar Animal </h2>
                            <p class='p-explorar-capturar'> Descubra novos animais e aprenda mais sobre eles </p>
                        </div>
                        <div class="capturar">
                            <h2 class='h2-explorar-capturar'> Capturar Animal </h2>
                            <p class='p-explorar-capturar'> Encontre e capture novos animais para sua coleção </p>
                        </div>
                    </div>

                    <div class="sesao2">
                        <div class="extincao">
                            <h2 class="h2-extincao"> Espécies em Risco </h2>
                            <div class="animal-extincao">
                                <div class="icon-animal">
                                    <div class="icon-extincao">
                                        🐆
                                    </div>
                                    <div class="animal-extincao-content">
                                        <h3 class="h3-secao2">Onça-pintada</h3>
                                        <p class="p-secao2"> Vulnerável </p>
                                    </div>
                                </div>
                                <div class="quantidade-extincao">
                                    Restam apenas 173.000 na natureza
                                </div>
                            </div>

                            <div class="animal-extincao">
                                <div class="icon-animal">
                                    <div class="icon-extincao">
                                        🦜
                                    </div>
                                    <div class="animal-extincao-content">
                                        <h3 class="h3-secao2"> Arara-azul </h3>
                                        <p class="p-secao2"> Em perigo </p>
                                    </div>
                                </div>
                                <div class="quantidade-extincao">
                                    Restam apenas 6.500 na natureza
                                </div>
                            </div>

                            <div class="animal-extincao">
                                <div class="icon-animal">
                                    <div class="icon-extincao">
                                        🐋
                                    </div>
                                    <div class="animal-extincao-content">
                                        <h3 class="h3-secao2"> Peixe-boi </h3>
                                        <p class="p-secao2"> Criticamente em perigo </p>
                                    </div>
                                </div>
                                <div class="quantidade-extincao">
                                    Restam apenas 2.500 na natureza
                                </div>
                            </div>
                        </div>

                        <div class="evento-natureza">
                            <h2 class="h2-evento-natureza"> Evento da Natureza </h2>
                            <div class="evento">
                                <div class="icon-evento-natureza">
                                    <div class="icon-evento">
                                        🐋
                                    </div>
                                    <div class="content-evento">
                                        <h3 class="h3-secao2"> Migração das baleias jubarte </h3>
                                        <p class="p-secao2"> Junho a Novembro </p>
                                    </div>
                                </div>
                            </div>
                            <div class="evento">
                                <div class="icon-evento-natureza">
                                    <div class="icon-evento">
                                        🐢
                                    </div>
                                    <div class="content-evento">
                                        <h3 class="h3-secao2"> Desovas das tartagugas </h3>
                                        <p class="p-secao2"> Setembro a Março </p>
                                    </div>
                                </div>
                            </div>
                            <div class="evento">
                                <div class="icon-evento-natureza">
                                    <div class="icon-evento">
                                        🦩
                                    </div>
                                    <div class="content-evento">
                                        <h3 class="h3-secao2"> Reprodução dos flamingos </h3>
                                        <p class="p-secao2"> Agosto a Outubro </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sesao3">
                        <div class="habitat-da-semana">
                            <h2 class="h2-habitat-da-semana"> Habitat da Semana </h2>
                            <div class="img-CuriosityDay">
                                <img src={require('../../assets/pantanal.jpg')} class="foto-animal" />
                            </div>
                            <h3 class="h3-habitat"> Pantanal </h3>
                            <p class="p-habitat-da-semana"> Maior planicie alagada do mundo </p>
                            <h3 class="h3-habitat-especie"> Espécies tipicas: </h3>
                            <ul class="ul-habitat-da-semana">
                                <li class="li-habitat-da-semana"> Onça-pintada </li>
                                <li class="li-habitat-da-semana"> Arara-azul </li>
                                <li class="li-habitat-da-semana"> Jacaré </li>
                            </ul>
                        </div>

                        <div class="CuriosityDay">
                            <h2 class="h2-CuriosityDay">Curiosidade do Dia</h2>
                            <div class="img-CuriosityDay">
                                <img src={require('../../assets/tiger.jpg')} class="foto-animal" />
                            </div>
                            <h3 class="title-Curiosity"> Tigre Nadador </h3>
                            <p class="content-CuriosityDay">
                                Sabia que os tigres são excelentes<br />
                                nadadores e adoram água? Eles podem<br />
                                nadar por até 6km!
                            </p>
                        </div>
                    </div>

                    <div class="RecentActivities">
                        <h3>Capturas Recentes</h3>
                        <div class="Activities">
                            <div class="CapturedAnimal">
                                <img src={require('../../assets/capivara.jpg')} class="ImgAnimal" />
                            </div>
                            <div class="content-RecentActivities">
                                <h3 class="h3-RecentActivities">Capivara</h3>
                                <p class="p-RecentActivities">Hydrochoerus hydrochaeris</p>
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