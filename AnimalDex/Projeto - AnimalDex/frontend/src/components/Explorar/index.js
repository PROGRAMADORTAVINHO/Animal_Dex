import React from 'react';
import { Link } from "react-router-dom";
import './style.css';

const ExplorarCard = () => {
    return (
        <div className="body-explorar">
            <div class="top-bar-explorar">
                <Link to="/home-user" class="back-button">← Voltar</Link>
                <div class="title_reader">Minha Coleção</div>
            </div>

            <div className="card-explorar">
                <img 
                    src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=2072&auto=format&fit=crop"
                    className="img-explorar"
                />
                <h1 className='h1-explorar'> Raposa Vermelha </h1>
                <div className="scientific_name"> Vulpes vulpes </div>
                <h2 className='h2-explorar'> Descrição </h2>
                <p className='p-explorar'>
                    A raposa vermelha é um mamífero carnívoro da família Canidae,
                    encontrado em diversos habitats por todo o hemisfério norte.
                    Conhecida por sua pelagem característica vermelho-alaranjada,
                    cauda espessa e focinho pontiagudo, é um dos animais mais
                    adaptáveis e versáteis do planeta. São excelentes caçadoras,
                    principalmente ativas durante o crepúsculo e à noite,
                    alimentando-se de pequenos roedores, aves, insetos e frutas.
                </p>
            </div>
        </div>
    );
};

export default ExplorarCard;