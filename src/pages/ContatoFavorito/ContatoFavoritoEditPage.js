import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Button, message, Card } from "antd";
import api from "../../services/api";
import "../../styles/styles.css";

const { Option } = Select;

const ContatoFavoritoEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cooperados, setCooperados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchContatoFavorito = async () => {
      try {
        const response = await api.get(`/contatofavorito/${id}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error("Erro ao buscar contato favorito.");
      }
    };

    const fetchCooperados = async () => {
      try {
        const response = await api.get("/cooperado");
        setCooperados(response.data);
      } catch (error) {
        message.error("Erro ao carregar cooperados.");
      }
    };

    fetchContatoFavorito();
    fetchCooperados();
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        id: Number(id),
        ...values,
        cooperadoId: Number(values.cooperadoId),
      };
  
      await api.put(`/contatofavorito/${id}`, payload);
  
      message.success("Contato atualizado com sucesso!");
      navigate("/listacontatofavorito");
    } catch (error) {
      if (error.response) {
        console.error("Erro na API:", error.response.data);
        message.error(error.response.data.error || "Erro ao atualizar contato favorito.");
      } else {
        console.error("Erro desconhecido:", error);
        message.error("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Editar Contato Favorito" style={{ maxWidth: 500, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Digite o nome completo!" }]}>
          <Input placeholder="Nome completo" />
        </Form.Item>

        <Form.Item label="Tipo de Chave Pix" name="tipoChavePix" rules={[{ required: true }]}>
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
          <Button type="primary" htmlType="submit" style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }} block loading={loading}>
            Salvar Alterações
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ContatoFavoritoEditPage;
