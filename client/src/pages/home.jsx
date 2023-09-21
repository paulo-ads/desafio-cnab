//Página inicial, onde é realizado o registro/login do usuário
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; //Será utilizado o react-cookies para averiguar o token de acesso na sessão
import Login from '../components/auth/Login' //Componente que lida com o form e o endpoint de login
import Register from '../components/auth/Register' //Componente que lida com o form e o endpoint de registro
import "../assets/css/home.css";


/*Página renderiza componentes de Login e Registro*/
export const Home = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['access_token']);

//Se o usuário estiver logado (presença do token de acesso) e tentar acessar a página inicial, ele é redirecionado à página principal
    useEffect(() => {
        if (cookies.access_token) {
          navigate('/main'); //Um usuário logado não vê a pagina inicial nem se acessa-la de forma manual
        }
      }, [cookies.access_token, navigate]);

    return (
        <div className="home p-3">
            <Login/>
            <Register/>
        </div>
    )
}