//Módulo que recebe uma string e valida se esta tem um elemento despadronizado
module.exports = function validaCartao(cartao){
    const padrao = /^\d{4}\*{4}\d{4}$/; //Identifica padrão como 4 números, 4 asteriscos e mais 4 números
    const testeCartao = padrao.test(cartao) ? cartao.replace(/(.{4})(?!$)/g, '$1 ') : "Cartão Inválido!"; //Verifica se o valor se encaixa no padrão e, se encaixar, estrutura o formato dos valores 
    const cartaoTestado = padrao.test(cartao) ? testeCartao.replace(/(.*\s)(?!$)/, '$1**** ') : testeCartao; // Termina de estruturar a string final adicionando mais 4 asteriscos
    return cartaoTestado;
}

