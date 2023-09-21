// Página principal, onde as operações podem ser carregadas, salvas e visualziadas
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; //Será utilizado o react-cookies para averiguar o token de acesso na sessão
import FileUpload from '../components/common/FileUpload'; //Componente que renderiza o carregador de arquivos, bem como sua lógica
import OperationsTable from '../components/common/OperationsTable'; //Componente que renderiza a tabela com as operações salvas pelo usuário logado
import ErrorTable from '../components/common/ErrorTable' //Componente que renderiza a tabela das operações carregadas pelo usuário logado que deram errado
import "../assets/css/home.css";


// Página renderiza os componentes das tabelas e do carregador de arquivos
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
        <div className='m-3'>
            <FileUpload />
            <OperationsTable />
            <ErrorTable />
        </div>
    )
}