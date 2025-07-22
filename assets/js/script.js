/*Scrit executado apenas se o conteúdo HTML for carregado totalmente*/
document.addEventListener('DOMContentLoaded', () => {

    //Seleção de Elementos 
    //Controle de Navegação(ABAS)
    const radioProjetivo = document.querySelector('#radio-projetivo');
    const radioBazin = document.querySelector('#radio-bazin');

    //Seções
    const secaoProjetivo = document.querySelector('#secao-projetivo');
    const secaoHistorico = document.querySelector('#secao-historico');

    //Formulários
    const formProjetivo = document.querySelector('#form-projetivo');
    const formBazin = document.querySelector('#form-bazin');

    //Elementos do Preço Teto Projetivo
    const quantidadePapeis = document.querySelector('#total-acoes-projetivo');
    const lucroLiquido = document.querySelector('#lucro-projetivo');
    const payoutInput = document.querySelector('#payout-projetivo');
    const yieldProjetivoInput = document.querySelector('#yield-projetivo');

    formProjetivo.addEventListener('submit', (event) => {
        event.preventDefault();
        

        console.log(calcularPrecoTetoProjetivo());
    })
    
    
    
    function calcularPrecoTetoProjetivo(){
        const lpa = lucroLiquido.value / quantidadePapeis.value;
        const payout = payoutInput.value;
        const yieldProjetivo = yieldProjetivoInput.value;        
        const dpa = payout / lpa
        const precoTeto = (dpa / yieldProjetivo) / 100;
        
        return precoTeto;
    }
    
    
    
    radioBazin.addEventListener('change', alterarVisibilidade);
    radioProjetivo.addEventListener('change', alterarVisibilidade);
    alterarVisibilidade();
    //Função para controle de navegação de calculadoras.
    function alterarVisibilidade(){
        if(radioProjetivo.checked){
            secaoProjetivo.classList.remove('hidden');
            secaoHistorico.classList.add('hidden');
        }else{
            secaoProjetivo.classList.add('hidden');
            secaoHistorico.classList.remove('hidden');
        }
    }
});