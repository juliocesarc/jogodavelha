const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const path = require ( 'path' );
const mysql = require('mysql2');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: "http://localhost",
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));

app.use(express.json());

const dbConfig = {
    host: 'mysql-aula.cuebxlhckhcy.us-east-1.rds.amazonaws.com',
    user: 'mysqlaula',
    password: 'MySQLAula123!',
    database: 'mysqlaula',
    port: 3306
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