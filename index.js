const express = require('express');
const { Pool } = require('pg'); // Importe Pool do pacote 'pg'

const app = express();
const PORT = 3000;

// Conexão com o banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'aulaback',
    password: 'ds564',
    port: 5432,
});

app.use(express.json());

// Rota que retorna todos os usuários
app.get('/usuario', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuario');
        res.json({
            total: resultado.rowCount,
            usuario: resultado.rows,
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error.message);
        res.status(500).send('Erro ao buscar usuários');
    }
});

// Rota que crie um novo usuário
app.post( '/usuario', async (req, res) => {
        
     try {
        const { nome, email } = req.body;
        await pool.query('INSERT INTO usuario (nome, email) VALUES ($1, $2)', [nome, email]);
        res.status(201).send('Usuário criado com sucesso!');

     }catch (error) {
         console.error('Erro ao criar usuário:', error.message);
         res.status(500).send('Erro ao criar usuário');
     }

});

// Rota que deleta um usuário
app.delete( '/usuario/:id', async (req, res) => {

    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
        res.send('Usuário deletado com sucesso!');

    } catch (error) {
        console.error('Erro ao deletar usuário:', error.message);
        res.status(500).send('Erro ao deletar usuário');
    }
});

// Rota que atualiza um usuário
app.put( '/usuario/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const { nome, email } = req.body;
        await pool.query('UPDATE usuario SET nome = $1, email = $2 WHERE id = $3', [nome, email, id]);
        res.status(200).send('Usuário atualizado com sucesso!');

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
        res.status(500).send('Erro ao atualizar usuário');
    }
});

// GET usuário pelo id
app.get('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM usuario WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).send('ID não encontrado');
        }else{
            res.json({
              usuario: resultado.rows[0],
            });

        }
    } catch (error) {
        console.error('Erro ao pegar usuário pelo id:', error.message);
        res.status(500).send('Erro ao pegar usuário pelo id');
    }
});


// Rota de teste
app.get('/', (req, res) => {
    res.send('A rota está funcionando perfeitamente!');
});

// Inicializando o servidor
app.listen(PORT, () => {
    console.log(`Server rodando perfeitamente na porta ${PORT}`);
});
