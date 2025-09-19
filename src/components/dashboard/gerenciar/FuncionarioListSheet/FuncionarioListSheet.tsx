import React, { useState } from "react";
import type { Funcionario } from "../../../../api/models/funcionario/FuncinarioModel";
import "./FuncionarioListSheet.css";
import { motion, AnimatePresence } from "framer-motion";
import FuncionarioCard from "../../../common/cards/funcionarioCard/FuncionarioCard";

interface FuncionarioListSheetProps {
  funcionarios: Funcionario[];
}

const FuncionarioListSheet: React.FC<FuncionarioListSheetProps> = ({ funcionarios }) => {
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);

  const handleFuncionarioSelect = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    console.log("Selecionado:", funcionario);
  };

  return (
    <div className="funcionarioSheet-container flex">
      <AnimatePresence mode="wait">
        {selectedFuncionario && (
          <motion.div
            key={selectedFuncionario.id}
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}    
            exit={{ opacity: 0, scale: 0.8 }}   
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "center" }} 
          >
            <FuncionarioCard
              cpfCnpj={selectedFuncionario.cpfCnpj}
              endereco={selectedFuncionario.endereco}
              nome={selectedFuncionario.nome}
              telefone={selectedFuncionario.telefone}
              dataAdmissao={selectedFuncionario.dataAdmissao}/>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="funcionarioSheet-container-inside flex-column">
        <li className="funcionarioSheet-titles-row flex">
          <span className="flex">ID</span>
          <span className="flex">NOME</span>
          <span className="flex">CPF/CNPJ</span>
          <span className="flex">ENDEREÇO</span>
          <span className="flex">TELEFONE</span>
        </li>

        {funcionarios.map((funcionario, index) => (
          <li
            key={funcionario.id}
            className={`funcionarioSheet-row flex ${
              index % 2 === 0 ? "par" : "impar"
            } ${selectedFuncionario?.id === funcionario.id ? "selecionado" : ""}`}
            onClick={() => handleFuncionarioSelect(funcionario)}
          >
            <span className="flex">{funcionario.id}</span>
            <span className="flex">{funcionario.nome}</span>
            <span className="flex">{funcionario.cpfCnpj}</span>
            <span className="flex">{funcionario.endereco}</span>
            <span className="flex">{funcionario.telefone}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuncionarioListSheet;