import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AnimalDexZerada from './Pages/AnimalDex_zerada';
import AnimalDex from './Pages/AnimalDex';
import Explorar from './Pages/Explorar';
import HomeInicio from './Pages/HomeBemVindo';
import HomeUser from './Pages/HomeUser';
import Login from './Pages/Login';
import Registro from './Pages/Registro';
import Perfil from './Pages/Perfil';
import TestarIA from './components/IdentificarAnimais/IdentificarAnimais';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeInicio />} /> {/* Rota padrão */}
                <Route path="/animaldex-zerada" element={<AnimalDexZerada />} />
                <Route path="/explorar" element={<Explorar />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/registro" element={<Registro />} /> 
                <Route path="/home-user" element={<HomeUser />} /> {/* Home logada */}
                <Route path="/perfil" element={<Perfil />} /> {/* Perfil */}
                <Route path="/animaldex" element={<AnimalDex />} /> {/* Perfil */}
                <Route path="/identificar" element={<TestarIA />} />
            </Routes>
        </Router>
    );

};

export default App;