import {useContext} from "react";
import {ThemeContext} from "../context/ThemeContext.jsx";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <footer className={`bg-${theme}-footer-bg text-center p-4 mt-8`}>
      <p className={`text-${theme}-text text-sm`}>
        Фрагмент. Все права защищены
      </p>
    </footer>
  );
};

export default Footer;
