/* Arquivo: server/server.js 
  Descrição: Servidor backend com Node.js, Express e Supabase.
*/

// --- IMPORTAÇÕES ---
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// --- CONFIGURAÇÃO INICIAL ---
const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// --- CONEXÃO COM O SUPABASE ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Erro: As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são obrigatórias.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Cliente Supabase inicializado.');

// --- ROTAS DA API ---

// Rota principal para verificar se o servidor está no ar
app.get("/", (req, res) => {
    res.json({ "message": "Servidor do Leitor de Placas (Supabase) está funcionando!" });
});

// Rota para BUSCAR uma placa específica
app.get("/api/plate/:number", async (req, res) => {
    const plateNumber = req.params.number.toUpperCase();
    try {
        const { data, error } = await supabase
            .from('plates')
            .select('*')
            .eq('plate_number', plateNumber)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                 return res.status(404).json({ message: "Placa não encontrada" });
            }
            throw error;
        }
        if (data) {
            res.json({ message: "success", data: data });
        }
    } catch (err) {
        console.error('Erro ao buscar placa:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Rota para INSERIR uma nova placa
app.post("/api/plate", async (req, res) => {
    const { plate_number, owner, financial_status, contact } = req.body;
    if (!plate_number || !owner || !financial_status || !contact) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    try {
        const { data, error } = await supabase
            .from('plates')
            .insert([{ 
                plate_number: plate_number.toUpperCase(), 
                owner, 
                financial_status, 
                contact 
            }])
            .select();

        if (error) {
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Esta placa já existe no banco de dados.' });
            }
            throw error;
        }
        res.status(201).json({ message: "Placa inserida com sucesso!", data: data[0] });
    } catch (err) {
        console.error('Erro ao inserir placa:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://192.168.3.94:${PORT}`);
});

