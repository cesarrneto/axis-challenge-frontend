import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/styles.css";
import api from "../../services/api";

const CooperativaFormPage = () => {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/cooperativa", { nome });
      navigate("/listacooperativa");
    } catch (error) {
      console.error("Erro ao criar cooperativa", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Criar Nova Cooperativa</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <button type="submit">Criar</button>
      </form>
    </div>
  );
};

export default CooperativaFormPage;
