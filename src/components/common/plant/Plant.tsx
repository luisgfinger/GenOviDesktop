import React from "react";
import PlantImg from "../../../assets/images/plant.png";

interface PlantProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  alt?: string;
}

const Plant: React.FC<PlantProps> = ({
  width = 438,
  height = 438,
  className = "",
  alt = "plant"
}) => {
  return (
    <img
      src={PlantImg}
      width={width}
      height={height}
      className={className}
      alt={alt}
      style={{ display: "block" }}
    />
  );
};

export default Plant;
