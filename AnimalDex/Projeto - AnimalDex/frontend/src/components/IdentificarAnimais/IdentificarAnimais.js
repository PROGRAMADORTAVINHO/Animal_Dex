import React, { useState } from 'react';
import './style.css';

const TestarIA = () => {
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null); // Estado para a URL da imagem local
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setFoto(file);
            setFotoPreview(URL.createObjectURL(file)); // Gerar URL temporária para a imagem
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
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/identificar-animal/', {
                method: 'POST',
                body: formData,
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

    return (
        <div className="testar-ia-container">
            <h1>Teste sua IA de Identificação de Animais</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="foto">Envie uma imagem:</label>
                <input
                    type="file"
                    id="foto"
                    name="foto"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button type="submit">Enviar</button>
            </form>

            {fotoPreview && (
                <div className="preview">
                    <h2>Pré-visualização da Imagem:</h2>
                    <img
                        src={fotoPreview}
                        alt="Pré-visualização"
                        className="preview-imagem"
                    />
                </div>
            )}

            {erro && <p className="error">{erro}</p>}

            {resultado && (
                <div className="resultado">
                    <h2>Resultado:</h2>
                    <p><strong>Nome:</strong> {resultado.nome}</p>
                    <p><strong>Espécie:</strong> {resultado.especie}</p>
                    <p><strong>Nível de Perigo:</strong> {resultado.nivel_perigo}</p>
                    <p><strong>Nível de Extinção:</strong> {resultado.nivel_extincao}</p>
                    <p><strong>Descrição:</strong> {resultado.descricao}</p>
                    <img
                        src={resultado.foto_url}
                        alt="Imagem enviada"
                        className="resultado-imagem"
                    />
                </div>
            )}
        </div>
    );
};

export default TestarIA;