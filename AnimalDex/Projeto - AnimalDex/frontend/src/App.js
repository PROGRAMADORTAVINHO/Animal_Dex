import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AnimalDexZerada from './Pages/AnimalDex_zerada';
import Explorar from './Pages/Explorar';
import HomeInicio from './Pages/HomeBemVindo';
import HomeUser from './Pages/HomeUser';
import Login from './Pages/Login';
import Registro from './Pages/Registro';
import PerfilTeste from './Pages/Teste_perfil';


import Perfil from './perfil';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeInicio />} /> {/* Rota padrão */}
                <Route path="/animaldex-zerada" element={<AnimalDexZerada />} />
                <Route path="/explorar" element={<Explorar />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/registro" element={<Registro />} />
                <Route path="/teste" element={<PerfilTeste />} />  {/* trocar senha e e-mail */}
                <Route path="/home-user" element={<HomeUser />} /> {/* Home logada */}
                <Route path="/perfil" element={<Perfil />} /> {/* Home logada */}
                {/* <Route path="/home-user" element={<HomeUser />} /> */}
            </Routes>
        </Router>
    );
};

export default App;