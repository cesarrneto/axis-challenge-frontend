import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Select, Button, Card, Space, Typography, message, Popconfirm, Modal, List } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, ContactsOutlined } from "@ant-design/icons";
import api from "../../services/api";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const CooperadoListPage = () => {
  const [cooperados, setCooperados] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  const [selectedCooperado, setSelectedCooperado] = useState(null);
  const [contatos, setContatos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCooperados();
    fetchCooperativas();
  }, []);

  const fetchCooperados = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cooperado");
      setCooperados(response.data);
    } catch (error) {
      message.error("Erro ao buscar cooperados");
    }
    setLoading(false);
  };

  const fetchCooperativas = async () => {
    try {
      const response = await api.get("/cooperativa");
      setCooperativas(response.data);
    } catch (error) {
      message.error("Erro ao buscar cooperativas");
    }
  };

  const getCooperativaNome = (id) => {
    const cooperativa = cooperativas.find((coop) => coop.id === id);
    return cooperativa ? cooperativa.nome : "Desconhecida";
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cooperado/${id}`);
      setCooperados(cooperados.filter((cooperado) => cooperado.id !== id));
      message.success("Cooperado excluído com sucesso!");
    } catch (error) {
      message.error("Erro ao excluir cooperado");
    }
  };

  const fetchContatos = async (cooperado) => {
    setSelectedCooperado(cooperado);
    setIsModalVisible(true);
    try {
      const response = await api.get(`/contatofavorito/cooperado/${cooperado.id}`);
      setContatos(response.data || []);
    } catch (error) {
      setContatos([]);
    }
  };

  const filteredCooperados = cooperados.filter(
    (cooperado) =>
      cooperado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cooperado.contaCorrente).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card style={{ maxWidth: 800, margin: "auto", marginTop: 20, padding: 20 }}>
      <Title level={3} style={{ textAlign: "center" }}>Lista de Cooperados</Title>
      
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
      <Search
      placeholder="Buscar por nome ou conta corrente..."
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
        <Link to="/novocooperado">
          <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }}>
            Novo Cooperado
          </Button>
        </Link>
      </Space>

      <Table
        dataSource={filteredCooperados}
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
            title: "Cooperativa",
            key: "cooperativaId",
            render: (record) => getCooperativaNome(record.cooperativaId),
          },
          {
            title: "Conta Corrente",
            key: "contaCorrente",
            render: (record) => (record.contaCorrente),
          },
          {
            title: "Ações",
            key: "acoes",
            render: (record) => (
              <Space>
                <Button type="default" icon={<ContactsOutlined />} onClick={() => fetchContatos(record)}>
                  Meus Contatos
                </Button>
                <Link to={`/editarcooperado/edit/${record.id}`}>
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
        title={`Contatos de ${selectedCooperado?.nome || ""}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {contatos.length > 0 ? (
          <List
            dataSource={contatos}
            renderItem={(item) => (
              <Card style={{ marginBottom: 10 }}>
                <p><strong>Nome:</strong> {item.nome}</p>
                <p><strong>PIX ({item.tipoChavePix}):</strong> {item.chavePix}</p>
              </Card>
            )}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <p>Nenhum contato favorito encontrado.</p>
            <Link to="/novocontatofavorito">
              <Button type="primary" style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }} icon={<PlusOutlined />}>Adicionar Contato</Button>
            </Link>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default CooperadoListPage;