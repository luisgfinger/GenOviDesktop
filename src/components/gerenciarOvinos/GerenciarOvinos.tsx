import React, { useEffect, useState } from "react";
import OvinoCard from "../ovinoCard/OvinoCard";
import "./GerenciarOvinos.css";
import OvinoService, { type Ovino } from "../../services/ovinoService";

const GerenciarOvinos: React.FC = () => {
  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOvinos = async () => {
      try {
        const data = await OvinoService.getAll();
        setOvinos(data);
      } catch (error) {
        console.error("Erro ao carregar ovinos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOvinos();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gerenciarOvinos-container flex">
      {ovinos.map((ovino) => (
        <OvinoCard
          key={ovino.id}
          imagem={ovino.imagem}
          nome={ovino.nome}
          sexo={ovino.sexo}
          fbb={ovino.fbb}
          raca={ovino.raca}
          pai={ovino.pai}
          mae={ovino.mae}
          pureza={ovino.pureza}
        />
      ))}
    </div>
  );
};

export default GerenciarOvinos;
