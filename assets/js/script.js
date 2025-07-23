document.addEventListener("DOMContentLoaded", () => {
    // --- SELEÇÃO DE ELEMENTOS ---

    //Elementos dos Alternadores
    const radioProjetivo = document.querySelector("#radio-projetivo");
    const radioBazin = document.querySelector("#radio-bazin");
    //Seções
    const secaoProjetivo = document.querySelector("#secao-projetivo");
    const secaoHistorico = document.querySelector("#secao-historico");
    //Formulários
    const formProjetivo = document.querySelector("#form-projetivo");
    const formBazin = document.querySelector("#form-bazin");
    //Inputs dos formulários
    const tickerProjetivoInput = document.querySelector("#ticker-projetivo");
    const cotacaoProjetivoInput = document.querySelector("#cotacao-projetivo");
    const quantidadePapeisInput = document.querySelector("#total-acoes-projetivo");
    const lucroLiquidoInput = document.querySelector("#lucro-projetivo");
    const payoutInput = document.querySelector("#payout-projetivo");
    const yieldProjetivoInput = document.querySelector("#yield-projetivo");
    //Tabela
    const corpoTabela = document.querySelector("#historico-tabela-corpo");
    const paragrafoVazio = document.querySelector("#historico-vazio");

    // --- FUNÇÕES ---
    function alterarVisibilidade() {
        if (radioProjetivo.checked) {
            secaoProjetivo.classList.remove("hidden");
            secaoHistorico.classList.add("hidden");
        } else {
            secaoProjetivo.classList.add("hidden");
            secaoHistorico.classList.remove("hidden");
        }
    }

    function formatarInputComoNumero(input) {
        let apenasDigitos = input.value.replace(/\D/g, "");
        if (apenasDigitos === "") {
            input.value = "";
            return;
        }
        let numero = parseFloat(apenasDigitos) / 100;
        input.value = numero.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    function desformatarNumero(valorFormatado) {
        if (!valorFormatado) return 0;
        let apenasDigitos = valorFormatado.replace(/\D/g, "");
        if (apenasDigitos === "") return 0;
        return parseFloat(apenasDigitos) / 100;
    }

    function adicionarLinhaTabela(dados) {
        if (paragrafoVazio) paragrafoVazio.classList.add("hidden");
        const linha = document.createElement('tr');
        linha.classList.add("border-b", "text-center", "hover:bg-gray-50");

        linha.innerHTML = `
            <td class="p-2 font-semibold">${dados.ticker}</td>
            <td class="p-2">${dados.tipo}</td>
            <td class="p-2">${dados.cotacao}</td>
            <td class="p-2 font-bold text-green-600">${dados.precoTeto}</td>
            <td class="p-2 font-bold ${dados.margemSegurancaPercentual >= 0 ? 'text-blue-600' : 'text-red-600'}">${dados.margem}</td>
            <td class="p-2">${dados.dpa}</td>
            <td class="p-2">${dados.lpa}</td>
            <td class="p-2">${dados.yieldDesejado}</td>
            <td class="p-2">${dados.data}</td>
            <td class="p-2">
                <button class="trash-icon">
                    <img class="w-5 items-center mx-auto" src="assets/img/trash.png" alt="Excluir cálculo">
                </button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    }

    function calcularPrecoTetoProjetivo(lucro, quantidadePapeis, payout, yieldMinimo) {
        const lpa = lucro / quantidadePapeis;
        const dpa = lpa * payout;
        const precoTeto = dpa / yieldMinimo;
        return { lpa, dpa, precoTeto };
    }

    // --- EVENT LISTENERS ---
    cotacaoProjetivoInput.addEventListener('input', (event) => formatarInputComoNumero(event.target));
    lucroLiquidoInput.addEventListener('input', (event) => formatarInputComoNumero(event.target));

    radioBazin.addEventListener("change", alterarVisibilidade);
    radioProjetivo.addEventListener("change", alterarVisibilidade);

    formProjetivo.addEventListener("submit", (event) => {
        event.preventDefault();

        const ticker = tickerProjetivoInput.value.toUpperCase();
        const cotacao = desformatarNumero(cotacaoProjetivoInput.value);
        const lucro = desformatarNumero(lucroLiquidoInput.value);
        const papeis = parseFloat(quantidadePapeisInput.value);
        const payout = parseFloat(payoutInput.value) / 100;
        const yieldDesejado = parseFloat(yieldProjetivoInput.value) / 100;

        if (isNaN(cotacao) || isNaN(lucro) || isNaN(papeis) || isNaN(payout) || isNaN(yieldDesejado) || papeis === 0 || yieldDesejado === 0 || cotacao === 0) {
            alert("Não foi possível calcular. Verifique se todos os campos foram preenchidos com números válidos.");
            return;
        }

        const resultadosCalculo = calcularPrecoTetoProjetivo(lucro, papeis, payout, yieldDesejado);
        const margemSeguranca = (resultadosCalculo.precoTeto / cotacao) - 1;

        const dadosParaHistorico = {
            ticker: ticker,
            tipo: "Projetivo",
            cotacao: cotacao.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }),
            precoTeto: resultadosCalculo.precoTeto.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }),
            margem: margemSeguranca.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 }),
            dpa: resultadosCalculo.dpa.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }),
            lpa: resultadosCalculo.lpa.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }),
            yieldDesejado: yieldDesejado.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 }),
            data: new Date().toLocaleDateString('pt-BR'),
            margemSegurancaPercentual: margemSeguranca 
        };

        adicionarLinhaTabela(dadosParaHistorico);
        formProjetivo.reset();
    });

    // --- INICIALIZAÇÃO ---
    alterarVisibilidade();
});