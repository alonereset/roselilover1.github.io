// ------------------- CONTROLE DAS TELAS -------------------

let tela = 1;

function mostrarTela(n) {
    // Remove tela ativa anterior
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));

    // Ativa a tela correta
    const atual = document.getElementById("tela" + n);
    if (atual) {
        atual.classList.add("ativa");
    } else {
        console.error("Tela não encontrada:", "tela" + n);
    }
}

// Inicia na tela 1
mostrarTela(1);

function proximaTela() {
    tela++;
    mostrarTela(tela);
}


// ------------------- SLIDESHOW (5 FOTOS COM 10s) -------------------

let fotos = [
    "fotos/foto1.jpg",
    "fotos/foto2.jpg",
    "fotos/foto3.jpg",
    "fotos/foto4.jpg",
    "fotos/foto5.jpg"
];

let idx = 0;

setInterval(() => {
    idx = (idx + 1) % fotos.length;
    const img = document.getElementById("fotoSlide");
    if (img) img.src = fotos[idx];
}, 10000); // troca a cada 10 segundos



// ------------------- CARREGAR PERGUNTAS -------------------

fetch("/perguntas.json")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("perguntasContainer");

        if (!container) {
            console.error("ERRO: perguntasContainer não encontrado");
            return;
        }

        // Limpa caso já tenha conteúdo
        container.innerHTML = "";

        // Monta as perguntas dinamicamente
        data.perguntas.forEach((p, i) => {
            container.innerHTML += `
                <label>${p}</label>
                <textarea name="pergunta${i}" required></textarea>
            `;
        });
    })
    .catch(err => console.error("Erro ao carregar perguntas:", err));



// ------------------- ENVIAR FORM E IR PARA TELA 4 -------------------

const form = document.getElementById("formRespostas");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const respostas = {};

        formData.forEach((valor, chave) => {
            respostas[chave] = valor;
        });

        await fetch("/salvar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(respostas)
        });

        // Vai para tela final
        proximaTela();
    });
} else {
    console.error("ERRO: formRespostas não encontrado");
}
