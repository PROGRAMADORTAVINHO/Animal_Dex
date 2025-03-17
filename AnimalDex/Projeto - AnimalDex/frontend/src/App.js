import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Registro from './registro';
import Perfil from './perfil';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/" element={<Login />} /> {/* Rota padrão */}
            </Routes>
        </Router>
    );
};

export default App;