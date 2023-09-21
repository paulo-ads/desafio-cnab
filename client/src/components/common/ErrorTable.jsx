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
            <div className='operationsErrorTable'>
            <br />
            {errorOperations.length > 0 ? ( //Se houver operações erradas salvas por esse usuário, a tabela é renderizada
            <div>
            <h4 className='title-error'>Operações com erro:</h4>
            <div className='table-responsive mt-2'>
            <table className="table table-sm table-dark">
            <thead>
                <tr>
                <th className='bg-danger' scope="col">Tipo de Operação</th>
                <th className='bg-danger' scope="col">Data de Operação</th>
                <th className='bg-danger' scope="col">Valor da Operação</th>
                <th className='bg-danger' scope="col">CPF</th>
                <th className='bg-danger' scope="col">Cartão</th>
                <th className='bg-danger' scope="col">Nome do Dono</th>
                <th className='bg-danger' scope="col">Nome da Loja</th>
                </tr>
            </thead>
            <tbody>
            {errorOperations.map((item) => ( //É realizada uma iteração por cada operação errada, onde as operações mais novas tornam-se linhas da tabela
                <tr key={item._id}>
                <td className='table-danger'>{item.tipo}</td>
                <td className='table-danger'>{item.data}</td>
                <td className='table-danger'>{item.valor}R$</td>
                <td className='table-danger'>{item.cpf}</td>
                <td className='table-danger'>{item.cartao}</td>
                <td className='table-danger'>{item.nomeDono}</td>
                <td className='table-danger'>{item.nomeLoja}</td>
                </tr>
                ))}
            </tbody>
            </table>
            </div>
            </div>
            ) : (
            <></>
            )}
            <br />
        </div>
        );
  }

export default ErrorTable