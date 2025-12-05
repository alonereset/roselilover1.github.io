const express = require("express");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const CONFIG_PATH = path.join(__dirname, "config.json");
let config = { loginInitial: "M", startDate: "14/02/2022", port: 3000 };
if (fs.existsSync(CONFIG_PATH)) {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH));
}

if (!fs.existsSync("respostas")) fs.mkdirSync("respostas");

app.post("/validar-login", (req, res) => {
    const { user, pass } = req.body;
    const init = String(user).trim().toLowerCase();
    const expectedInit = config.loginInitial.toLowerCase();
    const expectedDate = config.startDate.trim();
    if (init === expectedInit && pass === expectedDate) {
        return res.json({ ok: true });
    }
    res.json({ ok: false, msg: "Credenciais incorretas" });
});

app.post("/salvar", (req, res) => {
    const respostas = req.body;
    const nomeArquivo = `respostas/respostas-${Date.now()}.pdf`;

    const pdf = new PDFDocument();
    pdf.pipe(fs.createWriteStream(nomeArquivo));

    pdf.fontSize(25).text("Respostas do Formulário 💖", { align: "center" });
    pdf.moveDown();

    Object.keys(respostas).forEach((key, i) => {
        pdf.fontSize(16).text(`Pergunta ${i + 1}:`);
        pdf.fontSize(14).text(respostas[key]);
        pdf.moveDown();
    });

    pdf.end();
    res.json({ ok: true });
});

app.listen(config.port, () => console.log("Rodando em http://localhost:" + config.port));
