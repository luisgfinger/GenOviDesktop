import React from "react";
import "./OptionCard.css";

type Option = {
  images: { src: string; alt?: string }[];
  text: string;
  href: string;
  className?: string;
};

type OptionCardProps = Option;

const OptionCard: React.FC<OptionCardProps> = ({
  images,
  text,
  href,
  className,
}) => {
  return (
    <div className="optionCard-container flex-column">
      <a href={href} className="flex-column">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt || `image-${index}`}
          />
        ))}
        <span className="optionCardText flex">
           <h3>{text}</h3>
        </span>
       
      </a>
    </div>
  );
};

export default OptionCard;
