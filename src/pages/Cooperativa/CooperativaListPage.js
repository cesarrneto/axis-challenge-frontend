import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Select, Button, Card, Space, Typography, message, Popconfirm, Modal, List } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import api from "../../services/api";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const CooperativaListPage = () => {
  const [cooperativas, setCooperativas] = useState([]);
  const [cooperados, setCooperados] = useState([]);
  const [selectedCooperativa, setSelectedCooperativa] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCooperativas();
  }, []);

  const fetchCooperativas = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cooperativa");
      setCooperativas(response.data);
    } catch (error) {
      message.error("Erro ao buscar cooperativas");
      console.error("Erro ao buscar cooperativas:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cooperativa/${id}`);
      setCooperativas(cooperativas.filter((cooperativa) => cooperativa.id !== id));
      message.success("Cooperativa excluída com sucesso!");
    } catch (error) {
      message.error("Erro ao excluir cooperativa");
      console.error("Erro ao excluir cooperativa", error);
    }
  };

  const fetchCooperados = async (cooperativa) => {
    setSelectedCooperativa(cooperativa);
    setIsModalVisible(true);
  
    try {
      const response = await api.get(`/cooperativa/${cooperativa.id}`);
      setCooperados(response.data.cooperados || []);
    } catch (error) {
      message.error("Erro ao buscar cooperados");
      console.error("Erro ao buscar cooperados:", error);
      setCooperados([]);
    }
  };

  const filteredCooperativas = cooperativas.filter((cooperativa) =>
    cooperativa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card style={{ maxWidth: 800, margin: "auto", marginTop: 20, padding: 20 }}>
      <Title level={3} style={{ textAlign: "center" }}>Lista de Cooperativas</Title>
      
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Search
          placeholder="Buscar por nome..."
          allowClear
          onSearch={(value) => setSearchTerm(value)}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />
        <Select value={itemsPerPage} onChange={(value) => setItemsPerPage(value)} style={{ width: 120 }}>
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
        </Select>
        <Link to="/novacooperativa">
          <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }}>
            Nova Cooperativa
          </Button>
        </Link>
      </Space>

      <Table
        dataSource={filteredCooperativas}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: itemsPerPage,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
        columns={[
          {
            title: "Nome",
            dataIndex: "nome",
            key: "nome",
          },
          {
            title: "Ações",
            key: "acoes",
            render: (record) => (
              <Space>
                <Button type="default" icon={<TeamOutlined />} onClick={() => fetchCooperados(record)}>
                  Meus Cooperados
                </Button>
                <Link to={`/editarcooperativa/edit/${record.id}`}>
                  <Button type="primary" style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }} icon={<EditOutlined />}>Editar</Button>
                </Link>
                <Popconfirm
                  title="Tem certeza que deseja excluir?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button danger icon={<DeleteOutlined />}>Excluir</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={`Cooperados da ${selectedCooperativa?.nome || ""}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {cooperados.length > 0 ? (
          <List
            dataSource={cooperados}
            renderItem={(item) => (
              <Card style={{ marginBottom: 10 }}>
                <p><strong>Nome:</strong> {item.nome}</p>
                <p><strong>Conta Corrente:</strong> {item.contaCorrente}</p>
              </Card>
            )}
          />
        ) : (
          <p>Nenhum cooperado encontrado.</p>
        )}
      </Modal>
    </Card>
  );
};

export default CooperativaListPage;
