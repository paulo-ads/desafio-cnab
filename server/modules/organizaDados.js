//Módulo que recebe uma string no padrão CNAB e devolve uma matriz onde cada array era uma linha da string
module.exports = function organizaDados(dados) {
    const arrayDados = dados.toString().split("\r\n"); // Divide string em array
    const matrizDados = arrayDados.map((dado) => dado.split("")); // Divide elementos do array em arrays individuais (cada linha torna-se um array)
    return matrizDados;
};