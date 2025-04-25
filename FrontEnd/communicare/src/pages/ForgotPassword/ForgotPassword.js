import "./ForgotPassword.css";
import { useState, useEffect } from "react";
import iconCC from "../../assets/iconCC.jpg";
import backImage from '../../assets/back.jpg';
import icon from '../../assets/icon.jpg';

import { Link } from 'react-router-dom';



const Header = () => {
  return(
    <header className="header ep">
     <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  )
  
}

function EmailAuthentication(){
  const initialValues ={
    email:"",
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
      alert("Enviado para o email");
      console.log(formValues);
    }
  }, [formErrors, formValues, isSubmit]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    

    
    if(!values.email){
      errors.email = "Email é necessário!";
    }else if (!regex.test(values.email)){
      errors.email = "Não é válido para o formato de email!";
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
          <h1 className="h1FP">Esqueci-me da password</h1>
          
          <img className="iconImage" src={icon} width={100} height={100} alt="Icon"  />

          <div className="divider"></div>
          <div className="form">


            <div className="field">
              <input className="inputDadosFP"
                type="text"
                name="email"
                placeholder="Email de recuperação "
                value={formValues.email}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.email}</p>

            

            <button className="buttonSubmit">Submit</button>

            <div className="textFP">
              Já possui conta? <Link className="fpLinks" to="/">Iniciar sessão</Link>
            </div>


          </div>
        </form>
        

        
        
      </div>
    </>
  )


}

function ForgotPassword() {
  return (
    <>
      <Header />
      <EmailAuthentication />
    </>
  );
}



export default ForgotPassword