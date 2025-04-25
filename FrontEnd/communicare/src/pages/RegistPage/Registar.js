import "./Registar.css";
import { useState, useEffect } from "react";
import iconCC from "../../assets/iconCC.jpg";
import backImage from '../../assets/back.jpg';
import icon from '../../assets/icon.jpg';
import { Link } from "react-router-dom";



const Header = () => {
  return(
    <header className="header reg">
     <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  )
  
}

function DadosAuthentication(){
  const initialValues ={
    username:"",
    email:"",
    password:"",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormValues({...formValues, [name]: value});
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  
  useEffect(() =>{
    console.log(formErrors);
    if(Object.keys(formErrors).length === 0 && isSubmit){
      alert("Registo foi sucedido");
      console.log(formValues);
    }
  }, [formErrors, formValues, isSubmit]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/; // Pelo menos uma letra maiúscula, um símbolo especial

    if(!values.username){
      errors.username = "Nome é necessário!";
    }
    if(!values.email){
      errors.email = "Email é necessário!";
    }else if (!regex.test(values.email)){
      errors.email = "Não é válido para o formato de email!";
    }
    if(!values.password){
      errors.password = "É necessário password!";
    }else if (values.password.length < 10){
      errors.password = "Password tem que ter mais de 10 caracteres";
    }else if (values.password.length > 16){
      errors.password = "Password não pode ter mais de 16 caracteres";
    }else if (!passwordRegex.test(values.password)){
      errors.password = "Password deve conter pelo menos uma letra minuscula e um caracter especial"
    }
    return errors;
  };

  return(
    <>
      <div className="bgImg" style={{ backgroundImage: `url(${backImage})` }}></div>
      <div className="container">
        {Object.keys(formErrors).length === 0 && isSubmit ? (
          <div className="message success">
            Registo foi sucedido
          </div>
        ) : (
          console.log("Dados inseridos", formValues)
        )}

        <form onSubmit={handleSubmit}>
          <h1 className="h1Reg">Registar</h1>
          
          <img className="iconImage" src={icon} width={100} height={100} alt="Icon"  />

          <div className="divider"></div>
          <div className="form">

            <div className="field">
              <input className="inputDadosReg"
                type="text"
                name="username"
                placeholder="Nome"
                value={formValues.username}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.username}</p>

            <div className="field">
              <input className="inputDadosReg"
                type="text"
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.email}</p>

            <div className="field">
              <input className="inputDadosReg"
                type="password"
                name="password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.password}</p>

            <button className="buttonSubmit">Submit</button>

            <div className="textReg">
              Já possui conta? <Link className="regLinks" to="/">Iniciar sessão</Link>
            </div>


          </div>
        </form>
        

        
        
      </div>
    </>
  )


}

function Registar() {
  return (
    <>
      <Header />
      <DadosAuthentication />
    </>
  );
}



export default Registar