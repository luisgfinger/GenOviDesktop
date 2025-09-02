import React from "react";
import "./CadastrarOvino.css";
import "../../styles/Button.css"

const CadastrarOvino: React.FC = () => {
  return (
    <div className="cadastrarOvino-container flex-column">
      <div className="cadastrarOvino-line1 flex">
        <ul>
          <li>
            <span className="cadastrarOvino-imageUpdate flex">
              <h3>Imagem</h3>
            </span>
          </li>
        </ul>
        <ul className="cadastrarOvino-line1-column1 flex-column">
          <li>
            <label htmlFor="">Nome</label>
            <input type="text" placeholder="Insira o nome" />
          </li>
          <li>
            <label htmlFor="">Raça</label>
            <input type="text" placeholder="Insira a raça" />
          </li>
          <li>
            <label htmlFor="">Criador</label>
            <input type="text" placeholder="Insira o criador" />
          </li>
        </ul>
        <ul className="cadastrarOvino-line1-column2 flex-column">
          <li>
            <label htmlFor="">FBB</label>
            <input type="text" placeholder="Insira o FBB" />
          </li>
          <li>
            <label htmlFor="">Sexo</label>
            <input type="text" placeholder="Insira o sexo" />
          </li>
          <li>
            <label htmlFor="">Data de nascimento</label>
            <input type="text" placeholder="Insira a data de nascimento" />
          </li>
        </ul>
      </div>
      <div className="cadastrarOvino-line2 flex">
        <ul className="cadastrarOvino-line2-column1 flex-column">
          <li className="flex">
            <span className="flex-column">
              <label htmlFor="">Grau de pureza</label>
              <input type="text" placeholder="Insira a pureza" />
            </span>
            <span className="flex-column">
              <label htmlFor="">Peso</label>
              <input type="text" placeholder="Insira o peso" />
            </span>
          </li>
          <li className="flex-column">
            <label htmlFor="">Ovelha mãe</label>
            <input type="text" placeholder="Insira a ovelha mãe" />
          </li>
        </ul>
        <ul className="cadastrarOvinoline2-column2 flex-column">
          <li className="flex-column">
            <label htmlFor="">Status</label>
            <input type="text" placeholder="Insira o status" />
          </li>
          <li className="flex-column">
            <label htmlFor="">Carneiro pai</label>
            <input type="text" placeholder="Insira o carneiro pai" />
          </li>
        </ul>
      </div>
      <span className="cadastrarOvino-line3 flex-column">
        <label htmlFor="">Comportamento</label>
        <input type="text" placeholder="Insira o comportamento" />
      </span>
      <button className="paginationMenu-button">Criar ovino</button>
    </div>
  );
};

export default CadastrarOvino;
