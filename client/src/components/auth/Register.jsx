import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/css/home.css";

/*O componente de registro coleta as informações inseridas no form e as envia para o endpoint de registro;*/
function Register(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmpassword) {
            alert('Senhas não coincidem.');
            return;
          }

          const registrationData = {
            name: name,
            email: email,
            password: password,
            confirmpassword: confirmpassword,
          };

//Se nenhum erro ocorrer, ele devolve a confirmação de registro e atualiza a página
          try {
            const response = await axios.post('http://localhost:3001/auth/register', registrationData);
      
            console.log('Registro realizado com sucesso:', response.data);
            window.location.reload();

          } catch (err) {
            console.error('Registro não foi realizado:', err.response.data);
          }

      }; 

    return(
        <div className='half'>
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='form-label' htmlFor="name">Nome:</label>
            <input className='form-control'
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor="email">Email:</label>
            <input className='form-control'
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor="password">Senha:</label>
            <input className='form-control'
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor="confirmpassword">Confirme a senha:</label>
            <input className='form-control'
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className='btn btn-primary' type="submit">Criar minha conta</button>
        </form>
      </div>
  

    )
}

export default Register