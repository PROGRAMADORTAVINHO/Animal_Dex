import React from 'react';
import { Link } from "react-router-dom";
import './style.css';

const AnimalDexZerada = () => {

    return (
        <div className="body-animaldex-zerada">
            <div class="top-bar">
                <Link to="/" className="back-button">← Voltar</Link>
                <h1 className='h1-animaldex-zerada'>Minha Coleção</h1>
            </div>

            <div class="card-animaldex-zerada">
                <div class="icon-animaldex-zerada"> 🔍 </div>
                <h2 className='h2-animaldex-zerada'>Nenhum animal descoberto ainda</h2>
                <p className='p.-animaldex-zerada'>Comece sua jornada explorando novos animais!</p>
            </div>
        </div>
    );
};
export default AnimalDexZerada;