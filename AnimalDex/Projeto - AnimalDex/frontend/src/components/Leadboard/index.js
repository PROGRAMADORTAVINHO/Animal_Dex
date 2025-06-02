import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

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

const Leadboard = () => {
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadboard = async () => {
      setLoading(true);
      try {
        // Ajuste o endpoint conforme necessário
        const token = localStorage.getItem('token');
        const response = await axios.get('http://192.168.0.106:8000/api/leadboard/', {
          headers: { Authorization: `Token ${token}` }
        });
        setJogadores(response.data.results || response.data);
      } catch {
        setJogadores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadboard();
  }, []);

  return (
    <div className="leadboard-container">
      <h2 className="leadboard-title">Ranking dos Jogadores</h2>
      {loading ? (
        <div className="leadboard-loading">Carregando...</div>
      ) : (
        <div className="leadboard-list">
          {jogadores.map((item, idx) => (
            <div className="leadboard-card" key={idx}>
              <div className="leadboard-rank">{idx + 1}º</div>
              <div className="leadboard-info">
                <div className="leadboard-username">{item.username}</div>
                <div className="leadboard-level">Nível: <b>{item.nivel}</b></div>
                <div className="leadboard-capturas">Animais capturados: <b>{item.animais_descobertos}</b></div>
                <div className="leadboard-rare">
                  Mais raro: <b>{item.animal_mais_raro?.nome_comum || '-'}</b>
                  {item.animal_mais_raro?.nivel_extincao && (
                    <span className="leadboard-rarity-tag">
                      {' '}({getDescricaoExtincao(item.animal_mais_raro.nivel_extincao)})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leadboard;