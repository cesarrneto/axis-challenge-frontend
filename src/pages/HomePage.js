import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Button, Modal } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../services/api";

const HomePage = () => {
  const [cooperativas, setCooperativas] = useState(0);
  const [cooperados, setCooperados] = useState(0);
  const [contatosPorCooperado, setContatosPorCooperado] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [cooperativasRes, cooperadosRes] = await Promise.all([
        api.get("/cooperativa"),
        api.get("/cooperado"),
      ]);

      setCooperativas(cooperativasRes.data.length);
      setCooperados(cooperadosRes.data.length);
    } catch (error) {
      console.error("Erro ao buscar estatísticas", error);
    }
  };

  const fetchContatosPorCooperado = async () => {
    try {
      const response = await api.get("/cooperado");
      const cooperadosData = response.data;
      
      const contatosData = await Promise.all(
        cooperadosData.map(async (cooperado) => {
          try {
            const contatosRes = await api.get(`/contatofavorito/cooperado/${cooperado.id}`);
            return { name: cooperado.nome, contatos: contatosRes.data.length };
          } catch {
            return { name: cooperado.nome, contatos: 0 };
          }
        })
      );
      
      setContatosPorCooperado(contatosData);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Erro ao buscar contatos favoritos", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card>
            <Statistic title="Total de Cooperativas" value={cooperativas} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Total de Cooperados" value={cooperados} />
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button type="primary" style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }} onClick={fetchContatosPorCooperado}>
          Ver Contatos Favoritos por Cooperado
        </Button>
      </div>

      <Modal
        title="Contatos Favoritos por Cooperado"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contatosPorCooperado}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="contatos" fill="#fe3f00" />
          </BarChart>
        </ResponsiveContainer>
      </Modal>
    </div>
  );
};

export default HomePage;
