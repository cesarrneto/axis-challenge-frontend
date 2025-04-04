import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Button, Card, Typography, message } from "antd";
import api from "../../services/api";

const { Title } = Typography;
const { Option } = Select;

const CooperadoFormPage = () => {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [contaCorrente, setContaCorrente] = useState("");
  const [cooperativaId, setCooperativaId] = useState("");
  const [cooperativas, setCooperativas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCooperado = async () => {
      try {
        const response = await api.get(`/cooperado/${id}`);
        const { nome, contaCorrente, cooperativaId } = response.data;
        setNome(nome);
        setContaCorrente(contaCorrente);
        setCooperativaId(cooperativaId);
      } catch (error) {
        console.error("Erro ao buscar cooperado", error);
      }
    };

    const fetchCooperativas = async () => {
      try {
        const response = await api.get("/cooperativa");
        setCooperativas(response.data);
      } catch (error) {
        console.error("Erro ao buscar cooperativas", error);
      }
    };

    fetchCooperado();
    fetchCooperativas();
  }, [id]);

  const handleSubmit = async () => {
    const data = {
      nome,
      contaCorrente: Number(contaCorrente),
      cooperativaId: Number(cooperativaId),
    };

    try {
      await api.post(`/cooperado`, data);
      message.success("Cooperado cadastrado com sucesso!");
      navigate("/listacooperado");
    } catch (error) {
      message.error("Erro ao cadastrar cooperado");
      console.error("Erro ao cadastrar cooperado", error);
    }
  };

  return (
    <Card style={{ maxWidth: 500, margin: "auto", marginTop: 50, padding: 20 }}>
      <Title level={2} style={{ textAlign: "center" }}>Novo Cooperado</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Nome" required>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />
        </Form.Item>

        <Form.Item label="Conta Corrente" required>
          <Input
            type="number"
            value={contaCorrente}
            onChange={(e) => setContaCorrente(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Cooperativa" required>
          <Select value={cooperativaId} onChange={(value) => setCooperativaId(value)}>
            <Option value="">Selecione uma cooperativa</Option>
            {cooperativas.map((coop) => (
              <Option key={coop.id} value={coop.id}>
                {coop.nome}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }}>
            Salvar Alterações
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CooperadoFormPage;