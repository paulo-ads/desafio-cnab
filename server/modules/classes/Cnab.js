const validaCartao = require('../validaCartao');
const ValidaCPF = require('./ValidaCPF');

/* Módulo que performa a organização das informações dos arquivos CNAB;
Recebe uma matriz (onde cada array é uma linha da string original) e retorna um array de objetos (onde cada atributo é um campo) */
class CNAB {
    constructor(arrayBruto) {    
        
        //Parseamento do TIPO de operação
        const tipoDeTransacao = {
            "1": "Débito",
            "2": "Crédito",
            "3": "Pix",
            "4": "Financiamento"
        };
  
        this.erro = !["1", "2", "3", "4"].includes(arrayBruto[0]); //Se o primeiro dígito não estiver incluso, retorna erro como true
        this.tipo = tipoDeTransacao[arrayBruto[0]] || "Tipo Inválido!"; // Determina tipo de operação baseado no primeiro dígito
  
        // Parseamento da DATA da operação
        const dataBruta = arrayBruto.slice(1, 9).join('');
        const dataRegEx = dataBruta.match(/(\d{4})(\d{2})(\d{2})/); // Verifica-se se a string recém adquirida encaixa-se nos padrões da expressão regular
  
        if (dataRegEx[2] >= 1 && dataRegEx[2] <= 12 && dataRegEx[3] >= 1 && dataRegEx[3] <= 31) {  //Verifica-se se cada número (dia, mês, ano) está dentro dos limites
            this.data = `${dataRegEx[3]}/${dataRegEx[2]}/${dataRegEx[1]}`;
        } else {
            this.data = "Data Inválida!";
            this.erro = true;
        }
  
        // Parseamento do VALOR da operação
        const valorBruto = arrayBruto.slice(9, 19).join('').replace(/^0+/, '') / 100; //Retira-se os zeros à esquerda e divide-se o número por 100
        if(!/[^0-9]/.test(arrayBruto.slice(9,19).join(''))){ //Verifica-se caso a string inclua um valor não-numérico
            this.valor = valorBruto.toFixed(2) //Caso o valor passe, os números são arredondados
        } else {
            this.erro = true;
            this.valor = "Valor Inválido!"
        };

        // Parseamento do CPF da operação
        const cpfString = arrayBruto.slice(19, 30).join('');
        const cpfObjeto = new ValidaCPF(arrayBruto.slice(19, 30).join('')); //A string é enviada à classe validadora de CPF

        if (cpfObjeto.valida()){ //Através de algorítmos, o método valida checa se o CPF é valido e, se for, retorna true
            this.cpf = cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); //A string é colocada nos moldes de um CPF, com um ponto a cada três dígitos e um hífen antes dos últimos dois
        } else {
            this.cpf = "CPF Inválido!";
            this.erro = true;
        }
        
        // Parseamento do CARTAO da operação
        const cartaoBruto = arrayBruto.slice(30, 42).join(''); 
        this.cartao = validaCartao(cartaoBruto); //A string é enviada ao módulo que verifica se esta está dentro dos padrôes (valores numéricos + asteriscos). O valor retornado será estruturado com mais 4 asteriscos

        // Parseamento do NOME DO DONO na operação
        const nomeDonoBruto = arrayBruto.slice(42, 56).join('').split(' ');
        const nomeDonoMaisculo = nomeDonoBruto.map((nome) => { //A string do nome é organizada com valores maiúsculos nos inicios
            if (nome.length === 0) return '';
            return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
        })
        this.nomeDono = nomeDonoMaisculo.join(' ');

        // Parseamento do NOME DA LOJA na operação
        const nomeLojaBruto = arrayBruto.slice(56).join('').split(' ');
        const nomeLojaMaiusculo = nomeLojaBruto.map((nome) => { //A string do nome é organizada com valores maiúsculos nos inicios
            if (nome.length === 0) return '';
            return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
        })
        this.nomeLoja = nomeLojaMaiusculo.join(' ');

        // Verifica-se se o array tem o tamanho esperado
        if(!arrayBruto.length == 73) this.erro = true;

        // Por uma questão de segurança de dados, os atributos do objeto da operação não podem mais ser modificados
        Object.defineProperty(this, 'erro', { writable: false });
        Object.defineProperty(this, 'tipo', { writable: false });
        Object.defineProperty(this, 'data', { writable: false });
        Object.defineProperty(this, 'valor', { writable: false });
        Object.defineProperty(this, 'cpf', { writable: false });
        Object.defineProperty(this, 'cartao', { writable: false });
        Object.defineProperty(this, 'nomeDono', { writable: false });
        Object.defineProperty(this, 'nomeLoja', { writable: false });

    }
}

module.exports = CNAB;