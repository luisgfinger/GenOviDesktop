import React from "react";
import PlayStore from "../../assets/icons/playstore.png";
import AppleStore from "../../assets/icons/applestore.png";
import CellPhone from "../../assets/icons/cellphone.png";
import Email from "../../assets/icons/email.png";
import Adress from "../../assets/icons/adress.png";
import Facebook from "../../assets/icons/facebook.png";
import Twitter from "../../assets/icons/twitter.png";
import Linkedin from "../../assets/icons/linkedin.png";
import Instagram from "../../assets/icons/instagram.png";
import "./Fotter.css";
import LogoType from "../logo/Logo";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container flex">
      <ul className="footer-column footer-column-1 flex-column">
        <li className="flex-column">
          <span>
            <a href=""><LogoType/></a>
          </span>
        </li>
        <li>
          <span>
            <a className="link-effect" href="">Baixe nosso aplicativo para Android ou IOS</a>
          </span>
        </li>
        <li className="stores-buttons flex">
          <span>
            <a href=""><img src={PlayStore} alt="playStore" /></a>
          </span>
          <span>
            <a href=""><img src={AppleStore} alt="appleStore" /></a>
          </span>
        </li>
      </ul>
      <ul className="footer-column flex-column">
        <li>
          <span>
            <h3>Páginas</h3>
          </span>
        </li>
        <li className="footer-list flex-column">
          <a href="">Sobre nós</a>
          <a href="">Preços</a>
          <a href="">Serviços</a>
        </li>
      </ul>
      <ul className="footer-column flex-column">
        <li>
          <span>
            <h3>Serviços</h3>
          </span>
        </li>
        <li className="footer-list flex-column">
          <a href="">Solicitar visita</a>
          <a href="">Orçamento</a>
        </li>
      </ul>
      <ul className="footer-column flex-column">
        <li>
          <span>
            <h3>Contato</h3>
          </span>
        </li>
        <ul className="footer-list flex-column">
          <li className="footer-contact-list flex">
            <img src={CellPhone} alt="cellphone" />
            <p>(45) 3333-3333</p>
          </li>
          <li className="footer-contact-list flex flex">
            <img src={Email} alt="cellphone" />
            <p>genovi.fag@gmail.com</p>
          </li>
          <li className="footer-contact-list flex flex">
            <img src={Adress} alt="cellphone" />
            <p>
              Av. Paulista, 1000<br/>
              Bela Vista, São Paulo - SP,<br/>
              01310-100
            </p>
          </li>
        </ul>
      </ul>
      <ul className="footer-column flex-column">
        <li>
          <span>
            <h3>Redes sociais</h3>
          </span>
        </li>
        <li className="footer-media-icons flex">
          <a href=""><img src={Facebook} alt="facebook" /></a>
          <a href=""><img src={Twitter} alt="twitter" /></a>
          <a href=""><img src={Linkedin} alt="linkedin" /></a>
          <a href=""><img src={Instagram} alt="instagram" /></a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
