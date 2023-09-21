//Módulo que recebe uma string de números e identifica, através de um algorítmo, se esta compôe um CPF válido (se sim, ela o retorna)
module.exports = class ValidaCPF {
    constructor(cpf) {
        Object.defineProperty(this, 'cpfEnviado', {
            writable: false,
            enumerable: true,
            configurable: false,
            value: cpf,
        });
    }
  
    //Para evitar uma brecha no algorítmo, verifica se o cpf possui todos os dígitos repetidos
    cpfRepetido() {
        return this.cpfEnviado.charAt(0).repeat(11) === this.cpfEnviado;
    }

    //Gera dois novos ultimos dígitos baseados no algorítmo do CPF e os adicionam à uma variavel
    geraNovoCpf() {
        const cpfSemDigitos = this.cpfEnviado.slice(0, -2);
        const digito1 = ValidaCPF.geraDigito(cpfSemDigitos);
        const digito2 = ValidaCPF.geraDigito(cpfSemDigitos + digito1);
        this.novoCPF = cpfSemDigitos + digito1 + digito2;
    }
    
        static geraDigito(cpfSemDigitos) {
            let total = 0;
            let reverso = cpfSemDigitos.length + 1;
        
            for(let stringNumerica of cpfSemDigitos) {
                total += reverso * Number(stringNumerica);
                reverso--;
            }
            
            const digito = 11 - (total % 11);
            return digito <= 9 ? String(digito) : '0';
    }

    //Retorna falso (inválido) nos casos de erros e despadronizações
    valida() {
        if(!this.cpfEnviado) return false;
        if(typeof this.cpfEnviado !== 'string') return false;
        if(this.cpfEnviado.length !== 11) return false;
        if(this.cpfRepetido()) return false;
        this.geraNovoCpf();
    
    //Finalmente, verifica se o CPF com os dois ultimos dígitos gerados é igual ao CPF enviado (se sim, é valido)
        return this.novoCPF === this.cpfEnviado; 
    }
}
