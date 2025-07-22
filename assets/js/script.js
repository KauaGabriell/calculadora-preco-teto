/*Script executado apenas se o conteúdo HTML for carregado totalmente*/
document.addEventListener("DOMContentLoaded", () => {
    //Seleção de Elementos
    //Controle de Navegação(ABAS)
    const radioProjetivo = document.querySelector("#radio-projetivo");
    const radioBazin = document.querySelector("#radio-bazin");

    //Seções
    const secaoProjetivo = document.querySelector("#secao-projetivo");
    const secaoHistorico = document.querySelector("#secao-historico");

    //Formulários
    const formProjetivo = document.querySelector("#form-projetivo");
    const formBazin = document.querySelector("#form-bazin");

    //Elementos do Preço Teto Projetivo
    const quantidadePapeis = document.querySelector("#total-acoes-projetivo");
    const lucroLiquido = document.querySelector("#lucro-projetivo");
    const payoutInput = document.querySelector("#payout-projetivo");
    const yieldProjetivoInput = document.querySelector("#yield-projetivo");

    //Função para controle de navegação de calculadoras.
    function alterarVisibilidade() {
        if (radioProjetivo.checked) {
            secaoProjetivo.classList.remove("hidden");
            secaoHistorico.classList.add("hidden");
        } else {
            secaoProjetivo.classList.add("hidden");
            secaoHistorico.classList.remove("hidden");
        }
    }

    radioBazin.addEventListener("change", alterarVisibilidade);
    radioProjetivo.addEventListener("change", alterarVisibilidade);
    alterarVisibilidade();

    //Função para calcular o preço teto projetivo da ação
    function calcularPrecoTetoProjetivo(
        lucro,
        quantidadePapeis,
        payout,
        yieldMinimo
    ) {
        const lpa = lucro / quantidadePapeis;
        const dpa = lpa * payout;
        const precoTeto = dpa / yieldMinimo;

        return {
            lpa: lpa,
            dpa: dpa,
            precoTeto: precoTeto
        };
    }

    //Função para construir as linhas da tabela
    function adicionarLinhaTabela(dados) {
        const linha = document.createElement('tr');
        const tbody = document.querySelector('#historico-tabela-corpo');
        linha.classList.add("border-b", "text-center");

        linha.innerHTML = `
    <td class="p-2">${dados.ticker}</td>
    <td class="p-2">${dados.tipo}</td>
    <td class="p-2">${dados.cotacao}</td>
    <td class="p-2">${dados.precoTeto}</td>
    <td class="p-2">${dados.margem}</td>
    <td class="p-2">${dados.dpa}</td>
    <td class="p-2">${dados.lpa}</td>
    <td class="p-2">${dados.yield}</td>
    <td class="p-2">${dados.data}</td>
    <td class="p-2">
        <span class="trash-icon">
            <img class="w-6 items-center" src="assets/img/trash.png" alt="">
         </span>
    </td>
    `;

        tbody.appendChild(linha);
    }

    //Evento de enviar formulário
    formProjetivo.addEventListener("submit", (event) => {
        event.preventDefault();
        const lucro = parseFloat(lucroLiquido.value);
        const papeis = parseFloat(quantidadePapeis.value);
        const payout = parseFloat(payoutInput.value) / 100;
        const yieldProjetivo = parseFloat(yieldProjetivoInput.value) / 100;
        const cotacao = parseFloat(document.querySelector('#cotacao-projetivo').value);
        const ticker = document.querySelector('#ticker-projetivo').value;

        const resultadoCalculo = calcularPrecoTetoProjetivo(
            lucro,
            papeis,
            payout,
            yieldProjetivo
        );

        const margemSeguranca = (resultadoCalculo.precoTeto / cotacao) - 1;

        if(resultadoCalculo && !isNaN(resultadoCalculo.precoTeto) && isFinite(resultadoCalculo.precoTeto)){
            const dadosParaHistorico = {
                ticker: ticker,
                tipo: "Projetivo",
                cotacao: cotacao.toLocaleString('pt-BR', {
                    style: "currency",
                    currency: "BRL",
                }),
                precoTeto: parseFloat(resultadoCalculo.precoTeto).toLocaleString('pt-BR', {
                    style: "currency",
                    currency: "BRL",
                }),
                margem: margemSeguranca.toLocaleString('pt-BR', {
                    style: "percent",
                    minimumFractionDigits: 2,
                }),
                dpa: parseFloat(resultadoCalculo.dpa).toLocaleString('pt-BR', {
                    style: "currency",
                    currency: "BRL",
                }),
                lpa: parseFloat(resultadoCalculo.lpa).toLocaleString('pt-BR', {
                    style: "currency",
                    currency: "BRL",
                }),
                yield: (yieldProjetivo * 100).toLocaleString('pt-BR', {
                    style: "percent",
                    minimumFractionDigits: 2,
                }),
                data: new Date().toLocaleDateString('pt-BR')
            };
            adicionarLinhaTabela(dadosParaHistorico);
        } else {
            alert("Não foi possível calcular. Verifique se os campos foram preenchidos corretamente!!");
        }
    });
});
