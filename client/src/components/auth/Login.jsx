import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie' //Será utilizado o react-cookies para averiguar o token de acesso na sessão
import { useNavigate } from 'react-router-dom'
import "../../assets/css/home.css";


/*O componente de Login coleta as informações do form e as deposita em uma variavel que será usada como corpo da requisição para o endpoint de Login

Ele também salva informações do usuário (Id e Token de acesso) na sessão após o Login ser realizado*/
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

// O react-cookies resgata o token de acesso
  const [_, setCookies] = useCookies(["access_token"])

  const navigate = useNavigate()

//Função utilizada para o envio das informações do form para o endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

/*A requisição que der certo receberá de volta, entre outras coisas, o token de acesso e o ID do usuário;

Informações do usuário são salvas na sessão local e através de cookies*/
    try {
      const response = await axios.post('http://localhost:3001/auth/login', loginData);

      console.log('Login realizado com sucesso:', response.data);

        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);

        navigate("/main") //Depois de tudo, o usuário é redirecionado à página principal
    } catch (err) {
      console.error('Erro no Login:', error.response.data);
    }
  };

  return (
    <div className='half'>
      <h2>Login</h2><br />
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor="email" className='form-label'>Email:</label>
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
        <button className='btn btn-primary' type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
