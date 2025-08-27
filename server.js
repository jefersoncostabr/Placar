// server.js -> npm rum dev
import express from 'express';
import dotenv from 'dotenv';
import router from './routes.js';
import conectaNaDatabase from './src/config/dbConnect.js';



const conexao = await conectaNaDatabase();

conexao.on('error', (err) => console.error('Erro na conexão com o MogoDB', err));

conexao.once('open', () => console.log('Conexão com o mongoDB feita com sucesso!'));

dotenv.config();// pega as var de ambiente do arquivo .env
const app = express();
app.use(express.json());
app.use('/', router);
// app.use('/', routerArtistas);

const PORT = process.env.PORT || 3000;// se não tiver a var de ambiente PORT usa 3000

const msgServidor = `\nServidor rodando na porta ${PORT}\n`;
const segredo = `http://localhost:${PORT}/segredo\n`;
const usuarios = `http://localhost:${PORT}/usuarios\n`;
const logout = `http://localhost:${PORT}/logout\n`;
const index = `http://localhost:${PORT}/public/index.html\n`;
const logar = `http://localhost:${PORT}/public/logar.html\n`;
const regulamento = `http://localhost:${PORT}/protected/regulamento.html\n`;
const scoreBoard = `http://localhost:${PORT}/protected/scoreBoard.html\n`;
const instricaoCadastrar = 'Teste com postman POST Body raw JSON =>';
const urlCadastrar = `http://localhost:${PORT}/registro\n`;
const corpoCadastrar = `No corpo coloque {"username": "seu_usuario", "password": "sua_senha"}\n`;

app.listen(PORT, "0.0.0.0", () => console.log(msgServidor, segredo, usuarios, logout, index, logar, regulamento, scoreBoard, instricaoCadastrar, urlCadastrar, corpoCadastrar));