// routes.js
import express from 'express';
// import bcrypt from 'bcrypt';
// import { users } from './userStore.js';
// import {  authorizeRole, autoAuth, basicAuth } from './authMiddleware.js'; //middleware de autenticação
import routerArtistas from './routes/routesArtistas.js';
// import artista from './src/models/artistas.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('API de autenticação com Express e bcrypt funcionando!');
});

// rota pública c acesso a arquivos estáticos
router.use("/public", express.static("frontEnd/public"));
router.use("/pr", express.static("frontEnd/protected"));

// rota protegida c acesso a arquivos estáticos
// router.use("/protected", basicAuth, express.static("frontEnd/protected"));

router.use('/usArtistas', routerArtistas);



//*****A rota funciona falta auth e role*****
// router.get('/usuarios', async (req, res) => {    
// // router.get('/usuarios', basicAuth, authorizeRole('admin'), (req, res) => {    
//     console.log('Entrou numa rota protegida');
//     const artistasRecebidos = await artista.find({});
//     res.json(artistasRecebidos);
// });

//http://localhost:3000/logout
// router.get('/logout',autoAuth, (req, res) => { 
//     res.set('WWW-Authenticate', 'Basic realm="Switch User"');
//     return res.status(401).send('Faça login novamente');
//     // res.redirect('/segredo');
// });

// No postman coloque POST e o body raw em JSON URL=http://localhost:3000/registro
// No corpo coloque {"username": "seu_usuario", "password": "sua_senha"}
// router.post('/registro', async (req, res) => {
//     console.log('Requisição chegou!');
//     // console.log(req.headers);
//     console.log(req.body);
    
//     //verifica se username e password foram fornecidos
//     if (!req.body) {
//         return res.status(400).json({ error: 'Requisição inválida' });
//     }
//     const { username, password } = req.body;
//     if (!username || !password) return res.status(400).json({ error: 'usuário e senha requeridos' });

//     //verifica se o usuário já existe o que não pode ocorrer
//     if (users.find(u => u.username === username)) {
//         return res.status(400).json({ error: 'Usuario ja cadastrado' });
//     }
//     // cria o hash da senha e armazena o novo usuário
//     //hash é uma criptografia que não pode ser revertida
//     const passwordHash = await bcrypt.hash(password, 10);

//     users.push({ username, passwordHash });
//     res.status(201).json({ username });
//     console.log('Usuários cadastrados:', users);
// });

export default router;