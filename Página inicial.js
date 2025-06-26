let db = null;
let diasRest = 0, todosSaldos = [];

document.getElementById("subtrairSOULimeira").onclick = function()
{
    if(todosSaldos[0] == 0) window.alert("Não há saldo para subtrair");
    else
    {
        const transacao = db.transaction("Empresas", "readwrite");
        const store = transacao.objectStore("Empresas");

        const request = store.get(1);

        request.onsuccess = (event) =>
        {
            empresa = request.result;
            
            if(empresa.passagem.saldo < empresa.passagem.valorUnit)
            {
                window.alert("Não há saldo sufuciente para ser debitado");
                return;
            }
            else empresa.passagem.saldo = Math.max(empresa.passagem.saldo - empresa.passagem.valorUnit);

            const uptadeRequest = store.put(empresa);
            uptadeRequest.onsuccess = (event) => 
            {
                window.alert(`Uma viagem foi debitada em ${empresa.nome}`);
                atualizarDados();
            }
        } 
    }
}

document.getElementById("subtrairSOUAmericana").onclick = function()
{
    if(todosSaldos[1] == 0) window.alert("Não há saldo para subtrair");
    else
    {
        const transacao = db.transaction("Empresas", "readwrite");
        const store = transacao.objectStore("Empresas");

        const request = store.get(2);

        request.onsuccess = (event) =>
        {
            empresa = request.result;
            
            if(empresa.passagem.saldo < empresa.passagem.valorUnit)
            {
                window.alert("Não há saldo sufuciente para ser debitado");
                return;
            }
            else empresa.passagem.saldo = Math.max(empresa.passagem.saldo - empresa.passagem.valorUnit);

            const uptadeRequest = store.put(empresa);
            uptadeRequest.onsuccess = (event) => 
            {
                window.alert(`Uma viagem foi debitada em ${empresa.nome}`);
                atualizarDados();
            }
        } 
    }
}

document.getElementById("subtrairPiracicabana").onclick = function()
{
    if(todosSaldos[2] == 0) window.alert("Não há saldo para subtrair");
    else
    {
        const transacao = db.transaction("Empresas", "readwrite");
        const store = transacao.objectStore("Empresas");

        const request = store.get(3);

        request.onsuccess = (event) =>
        {
            empresa = request.result;
            
            if(empresa.passagem.saldo < empresa.passagem.valorUnit)
            {
                window.alert("Não há saldo sufuciente para ser debitado");
                return;
            }
            else empresa.passagem.saldo = Math.max(empresa.passagem.saldo - empresa.passagem.valorUnit);

            const uptadeRequest = store.put(empresa);
            uptadeRequest.onsuccess = (event) => 
            {
                window.alert(`Uma viagem foi debitada em ${empresa.nome}`);
                atualizarDados();
            }
        } 
    }
}

document.getElementById("subtrairDia").onclick = function()
{
    if(diasRest == 0) window.alert("Não há dias para subtrair");
    else
    {
        const transacao = db.transaction("Empresas", "readwrite");
        const store = transacao.objectStore("Empresas");

        const ids = [1,2,3];
        let count = 0;

        ids.forEach((id, i) =>
        {
            const request = store.get(id);

            request.onsuccess = (event) =>
            {
                const empresa = request.result;

                empresa.passagem.saldo = Math.max(0,empresa.passagem.saldo - empresa.passagem.valorPDia);
                count++;
                const uptadeRequest = store.put(empresa);
                if(count == ids.length)
                {
                    window.alert("Um dia restante foi subtraido");
                    atualizarDados();
                }
            }
        });
    }
}

function atualizarViagens(viagens, ids)
{
    for(let i = 0; i < ids.length; i++)
    {
        switch(i)
        {
            case 0:
                document.getElementById("viagensSOULimeira").textContent = `${viagens[i]}`;
                break;
            case 1:
                document.getElementById("viagensSOUAmericana").textContent = `${viagens[i]}`;
                break;
            case 2:
                document.getElementById("viagensPiracicabana").textContent = `${viagens[i]}`;
                break;
        }
    }
}

function atualizarDiasRestantes(dias)
{
    let menorDia = dias[0];

    for(let i = 0; i < 3; i++) if(dias[i] < menorDia) menorDia = dias[i];

    document.getElementById("diasRestantes").textContent = `Dias restantes: ${menorDia}`;
    diasRest = menorDia;
}

function calculoDeDiaseViagens(saldo, custo, unit)
{
    let dias = [0,0,0];
    let viagens = [0,0,0];

    for(let i = 0; i < 3; i++)
    {
        if(saldo[i] < custo[i]) dias[i] = 0;
        else dias[i] = Math.floor(saldo[i]/custo[i]); 

        if(saldo[i] < unit[i]) viagens[i] = 0;
        else viagens[i] = Math.floor(saldo[i]/unit[i]);
    }

    const transacao = db.transaction("Empresas", "readwrite");
    const store = transacao.objectStore("Empresas");

    const ids = [1,2,3];
    let count = 0;

    ids.forEach((id, i) =>
    {
        const request = store.get(id);

        request.onsuccess = (event) =>
        {
            const empresa = request.result;
            empresa.passagem.dias = dias[i];
            empresa.passagem.viagens = viagens[i];
            count++;
            
            const uptadeRequest = store.put(empresa);
            
            if(count == ids.length) 
            {
                console.log("Dias e viagens de cada empresa foram atualizados");
                atualizarDiasRestantes(dias, ids);
                atualizarViagens(viagens, ids);
            }
        }
    });
}

