import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Input, Button, Modal, Select, Space, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../services/api";
import "../../styles/styles.css";

const { Search } = Input;
const { Option } = Select;

const ContatoFavoritoListPage = () => {
  const { cooperadoId } = useParams();
  const [contatosFavoritos, setContatosFavoritos] = useState([]);
  const [cooperados, setCooperados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [contatosRes, cooperadosRes] = await Promise.all([
          api.get(`/contatofavorito${cooperadoId ? `?cooperadoId=${cooperadoId}` : ""}`),
          api.get("/cooperado"),
        ]);
        setContatosFavoritos(contatosRes.data);
        setCooperados(cooperadosRes.data);
      } catch (error) {
        message.error("Erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cooperadoId]);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Tem certeza que deseja excluir este contato favorito?",
      onOk: async () => {
        try {
          await api.delete(`/contatofavorito/${id}`);
          setContatosFavoritos((prev) => prev.filter((fav) => fav.id !== id));
          message.success("Contato excluído com sucesso.");
        } catch (error) {
          message.error("Erro ao excluir contato.");
        }
      },
    });
  };

  const getCooperadoNome = (id) => {
    const cooperado = cooperados.find((coop) => coop.id === id);
    return cooperado ? cooperado.nome : "Desconhecido";
  };

  const filteredData = contatosFavoritos.filter((fav) =>
    fav.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "PIX",
      dataIndex: "chavePix",
      key: "chavePix",
      render: (text, record) => `${record.tipoChavePix}: ${text}`,
    },
    {
      title: "Cooperado",
      dataIndex: "cooperadoId",
      key: "cooperadoId",
      render: (id) => getCooperadoNome(id),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Link to={`/editarcontatofavorito/edit/${record.id}`}>
            <Button type="primary"  style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }} icon={<EditOutlined />}>
              Editar
            </Button>
          </Link>
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <h1>Lista de Contatos Favoritos</h1>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Select value={itemsPerPage} onChange={setItemsPerPage} style={{ width: 100 }}>
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
        </Select>
        <Link to="/novocontatofavorito">
          <Button type="primary"  style={{ backgroundColor: "#fe3f00", borderColor: "#fe3f00" }} icon={<PlusOutlined />}>
            Adicionar Contato
          </Button>
        </Link>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: itemsPerPage }}
        loading={loading}
      />
    </div>
  );
};

export default ContatoFavoritoListPage;
