import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OptionCard.css";

type Option = {
  images: { src: string; alt?: string }[];
  text: string;
  href?: string;
  childrenOptions?: {
    text: string;
    href: string;
  }[];
};

type OptionCardProps = Option & {
  style?: React.CSSProperties;
  type?: "ovino" | "funcionario";
};

const OptionCard: React.FC<OptionCardProps> = ({
  images,
  text,
  href,
  childrenOptions,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const hasChildren = childrenOptions && childrenOptions.length > 0;

  const handleCardClick = () => {
    if (!hasChildren && href) {
      navigate(href);
    }
  };

  return (
    <div
      className={`optionCard-container flex-column ${
        hasChildren && isHovered ? "expanded" : ""
      }`}
      style={style}
      onMouseEnter={() => hasChildren && setIsHovered(true)}
      onMouseLeave={() => hasChildren && setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="option-Card-container-inside flex-column">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt || `image-${index}`}
            className={`optionCardImage ${isHovered ? "hidden" : ""}`}
          />
        ))}

        <span className="optionCardText flex">
          <h3>{text}</h3>
        </span>
      </div>

      {hasChildren && isHovered && (
        <div className="optionCard-children">
          {childrenOptions!.map((child, idx) => (
            <a key={idx} href={child.href} className="child-link flex">
              {child.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionCard;
