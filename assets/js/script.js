document.addEventListener("DOMContentLoaded", () => {
    // --- SELEÇÃO DE ELEMENTOS ---

    // Elementos dos Alternadores
    const radioProjetivo = document.querySelector("#radio-projetivo");
    const radioBazin = document.querySelector("#radio-bazin");

    // Seções
    const secaoProjetivo = document.querySelector("#secao-projetivo");
    const secaoHistorico = document.querySelector("#secao-historico");

    // Formulários
    const formProjetivo = document.querySelector("#form-projetivo");
    const formBazin = document.querySelector("#form-bazin");

    // Inputs do formulário Projetivo
    const tickerProjetivoInput = document.querySelector("#ticker-projetivo");
    const cotacaoProjetivoInput = document.querySelector("#cotacao-projetivo");
    const quantidadePapeisInput = document.querySelector("#total-acoes-projetivo");
    const lucroLiquidoInput = document.querySelector("#lucro-projetivo");
    const payoutInput = document.querySelector("#payout-projetivo");
    const yieldProjetivoInput = document.querySelector("#yield-projetivo");
    const cleannerButtonProjetivo = document.querySelector("#cleanner-button");

    // Inputs do formulário Bazin
    const tickerBazinInput = document.querySelector("#ticker-bazin");
    const cotacaoBazinInput = document.querySelector("#cotacao-bazin");
    const mediaDividendoInput = document.querySelector("#media-bazin");
    const yieldBazinInput = document.querySelector("#yield-bazin");
    const cleannerButtonBazin = document.querySelector("#cleanner-button-bazin");

    // Tabela e Dashboard
    const corpoTabela = document.querySelector("#historico-tabela-corpo");
    const paragrafoVazio = document.querySelector("#historico-vazio");
    const contadorDashboard = document.querySelector("#dashboard p");

    let historicoDeCalculos = [];

    // --- FUNÇÕES ---

    // Alterna a visibilidade entre as calculadoras
    function alterarVisibilidade() {
        if (radioProjetivo.checked) {
            secaoProjetivo.classList.remove("hidden");
            secaoHistorico.classList.add("hidden");
        } else {
            secaoProjetivo.classList.add("hidden");
            secaoHistorico.classList.remove("hidden");
        }
    }

    // Formata o input para um padrão de moeda (ex: 1.234,56)
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

    // Converte o valor formatado de volta para um número (float)
    function desformatarNumero(valorFormatado) {
        if (!valorFormatado) return 0;
        let apenasDigitos = valorFormatado.replace(/\D/g, "");
        if (apenasDigitos === "") return 0;
        return parseFloat(apenasDigitos) / 100;
    }

    // Adiciona uma nova linha à tabela de histórico
    function adicionarLinhaTabela(dados, index) {
        const linha = document.createElement('tr');
        linha.classList.add("text-center", "hover:bg-gray-50");
        linha.setAttribute('data-index', index);

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

    // Calcula o Preço Teto pelo método Projetivo
    function calcularPrecoTetoProjetivo(lucro, quantidadePapeis, payout, yieldMinimo) {
        const lpa = lucro / quantidadePapeis;
        const dpa = lpa * payout;
        const precoTeto = dpa / yieldMinimo;
        return { lpa, dpa, precoTeto };
    }
    
    // Calcula o Preço Teto pelo método Bazin
    function calcularPrecoTetoBazin(mediaDividendos, yieldMinimo) {
        const precoTeto = mediaDividendos / yieldMinimo;
        return { precoTeto };
    }

    // Salva o histórico de cálculos no localStorage
    function salvarHistorico(){
        localStorage.setItem('historicoCalculos', JSON.stringify(historicoDeCalculos));
    }

    // Carrega o histórico de cálculos do localStorage
    function carregarHistorico(){
        const dadosSalvos =  localStorage.getItem('historicoCalculos');
        if(dadosSalvos){
            historicoDeCalculos = JSON.parse(dadosSalvos);
            atualizarTabela();
        }
    }

    // Verifica se a tabela está vazia para mostrar/esconder a mensagem
    function verificarTabelaVazia(){
        if(historicoDeCalculos.length === 0){
            if(paragrafoVazio) paragrafoVazio.classList.remove('hidden');
        }else{
            if(paragrafoVazio) paragrafoVazio.classList.add('hidden');
        }
    }

    // Atualiza a exibição da tabela e o contador do dashboard
    function atualizarTabela(){
        corpoTabela.innerHTML = '';
        historicoDeCalculos.forEach((dados, index) => {
            adicionarLinhaTabela(dados, index);
        });
        contadorDashboard.textContent = `${historicoDeCalculos.length} Cálculo(s) Salvo(s)`;
        verificarTabelaVazia();
    }

    // --- EVENT LISTENERS ---

    // Listeners para formatação de inputs numéricos
    cotacaoProjetivoInput.addEventListener('input', (event) => formatarInputComoNumero(event.target));
    lucroLiquidoInput.addEventListener('input', (event) => formatarInputComoNumero(event.target));
    cotacaoBazinInput.addEventListener('input', (event) => formatarInputComoNumero(event.target));
    mediaDividendoInput.addEventListener('input', (event) => formatarInputComoNumero(event.target));

    // Listeners para alternar entre calculadoras
    radioBazin.addEventListener("change", alterarVisibilidade);
    radioProjetivo.addEventListener("change", alterarVisibilidade);

    // Listener para o formulário PROJETIVO
    formProjetivo.addEventListener("submit", (event) => {
        event.preventDefault();

        const ticker = tickerProjetivoInput.value.toUpperCase();
        const cotacao = desformatarNumero(cotacaoProjetivoInput.value);
        const lucro = desformatarNumero(lucroLiquidoInput.value);
        const papeis = parseFloat(quantidadePapeisInput.value.replace(/\D/g, ""));
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

        historicoDeCalculos.push(dadosParaHistorico);
        salvarHistorico();
        atualizarTabela();
        formProjetivo.reset();
    });

    // Listener para o formulário BAZIN
    formBazin.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const ticker = tickerBazinInput.value.toUpperCase();
        const cotacao = desformatarNumero(cotacaoBazinInput.value);
        const mediaDividendos = desformatarNumero(mediaDividendoInput.value);
        const yieldDesejado = parseFloat(yieldBazinInput.value) / 100;

        if (isNaN(cotacao) || isNaN(mediaDividendos) || isNaN(yieldDesejado) || yieldDesejado === 0 || cotacao === 0) {
            alert("Não foi possível calcular. Verifique se todos os campos foram preenchidos com números válidos.");
            return;
        }

        const resultadosCalculo = calcularPrecoTetoBazin(mediaDividendos, yieldDesejado);
        const margemSeguranca = (resultadosCalculo.precoTeto / cotacao) - 1;

        const dadosParaHistorico = {
            ticker: ticker,
            tipo: "Bazin",
            cotacao: cotacao.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }),
            precoTeto: resultadosCalculo.precoTeto.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }),
            margem: margemSeguranca.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 }),
            dpa: mediaDividendos.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }), // No método Bazin, o DPA é a média informada
            lpa: "N/A", // Não aplicável no método Bazin
            yieldDesejado: yieldDesejado.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 }),
            data: new Date().toLocaleDateString('pt-BR'),
            margemSegurancaPercentual: margemSeguranca
        };

        historicoDeCalculos.push(dadosParaHistorico);
        salvarHistorico();
        atualizarTabela();
        formBazin.reset();
    });
    
    // Listener para deleção de itens na tabela (usando delegação de eventos)
    corpoTabela.addEventListener('click', (event) => {
        const botaoExcluir = event.target.closest('.trash-icon');
        if (botaoExcluir) {
            const linha = botaoExcluir.closest('tr');
            const index = parseInt(linha.dataset.index, 10);
            
            historicoDeCalculos.splice(index, 1);
            
            salvarHistorico();
            atualizarTabela();
        }
    });

    // Listeners para os botões de limpar formulários
    cleannerButtonProjetivo.addEventListener('click', (event) => {
        event.preventDefault();
        formProjetivo.reset();
    });

    cleannerButtonBazin.addEventListener('click', (event) => {
        event.preventDefault();
        formBazin.reset();
    });

    // --- INICIALIZAÇÃO ---
    alterarVisibilidade();
    carregarHistorico();
});