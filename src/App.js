import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CooperativasListPage from "./pages/Cooperativa/CooperativaListPage";
import CooperadosListPage from "./pages/Cooperado/CooperadoListPage";
import CooperativaFormPage from "./pages/Cooperativa/CooperativaFormPage";
import CooperadoFormPage from "./pages/Cooperado/CooperadoFormPage";
import CooperadoEditPage from "./pages/Cooperado/CooperadoEditPage";
import ContatoFavoritoFormPage from "./pages/ContatoFavorito/ContatoFavoritoFormPage";
import ContatoFavoritoListPage from "./pages/ContatoFavorito/ContatoFavoritoListPage";
import ContatoFavoritoEditPage from "./pages/ContatoFavorito/ContatoFavoritoEditPage";
import CooperativaEditPage from "./pages/Cooperativa/CooperativaEditPage"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          <Route path="listacooperado" element={<CooperadosListPage />} />
          <Route path="novocooperado" element={<CooperadoFormPage />} />
          <Route path="editarcooperado/edit/:id" element={<CooperadoEditPage />} />

          

          <Route path="listacooperativa" element={<CooperativasListPage />} />
          <Route path="novacooperativa" element={<CooperativaFormPage />} />
          <Route path="editarcooperativa/edit/:id" element={<CooperativaEditPage />} />

          <Route path="editarcontatofavorito/edit/:id" element={<ContatoFavoritoEditPage/>} />
          <Route path="listacontatofavorito" element={<ContatoFavoritoListPage />} />
          <Route path="novocontatofavorito" element={<ContatoFavoritoFormPage />} />
          
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
