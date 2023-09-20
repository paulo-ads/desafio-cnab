// Página principal, onde as operações podem ser carregadas, salvas e visualziadas
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; //Será utilizado o react-cookies para averiguar o token de acesso na sessão


export const Main = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['access_token']);

//Se o usuário não estiver logado (ausência do token de acesso) e tentar acessar a página principal, ele é redirecionado à página inicial
    useEffect(() => {
        if (!cookies.access_token) {
          navigate('/'); //Um usuário não logado não vê a pagina principal nem se acessa-la de forma manual
        }
    }, [cookies.access_token, navigate]);
   
    return (
        <div>
            <h1>Página Principal</h1>
        </div>
    )
}