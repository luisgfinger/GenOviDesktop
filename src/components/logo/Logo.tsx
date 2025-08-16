import React from "react";
import LogoImg from "../../assets/images/logo.png";

interface LogoProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  alt?: string;
}

const LogoType: React.FC<LogoProps> = ({
  width = 166,
  height = 40,
  className = "",
  alt = "Logo"
}) => {
  return (
    <img
      src={LogoImg}
      width={width}
      height={height}
      className={className}
      alt={alt}
      style={{ display: "block" }}
    />
  );
};

export default LogoType;
