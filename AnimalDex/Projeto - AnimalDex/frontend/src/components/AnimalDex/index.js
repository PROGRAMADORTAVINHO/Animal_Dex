import React from 'react';
import { Link } from "react-router-dom";
import './style.css';

const AnimalDex = () => {
    return (
        <>
            <div class="body_minhacolecao">
                <div class="top-bar-minha-colecao">
                <Link to="/home-user" class="back-button">← Voltar</Link>
                    <div class="title_reader">Minha Coleção</div>
                </div>

                <div class="conteiner-minhacolecao">
                    <div class="card-animal">
                        <img src={require('../../assets/raposa.jpg')} alt="Raposa" />
                        <div class="overlay">
                            <h2 class="overlay-title">Raposa</h2>
                            <h3 class="overlay-subtitle">Vulpes vulpes</h3>
                            <p class="overlay-description">Um animal astuto e adaptável, comum em diversas regiões.</p>
                            <div class="overlay-footer">
                                <span class="overlay-tag">Floresta</span>
                                <span class="overlay-date">10/05/2025</span>
                            </div>
                            <button class="overlay-button">Saiba mais</button>
                        </div>
                    </div>
                    <div class="card-animal">
                        <img src={require('../../assets/Cabra.jpg')} alt="Cabra" />
                        <div class="overlay">
                            <h2 class="overlay-title">Cabra</h2>
                            <h3 class="overlay-subtitle">Capra hircus</h3>
                            <p class="overlay-description">Um mamífero conhecido por sua agilidade em terrenos montanhosos.</p>
                            <div class="overlay-footer">
                                <span class="overlay-tag">Montanha</span>
                                <span class="overlay-date">10/05/2025</span>
                            </div>
                            <button class="overlay-button">Saiba mais</button>
                        </div>
                    </div>
                    <div class="card-animal">
                        <img src={require('../../assets/Lobo.jpg')}  alt="Lobo" />
                        <div class="overlay">
                            <h2 class="overlay-title">Lobo</h2>
                            <h3 class="overlay-subtitle">Canis lupus</h3>
                            <p class="overlay-description">Um predador social que vive em matilhas.</p>
                            <div class="overlay-footer">
                                <span class="overlay-tag">Floresta</span>
                                <span class="overlay-date">10/05/2025</span>
                            </div>
                            <button class="overlay-button">Saiba mais</button>
                        </div>
                    </div>
                    <div class="card-animal">
                        <img src="https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?q=80&w=1000&auto=format&fit=crop" alt="Onça" />
                        <div class="overlay">
                            <h2 class="overlay-title">Onça-pintada</h2>
                            <h3 class="overlay-subtitle">Panthera onca</h3>
                            <p class="overlay-description">O maior felino das Américas e um dos predadores mais poderosos da floresta.</p>
                            <div class="overlay-footer">
                                <span class="overlay-tag">Amazônia</span>
                                <span class="overlay-date">19/01/2024</span>
                            </div>
                            <button class="overlay-button">Saiba mais</button>
                        </div>
                    </div>
                    <div class="card-animal">
                        <img src={require('../../assets/Furao.jpg')} alt="Furão" />
                        <div class="overlay">
                            <h2 class="overlay-title">Furão</h2>
                            <h3 class="overlay-subtitle">Mustela putorius</h3>
                            <p class="overlay-description">Um pequeno mamífero conhecido por sua curiosidade.</p>
                            <div class="overlay-footer">
                                <span class="overlay-tag">Campos</span>
                                <span class="overlay-date">10/05/2025</span>
                            </div>
                            <button class="overlay-button">Saiba mais</button>
                        </div>
                    </div>
                    <div class="card-animal">
                        <img src="https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=80&w=1000&auto=format&fit=crop" alt="Papagaio" />
                        <div class="overlay">
                            <h2 class="overlay-title">Papagaio</h2>
                            <h3 class="overlay-subtitle">Psittacidae</h3>
                            <p class="overlay-description">Uma ave colorida conhecida por sua inteligência.</p>
                            <div class="overlay-footer">
                                <span class="overlay-tag">Floresta</span>
                                <span class="overlay-date">10/05/2025</span>
                            </div>
                            <button class="overlay-button">Saiba mais</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default AnimalDex;