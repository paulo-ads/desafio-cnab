// Componente que renderiza as tabelas com as operações salvas que deram errado
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import axios from 'axios';

// Função que lida com a renderização e a organização das tabelas de operações erradas
function ErrorTable() {
    const [errorOperations, setErrorOperations] = useState([]);
    const [cookies] = useCookies(['access_token']);

// Função que será chamada toda vez que a página atualizar ou o botão "atualizar" for apertado
// Retorna os objetos de todas as operações criadas pelo usuário logado que deram errado e as salva no useState 'errorOperations'
    const fetchErrorData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/operations/saved', { // A requisição envia o ID do usuário logado
                params: { userID: window.localStorage.getItem('userID') },
                headers: {
                Authorization: `Bearer ${cookies.access_token}`, 
                },
            });
            const operations = response.data.savedOperations;
            setErrorOperations(operations.filter(item => item.erro)); // Somente as operações que deram errado serão salvas no useState e, posteriormente, renderizadas
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchErrorData(); // Atualiza os dados da tabela toda vez que a página é atualizada
    }, []);

        return (
            <div>
            <br />
            {errorOperations.length > 0 ? ( //Se houver operações erradas salvas por esse usuário, a tabela é renderizada
            <div>
            <h3>Operações com erro:</h3>
            <table className="table">
            <thead>
                <tr>
                <th scope="col">Tipo de Operação</th>
                <th scope="col">Data de Operação</th>
                <th scope="col">Valor da Operação</th>
                <th scope="col">CPF</th>
                <th scope="col">Cartão</th>
                <th scope="col">Nome do Dono</th>
                <th scope="col">Nome da Loja</th>
                </tr>
            </thead>
            <tbody>
            {errorOperations.map((item) => ( //É realizada uma iteração por cada operação errada, onde as operações mais novas tornam-se linhas da tabela
                <tr key={item._id}>
                <td>{item.tipo}</td>
                <td>{item.data}</td>
                <td>{item.valor}R$</td>
                <td>{item.cpf}</td>
                <td>{item.cartao}</td>
                <td>{item.nomeDono}</td>
                <td>{item.nomeLoja}</td>
                </tr>
                ))}
            </tbody>
            </table>
            </div>
            ) : (
            <></>
            )}
            <br />
        </div>
        );
  }

export default ErrorTable