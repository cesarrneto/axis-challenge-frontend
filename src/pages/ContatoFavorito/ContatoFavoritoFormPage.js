import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, message, Card } from "antd";
import api from "../../services/api";
import "../../styles/styles.css";

const { Option } = Select;

const ContatoFavoritoFormPage = () => {
  const [cooperados, setCooperados] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCooperados = async () => {
      try {
        const response = await api.get("/cooperado");
        setCooperados(response.data);
      } catch (error) {
        message.error("Erro ao carregar cooperados.");
      }
    };
    fetchCooperados();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const { nome, tipoChavePix, chavePix, cooperadoId } = values;
      if (!cooperadoId) {
        message.warning("Selecione um cooperado.");
        return;
      }

      await api.post("/contatofavorito", {
        nome,
        tipoChavePix,
        chavePix,
        cooperadoId: Number(cooperadoId),
      });

      message.success("Contato adicionado com sucesso!");
      navigate("/listacontatofavorito");
    } catch (error) {
      message.error("Erro ao adicionar contato.");
      console.error("Erro ao adicionar contato", error);
    }
  };

  return (
    <Card title="Adicionar Contato Favorito" style={{ maxWidth: 500, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Digite o nome completo!" }]}>
          <Input placeholder="Nome completo" />
        </Form.Item>

        <Form.Item label="Tipo de Chave Pix" name="tipoChavePix" initialValue="CPF" rules={[{ required: true }]}>
          <Select>
            <Option value="CPF">CPF</Option>
            <Option value="CNPJ">CNPJ</Option>
            <Option value="E-mail">E-mail</Option>
            <Option value="Telefone">Telefone</Option>
            <Option value="Aleatória">Aleatória</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Chave Pix" name="chavePix" rules={[{ required: true, message: "Digite a chave Pix!" }]}>
          <Input placeholder="Digite a chave Pix" />
        </Form.Item>

        <Form.Item label="Cooperado" name="cooperadoId" rules={[{ required: true, message: "Selecione um cooperado!" }]}>
          <Select placeholder="Selecione um cooperado">
            {cooperados.map((cooperado) => (
              <Option key={cooperado.id} value={cooperado.id}>
                {cooperado.nome}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }} block>
            Adicionar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ContatoFavoritoFormPage;
