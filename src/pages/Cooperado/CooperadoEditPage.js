import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Button, Card, Typography, message } from "antd";
import api from "../../services/api";

const { Title } = Typography;
const { Option } = Select;

const CooperadoEditPage = () => {
  const { id } = useParams();
  const [cooperativas, setCooperativas] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCooperado = async () => {
      try {
        const response = await api.get(`/cooperado/${id}`);
        if (response.data) {
          form.setFieldsValue({
            nome: response.data.nome || "",
            contaCorrente: String(response.data.contaCorrente) || "",
            cooperativaId: String(response.data.cooperativaId) || "",
          });
        }
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

    if (id) fetchCooperado();
    fetchCooperativas();
  }, [id, form]);

  const handleSubmit = async (values) => {
    const data = {
      id: Number(id),
      nome: values.nome,
      contaCorrente: Number(values.contaCorrente),
      cooperativaId: Number(values.cooperativaId),
    };

    try {
      await api.put(`/cooperado/${id}`, data);
      console.log("Enviando dados para API:", data);
      message.success("Cooperado atualizado com sucesso!");
      navigate("/listacooperado");
    } catch (error) {
      message.error("Erro ao atualizar cooperado");
      console.error("Erro ao atualizar cooperado", error);
    }
  };

  return (
    <Card style={{ maxWidth: 500, margin: "auto", marginTop: 50 }}>
      <Title level={3}>Editar Cooperado</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Por favor, insira o nome" }]}> 
          <Input />
        </Form.Item>

        <Form.Item label="Conta Corrente" name="contaCorrente" rules={[{ required: true, message: "Por favor, insira a conta corrente" }]}> 
          <Input />
        </Form.Item>

        <Form.Item label="Cooperativa" name="cooperativaId" rules={[{ required: true, message: "Por favor, selecione uma cooperativa" }]}> 
          <Select>
            <Option value="">Selecione uma cooperativa</Option>
            {cooperativas.map((coop) => (
              <Option key={coop.id} value={String(coop.id)}>
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

export default CooperadoEditPage;
