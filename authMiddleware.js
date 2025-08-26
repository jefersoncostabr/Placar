// authMiddleware.js
import bcrypt from 'bcrypt';
import conectaNaDatabase from './src/config/dbConnect.js';
import mongoose from 'mongoose';

// Func que verifica a autenticação do usuário via Basic Auth
export async function basicAuth(req, res, next) {    
    // verifica se o cabeçalho Authorization está presente
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Acesso a área protegida"');
        return res.status(401).send('Requer cadastro');
    }

    // extrai e decodifica as credenciais de usiario e senha
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    // usar split na primeira ocorrência de ':' (mais robusto)
    const idx = credentials.indexOf(':');
    const username = credentials.slice(0, idx);
    const password = credentials.slice(idx + 1);

    // verifica se o usuário existe e se a senha está correta
    try {
        const conexao = await conectaNaDatabase();
        console.log('Conexão:', conexao);
        if (!conexao) {
            console.error('Erro ao estabelecer conexão com o banco de dados');
            res.status(500).send('Erro interno do servidor');
            return;
        }
        const db = conexao.db();
        const usuariosCollection = db.collection('usuarios');
        const user = await usuariosCollection.findOne({ username });

        if (!user){
            res.set('WWW-Authenticate', 'Basic realm="Acesso a área protegida"');
            return res.status(401).send('Credencial inválida ou erro de digitação');
        } 

        // se o usuário existir copara a senha
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            res.set('WWW-Authenticate', 'Basic realm="Acesso a área protegida"');
            return res.status(401).send('Credencial inválida ou erro de digitação');
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
}

// Middleware que autentica automaticamente com usuário e senha predefinidos
export async function autoAuth(req, res, next) {
    // Defina aqui o usuário e senha desejados
    const username = 'adm';
    const password = 'senhaErrada';

    // Procura o usuário na lista
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).send('Usuário padrão não encontrado');

    // Compara a senha fornecida com o hash salvo
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).send('Senha padrão inválida');

    req.user = user;
    
    next();
}

export function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send('Accesso Negado');
    }
    next();
  };
}