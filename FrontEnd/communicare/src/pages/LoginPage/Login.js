import "./Login.css";
import { useState, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import iconCC from "../../assets/iconCC.jpg";
import backImage from '../../assets/back.jpg';
import icon from '../../assets/icon.jpg';
import { api } from '../../utils/axios.js';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {PopUp} from '../../components/PopUpPage/PopUp.js';


const Header = () => {
  return (
    <header className="headerlog">
      <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  );
};

function DadosAuthentication() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);


  const errorMessageRef = useRef(null);

  const navigate = useNavigate();


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage("");

    try {

      const response = await api.post("Utilizadores/login", {
        email,
        password,
      });

      const { token, message } = response.data;


      localStorage.setItem("token", token);

      /*localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("tokenIssuedAt", Date.now());
      localStorage.setItem("tokenExpiresIn", expiresIn);*/

      const esconderPopup = localStorage.getItem("popupLoginEscondido") === "true";

      if (!esconderPopup) {
        setPopupMessage("Bem-vindo à CommuniCare! Esta plataforma foi criada para facilitar a interação entre membros de comunidades locais, promovendo a entreajuda através de um sistema de recompensas sustentável. Para começares a ganhar os teus primeiros Cares (a nossa moeda virtual), basta começares por te voluntariar. Esperamos que aproveites ao máximo as experiências e ligações que a CommuniCare tem para te oferecer!");
        setShowPopup(true);

        // Só espera os 70s se mostrar o popup
        setTimeout(() => {
          setShowPopup(false);
          navigate("/profile");
        }, 70000);
      } else {
        // Se não mostrar popup, navega imediatamente
        navigate("/profile");
      }

    } catch (error) {

      setErrorMessage(error?.response?.data?.message || error.message);
      if (errorMessageRef.current) {
        errorMessageRef.current.style.display = "block";
      }
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <div className="bgImg" style={{ backgroundImage: `url(${backImage})` }}></div>
      <div className="containerlog">
        {showPopup && (
          <PopUp
            message={popupMessage}
            onClose={() => {
              setShowPopup(false);
              navigate("/profile");
            }}
          />
        )}
        <form onSubmit={handleSubmit}>
          <h1 className="h1Log">Login</h1>
          <img className="iconImage" src={icon} width={100} height={100} alt="Icon" />

          <div className="divider"></div>
          <div className="form">

            <div className="field">
              <input className="inputDadosLog"
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>


            <div className="field password-field">
              <input className="inputDadosLog"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                style={{ paddingRight: "35px" }}
              />
              <span
                className="passwordEye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>


            {errorMessage && (
              <p ref={errorMessageRef} style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}


            <button className="buttonEntrar" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? "A entrar..." : "Entrar"}
            </button>

            <div className="textLog">
              Novo no Condominio?{" "}
              <Link className="logLinks" to="/registar">
                Criar conta
              </Link>
            </div>
            <div className="textLog">
              <Link className="logLinks" to="/fgpassword">
                Esqueceu-se da password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function Login() {
  return (
    <>
      <Header />
      <DadosAuthentication />
    </>
  );
}

export default Login;