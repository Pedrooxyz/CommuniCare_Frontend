import React, { useState, useEffect } from "react";
import { FaSearch, FaCubes, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./MeusEmprestimosPage.css";

import person1 from "../../../assets/person1.jpg";
import cares from "../../../assets/Cares.png";
import cortaRelva from "../../../assets/cortaRelva.jpg";
import compressor from "../../../assets/compressor.jpg";

const HeaderProfileCares = () => {
  return (
    <header className="headerCares">
      <p>100</p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img className="imgHeaderVol" src={person1} width={60} height={60} alt="Person" />
    </header>
  );
};

const Search = () => {
  return (
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabs">
        <div className="choose">
          <button className="tab active">Meus Empréstimos</button>
          <button className="tab">Outros Empréstimos</button>
        </div>
        <div className="search-wrapper">
          <input type="text" placeholder="Pesquisar..." className="search" />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
};

const ListaItems = () => {
  const [items, setItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get("/Utilizadores/InfoUtilizador");
        console.log("Utilizador autenticado:", userResponse.data);
        setUserInfo(userResponse.data);

        const itemsResponse = await api.get("/ItensEmprestimo/MeusItens");
        console.log("Meus itens recebidos:", itemsResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cards">
      {items.map((item) => (
        <div className="card" key={item.itemId}>
          <div className="TitleOE">
            <h2>{item.nomeItem}</h2>
          </div>
          <img
            className="imgItemOE"
            src={item.fotografiaItem || cortaRelva}
            alt={item.nomeItem}
          />
          <p>{item.descItem || "Sem descrição disponível."}</p>
          <div className="infoItemOE">
            <span>
              <FaCubes /> {item.disponivel ? "Disponível" : "Emprestado"}
            </span>
            <span>
              <img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h
            </span>
          </div>
          <div className="estadoItem">
            <div>
              <span className="estado">
                Estado:{" "}
                <span
                  className={`estado-circle ${
                    item.estado === "Disponível" ? "disponivel" : "emprestado"
                  }`}
                ></span>
              </span>
            </div>
            <div className="controlesAcao">
              <button className="EditDeleteButtons">
                <FaEdit />
              </button>
              <button className="EditDeleteButtons">
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function MeusEmprestimos() {
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaItems />
    </>
  );
}

export default MeusEmprestimos;
