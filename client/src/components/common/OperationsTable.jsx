// Componente que renderiza as tabelas com as operações salvas pelo usuário e guarda a lógica delas
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import "../../assets/css/main.css";


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
        <div className='operationsTable'>
            <br />
            {operations.length > 0 ? ( //Se houver operações salvas por esse usuário, a tabela é renderizada
            <div>
            <br/><h4 className='title'>Operações Salvas:</h4>
            <button className='btn btn-primary' onClick={updateFetch}>Atualizar</button>
            <div className='table-responsive mt-2'>
            <table className="table table-sm">
                <thead>
                <tr>
                    <th className='bg-primary white-font' scope="col">Tipo de Operação</th>
                    <th className='bg-primary white-font' scope="col">Data de Operação</th>
                    <th className='bg-primary white-font' scope="col">Valor da Operação</th>
                    <th className='bg-primary white-font' scope="col">CPF</th>
                    <th className='bg-primary white-font' scope="col">Cartão</th>
                    <th className='bg-primary white-font' scope="col">Nome do Dono</th>
                    <th className='bg-primary white-font' scope="col">Nome da Loja</th>
                    <th className='bg-success white-font' scope="col">Saldo da Loja</th>
                </tr>
                </thead>
                <tbody>
                {operations.slice().reverse().map((item) => ( //É realizada uma iteração por cada operação, onde as operações mais novas tornam-se linhas da tabela
                <tr key={item._id}>
                    <td className='table-primary'>{item.tipo}</td>
                    <td className='table-primary'>{item.data}</td>
                    <td className='table-primary'>{item.valor}R$</td>
                    <td className='table-primary'>{item.cpf}</td>
                    <td className='table-primary'>{item.cartao}</td>
                    <td className='table-primary'>{item.nomeDono}</td>
                    <td className='table-primary'>{item.nomeLoja}</td>
                    <td className='bg-success white-font'>{(/*Saldo total é arrendondado*/ saldoTotals[item.nomeLoja] || 0).toFixed(2)}R$</td>
                </tr>
                ))}
                </tbody>
            </table>
            </div>
            </div>
            ) : ( // Quando não se tem operações salvas, a tabela não é renderizada
            <div>
            <br/><h4 className='title'>Você não tem operações salvas.</h4>
            <button className='btn btn-primary' onClick={updateFetch}>Atualizar</button>
            </div>
            )}
            <br />
        </div>
    );
}

export default OperationsTable