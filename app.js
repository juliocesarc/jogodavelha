require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const path = require ( 'path' );
const mysql = require('mysql2');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: "*", // Permite todas as origens
    methods: "GET,POST", // Métodos permitidos
    allowedHeaders: "Content-Type" // Cabeçalhos permitidos
  }));

app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

app.post("/api/results", (req, res) => {
const {jogador1, jogador2, resultado, data_jogo} = req.body    

const connection = mysql.createConnection(dbConfig);
    
connection.connect((err) => {
if (err) {
console.error('Erro ao conectar ao banco de dados:', err);
return;
}
console.log('Conexão com o banco de dados estabelecida com sucesso.');
});
    
const query = `
INSERT INTO resultados_jogo (jogador1, jogador2, resultado, data_jogo)
VALUES (?, ?, ?, ?)
`;
    
connection.query(query, [jogador1, jogador2, resultado, data_jogo], (err, results) => {
if (err) {
console.error('Erro ao inserir dados no banco de dados:', err);
} else {
console.log('Dados inseridos com sucesso:', results);
}
    
connection.end();
});
});

app.get("/", (req, res) => {
res. sendFile (path. join (__dirname, "public", 'index.html' ));  
}
)

app.listen(port, () => {
console.log(`Servidor rodando na porta ${port}`);
});