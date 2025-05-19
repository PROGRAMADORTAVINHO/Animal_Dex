import React from 'react';
import { Link } from "react-router-dom";
import './style.css';

const HomeBemVindo = () => {
    return (
        <div className="body-HomeBemvindo">
            <div className="top-bar-HomeBemvindo">
                <div className="logo-HomeBemvindo">
                    <img src={require('../../assets/logo.png')} className='img-HomeBemvindo' alt="Logo" />
                </div>
                <Link to="/login" className='btn-HomeBemvindo'>Login</Link>
            </div>

            <div className="container-HomeBemvindo">
                <div class="card-start-HomeBemvindo">
                    <h1 className='h1-cs-HomeBemvindo'> Bem vindo ao AnimalDex</h1>
                    <p className='p-cs-HomeBemvindo'> Sua jornada pelo mundo animal começa aqui! Explore, aprenda e colecione. </p>
                    <Link to="/login" className='btn-cs-HomeBemvindo'>Começar agora</Link>
                </div>

                <div class="animaldex-items">
                    <div class="items-ai-HomeBemvindo">
                        <p class="icon-ai-HomeBemvindo"> 🔍 </p>
                        <h2 className='h2-ai-HomeBemvindo'> Explore o Reino Animal </h2>
                        <p className='p-ai-HomeBemvindo'>
                            Descubra uma vasta coleção de animais de todas as partes do mundo,
                            com informações detalhadas e curiosidades fascinantes.
                        </p>
                    </div>
                    <div class="items-ai-HomeBemvindo">
                        <p class="icon-ai-HomeBemvindo"> 📚 </p>
                        <h2 className='h2-ai-HomeBemvindo'> Aprenda e Colecione </h2>
                        <p className='p-ai-HomeBemvindo'>
                            Monte sua própria coleção de animais favoritos,
                            acompanhe seu progresso e aprenda mais sobre cada espécie.
                        </p>
                    </div>
                    <div class="items-ai-HomeBemvindo">
                        <p class="icon-ai-HomeBemvindo"> 🌟 </p>
                        <h2 className='h2-ai-HomeBemvindo'> Compartilhe Descobertas </h2>
                        <p className='p-ai-HomeBemvindo'>
                            Faça parte de uma comunidade de entusiastas,
                            compartilhe suas descobertas e interaja com outros exploradores.
                        </p>
                    </div>
                </div>

                <div class="steps-HomeBemvindo">
                    <h1 className='h1-steps-HomeBemvindo'>Como Funciona</h1>
                    <div class="step">
                        <div class="step-icon">1</div>
                        <h3 className='h3-steps-HomeBemvindo'> Crie sua conta </h3>
                        <p className='p-steps-HomeBemvindo'> Registre-se gratuitamente para começar sua jornada </p>
                    </div>
                    <div class="step">
                        <div class="step-icon">2</div>
                        <h3 className='h3-steps-HomeBemvindo'> Explore </h3>
                        <p className='p-steps-HomeBemvindo'> Navegue pela nossa vasta coleção de animais </p>
                    </div>
                    <div class="step">
                        <div class="step-icon">3</div>
                        <h3 className='h3-steps-HomeBemvindo'> Colecione </h3>
                        <p className='p-steps-HomeBemvindo'> Adicione animais à sua coleção pessoal </p>
                    </div>
                    <div class="step">
                        <div class="step-icon">4</div>
                        <h3 className='h3-steps-HomeBemvindo'> Compartilhe </h3>
                        <p className='p-steps-HomeBemvindo'> Interaja com outros usuários e compartilhe descobertas </p>
                    </div>
                </div>

                <div class="start-journey-HomeBemvindo">
                    <h1 className='h1-sj-HomeBemvindo'> Pronto para começar sua aventura? </h1>
                    <p className='p-sj-HomeBemvindo'> Junte-se a milhares de exploradores e comece sua jornada hoje mesmo! </p>
                    <Link to="/registro" className='btn-sj-HomeBemvindo'> Criar Conta Grátis </Link>
                </div>
            </div>
            <div className="espaco-HomeBemvindo"></div>
        </div>
    );
};

export default HomeBemVindo;