function setarCores(status, dias)
{
    if(dias < 2) status.style.backgroundColor = "#FF0000";
    else if(dias >= 2 && dias < 4) status.style.backgroundColor = "#F6FF00";
    else status.style.backgroundColor = "#0DFF00";
}

function atualizarStatus(id, dias)
{
    let status;

    switch(id)
    {
        case 1:

            status = document.getElementById("statusSOULimeira");
            setarCores(status, dias);
            break;

        case 2:

            status = document.getElementById("statusSOUAmericana");
            setarCores(status, dias);
            break;

        case 3:

            status = document.getElementById("statusPiracicabana");
            setarCores(status, dias);
            break;
    }
}
function atualizarDados()
{
    const transacao = db.transaction("Empresas", "readonly");
    const store = transacao.objectStore("Empresas");

    const ids = [1,2,3];
    
    let saldoTotal = 0.0, count = 0;
    let saldos = [], viagens = [], valorPorDia = [], valorUnitario = [], dias = [];

    ids.forEach((id, i) => 
    {
        const request = store.get(id);
        
        request.onsuccess = (event) =>
        {
            const empresa = request.result;
            saldoTotal += empresa.passagem.saldo;

            viagens[i] = empresa.passagem.viagens;
            saldos[i] = empresa.passagem.saldo; 
            dias[i] = empresa.passagem.dias;
            valorPorDia[i] = empresa.passagem.valorPDia;
            valorUnitario[i] = empresa.passagem.valorUnit;
            
            count++;
            
            if(count == ids.length)
            { 
                todosSaldos = saldos;
                calculoDeDiaseViagens(saldos, valorPorDia, valorUnitario);

                atualizarStatus(1, dias[0]);
                atualizarStatus(2, dias[1]);
                atualizarStatus(3, dias[2]);
                document.getElementById("saldo").textContent = `R$ ${saldoTotal.toFixed(2)}`;
                document.getElementById("saldoSOULimeira").textContent = `R$ ${saldos[0].toFixed(2)}`; 
                document.getElementById("saldoSOUAmericana").textContent = `R$ ${saldos[1].toFixed(2)}`;
                document.getElementById("saldoPiracicabana").textContent = `R$ ${saldos[2].toFixed(2)}`;
                document.getElementById("viagensSOULimeira").textContent = `${viagens[0]}`;
                document.getElementById("viagensSOUAmericana").textContent = `${viagens[1]}`;
                document.getElementById("viagensPiracicabana").textContent = `${viagens[2]}`;
            }
        }
    });

    console.log("Banco de dados foi inserido com sucesso");
}

function BancoDeDados()
{
    const request = indexedDB.open("DadosPassagens", 1);

    request.onupgradeneeded = (event) =>
    {
        db = event.target.result;
        const store = db.createObjectStore("Empresas", {keyPath: "id"});
    }
    request.onsuccess = (event) =>
    {
        db = event.target.result;
        const transacao = db.transaction("Empresas", "readwrite");
        const store = transacao.objectStore("Empresas");

        store.add(
            {
                id: 1,
                nome: "Sou Limeira",
                passagem:
                {
                    valorUnit: 2.7,
                    valorPDia: 2.7,
                    viagens: 0,
                    saldo: 0.0,
                    dias: 0
                }
            });

        store.add(
            {
                id: 2,
                nome: "Sou Americana",
                passagem:
                {
                    valorUnit: 2.6,
                    valorPDia: 5.2,
                    viagens: 0,
                    saldo: 0.0,
                    dias: 0
                }
            });

        store.add(
            {
                id: 3,
                nome: "Piracicabana",
                passagem:
                {
                    valorUnit: 7.3,
                    valorPDia: 14.6,
                    viagens: 0,
                    saldo: 0.0,
                    dias: 0
                }
            });

        atualizarDados();
    }
}

const formatarTempo = (numero) => numero.toString().padStart(2, '0');

function DatasHoras()
{
    const agora = new Date();
    const horas = agora.getHours();
    const minutos = agora.getMinutes();
    const hoje = agora.getDay();
    let saudacao = " ";

    const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    document.getElementById("hora").textContent = `${formatarTempo(horas)}:${formatarTempo(minutos)}`;
    document.getElementById("dia").textContent = semana[hoje];

    if(horas >= 0 && horas <= 5) saudacao = "Olá, Boa Madrugada!";
    else if(horas >= 6  && horas < 12) saudacao = "Olá, Bom Dia!";
    else if(horas >= 12 && horas < 18) saudacao = "Olá, Boa Tarde!";
    else saudacao = "Olá, Boa Noite!";

    document.getElementById("saudacoes").textContent = `${saudacao}`;
}

function main()
{
    DatasHoras();
    BancoDeDados();
    setInterval(DatasHoras, 1000);

    if('serviceWorker' in navigator) 
    {
        navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log("Service Worker registrado com sucesso"))
        .catch(error => console.log("Erro ao registrar Service Worker", error));
    }
}
window.onload = main;
