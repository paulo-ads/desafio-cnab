//Componente Header simples que renderiza um botão de sair(logoff) caso o usuário esteja logado
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie"; 
import axios from 'axios';

//Função verifica presença do token de acesso na sessão (usuário logado ou não) e renderiza um botão de logoff se o achar
function Header(){
    const navigate = useNavigate()
    const [cookies, setCookies] = useCookies(["access_token"]);

/*Função que apaga o token de acesso e o ID do usuário da sessão*/
    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        navigate("/")
    }

    return(
        <div className="navbar">
            {cookies.access_token ? (<p>Desafio CNAB<button onClick={logout}>Sair</button></p>) : <p>Desafio CNAB</p>}
        </div>
    )
}

export default Header