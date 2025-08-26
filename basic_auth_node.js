// Estrutura de arquivos sugerida:
// ├── server.js           → Inicialização do app e rotas
// ├── authMiddleware.js   → Middleware Basic Auth
// ├── userStore.js        → Simulação de banco de dados em memória
// ├── routes.js           → Definição de rotas e lógica
// ├── .env                → Variáveis de ambiente

// ===== userStore.js =====
export const users = [];

// ===== authMiddleware.js =====
import bcrypt from 'bcrypt';
import { users } from './userStore.js';

export async function basicAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Access to protected area"');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');

  const user = users.find(u => u.username === username);
  if (!user) {
    res.set('WWW-Authenticate', 'Basic realm="Access to protected area"');
    return res.status(401).send('Usuário não encontrado');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).send('Senha inválida');

  req.user = user;
  next();
}

// ===== routes.js =====
import express from 'express';
import bcrypt from 'bcrypt';
import { users } from './userStore.js';
import { basicAuth } from './authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash });
  res.status(201).json({ username });
});

router.get('/secret', basicAuth, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}!` });
});

export default router;

// ===== server.js =====
import express from 'express';
import dotenv from 'dotenv';
import router from './routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
