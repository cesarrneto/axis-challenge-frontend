import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/styles.css";
import api from "../../services/api";

const CooperativaEditPage = () => {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCooperativa = async () => {
      try {
        const response = await api.get(`/cooperativa/${id}`);
        setNome(response.data.nome);
      } catch (error) {
        console.error("Erro ao buscar cooperativa", error);
      }
    };

    fetchCooperativa();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cooperativa = {
      id,  
      nome
    };
  
    try {
      await api.put(`/cooperativa/${id}`, cooperativa);
      navigate("/listacooperativa");
    } catch (error) {
      console.error("Erro ao atualizar cooperativa", error);
    }
  };
  return (
    <div className="form-container">
      <h2>Editar Cooperativa</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default CooperativaEditPage;
