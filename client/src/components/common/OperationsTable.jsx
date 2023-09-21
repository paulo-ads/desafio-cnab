// Componente que renderiza as tabelas com as operações salvas pelo usuário e guarda a lógica delas
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import axios from 'axios';

// Função que lida com a renderização e a organização das tabelas de operações, bem como os saldos totalizadores
function OperationsTable() {
    const [operations, setOperations] = useState([]);
    const [saldoTotals, setSaldoTotals] = useState({}); //Use state usado para acumular o saldo total de cada loja
    const [cookies] = useCookies(['access_token']);

// Função que será chamada toda vez que a página atualizar ou o botão "atualizar" for apertado
// Retorna os objetos de todas as operações criadas pelo usuário logado e a salva no useState 'operations', além de salvar os novos valores dos saldos totalizadores
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/operations/saved', { // A requisição envia o ID do usuário logado
                params: { userID: window.localStorage.getItem('userID') },
                headers: {
                Authorization: `Bearer ${cookies.access_token}`, 
                },
            });
            const operationsData = response.data.savedOperations.filter(item => !item.erro); // Somente as operações que NÃO deram errado serão salvas no useState e, posteriormente, renderizadas
            setOperations(operationsData);

            const totals = calculateSaldoTotals(operationsData); //As novas operações prestes a serem renderizadas são também enviadas para o calculador de saldo totalizador, que recebe um array de objetos e retorna os atributos 'Valor' e 'NomeLoja
            setSaldoTotals(totals); //Esses atributos são então salvos no useState
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData(); // Atualiza os dados da tabela (e do saldo totalizador) toda vez que a página é atualizada
    }, []);

// Função que atualiza a página
// É chamada quando o botão 'atualizar' é pressionado
    const updateFetch = () => {
        window.location.reload();
    };

// Função chamada toda vez que novas operações são resgatadas para serem renderizadas
// Recebe um array de objetos (operações) e retorna um objeto com os atributos dos nomes das lojas e seus saldos (valores somados)
    const calculateSaldoTotals = (operationsData) => {
        const totals = {};

        operationsData.forEach((operation) => { //Cada objeto no array tem seu atribo NomeLoja linkado ao atributo valor
            const { nomeLoja, valor } = operation;

            if (totals[nomeLoja]) { // Se a loja em questão já passou pela iteração, o valor será adicionado ao saldo total
                totals[nomeLoja] += parseFloat(valor); 
            } else {
                totals[nomeLoja] = parseFloat(valor);
            }
        });
        return totals;
    };

    return (
        <div>
            <br />
            {operations.length > 0 ? ( //Se houver operações salvas por esse usuário, a tabela é renderizada
            <div>
            <br/><h3>Operações Salvas:</h3>
            <button onClick={updateFetch}>Atualizar</button>
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
                    <th scope="col">Saldo da Loja</th>
                </tr>
                </thead>
                <tbody>
                {operations.slice().reverse().map((item) => ( //É realizada uma iteração por cada operação, onde as operações mais novas tornam-se linhas da tabela
                <tr key={item._id}>
                    <td>{item.tipo}</td>
                    <td>{item.data}</td>
                    <td>{item.valor}R$</td>
                    <td>{item.cpf}</td>
                    <td>{item.cartao}</td>
                    <td>{item.nomeDono}</td>
                    <td>{item.nomeLoja}</td>
                    <td>{(/*Saldo total é arrendondado*/ saldoTotals[item.nomeLoja] || 0).toFixed(2)}R$</td>
                </tr>
                ))}
                </tbody>
            </table>
            </div>
            ) : ( // Quando não se tem operações salvas, a tabela não é renderizada
            <div>
            <br/><h1>Você não tem operações salvas.</h1>
            <button onClick={updateFetch}>Atualizar</button>
            </div>
            )}
            <br />
        </div>
    );
}

export default OperationsTable