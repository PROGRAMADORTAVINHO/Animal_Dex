import React, { useState } from 'react';
import './style.css';

const TestarIA = () => {
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setFoto(file);
            setFotoPreview(URL.createObjectURL(file));
            setResultado(null);
            setErro(null);
        } else {
            setErro('Por favor, selecione um arquivo de imagem válido.');
            setFoto(null);
            setFotoPreview(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!foto) {
            setErro('Por favor, selecione uma imagem.');
            return;
        }

        const formData = new FormData();
        formData.append('foto', foto);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/identificar/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setResultado(data);
                setErro(null);
            } else {
                setErro(data.error || 'Erro ao identificar o animal.');
                setResultado(null);
            }
        } catch (error) {
            setErro('Erro ao enviar a imagem.');
            setResultado(null);
        }
    };

    const getDescricaoPerigo = (nivel) => {
        switch (nivel) {
            case 1: return "Perigo mínimo";
            case 2: return "Pouco perigoso";
            case 3: return "Perigo moderado";
            case 4: return "Perigo alto";
            case 5: return "Perigo extremo";
            default: return "Nível desconhecido";
        }
    };

    const getDescricaoExtincao = (nivel) => {
        switch (nivel) {
            case 1: return "Pouco ameaçado";
            case 2: return "Quase ameaçado";
            case 3: return "Vulnerável";
            case 4: return "Em perigo";
            case 5: return "Criticamente em perigo";
            default: return "Nível desconhecido";
        }
    };

    return (
        <div className="body-Home-User">
            <div className="espaco-HomeUser"></div>
            <div className="container-HomeUser">
                {/* Card de Upload */}
                <div className="card-ia">
                    <h1 className="h1-cardUser">Identificar Animal</h1>
                    <p className="p-cardUser">Envie uma foto para descobrir informações sobre o animal.</p>
                    
                    <form onSubmit={handleSubmit} className="form-ia">
                        <label htmlFor="foto" className="label-ia">
                            <span className="btn-ia">Selecionar Imagem</span>
                            <input
                                type="file"
                                id="foto"
                                name="foto"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="input-ia"
                            />
                        </label>
                        <button type="submit" className="btn-ia-enviar">Enviar</button>
                    </form>

                    {erro && <p className="error-ia">{erro}</p>}
                </div>

                {/* Card de Pré-visualização */}
                {fotoPreview && (
                    <div className="card-ia">
                        <h2 className="h2-modal">Pré-visualização</h2>
                        <img
                            src={fotoPreview}
                            alt="Pré-visualização"
                            className="preview-ia"
                        />
                    </div>
                )}

                {/* Card de Resultado */}
                {resultado && (
                    <div className="card-ia resultado-ia">
                        <h2 className="h2-modal">Resultado</h2>
                        <div className="animal-extincao">
                            <div className="icon-animal">
                                <img
                                    src={resultado.foto_url}
                                    alt={resultado.nome_comum}
                                    className="icon-extincao"
                                />
                            </div>
                            <div className="animal-extincao-content">
                                <h3 className="h3-secao2">{resultado.nome_comum}</h3>
                                <p className="p-secao2">{resultado.nome_cientifico}</p>
                            </div>
                        </div>

                        <div className="info-ia">
                            <p><strong>Nível de Perigo:</strong> {getDescricaoPerigo(Number(resultado.nivel_perigo))}</p>
                            <p><strong>Nível de Extinção:</strong> {getDescricaoExtincao(Number(resultado.nivel_extincao))}</p>
                            <p><strong>Descrição:</strong> {resultado.descricao}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="espaco-HomeUser"></div>
        </div>
    );
};

export default TestarIA;