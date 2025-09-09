import React from "react";
import "./paginationMenu.css";
import LeftArrow from "../../../assets/icons/leftArrow.png";
import RightArrow from "../../../assets/icons/rightArrow.png";
import Button from "../buttons/Button";

interface PaginationMenuProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const PaginationMenu: React.FC<PaginationMenuProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showViewAll = false,
  onViewAll,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <ul className="paginationMenu-container flex">
      <li
        className={`flex ${currentPage === 1 ? "disabled" : ""}`}
        onClick={handlePrevious}
      >
        <img src={LeftArrow} alt="leftArrow" />
        <p>Anterior</p>
      </li>

      {showViewAll && (
        <li className="flex">
          <Button variant="pagination" onClick={onViewAll}>
            Ver todos
          </Button>
        </li>
      )}

      <li
        className={`flex ${currentPage === totalPages ? "disabled" : ""}`}
        onClick={handleNext}
      >
        <p>Próximo</p>
        <img src={RightArrow} alt="rightArrow" />
      </li>
    </ul>
  );
};

export default PaginationMenu;
