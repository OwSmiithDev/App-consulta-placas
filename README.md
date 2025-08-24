# 🚗 Consulta de Placas

Bem-vindo ao projeto Consulta de Placas! Esta é uma aplicação web simples e eficiente para verificar informações de veículos a partir do número da placa, utilizando um banco de dados hospedado no Supabase.

O projeto foi estruturado para ser seguro e escalável, separando o frontend (interface do usuário) do backend (lógica do servidor), garantindo que suas chaves de acesso ao banco de dados nunca sejam expostas publicamente.

---

## ✨ Funcionalidades

-   **Consulta Manual:** Insira o número de uma placa para buscar as informações correspondentes no banco de dados.
-   **Feedback em Tempo Real:** A interface exibe status de carregamento, sucesso e erro durante a consulta.
-   **Design Responsivo:** Acessível e funcional em dispositivos móveis e desktops.
-   **Arquitetura Segura:** O frontend se comunica com um backend intermediário, que por sua vez acessa o banco de dados, protegendo suas credenciais.

---

## 🛠️ Tecnologias Utilizadas

-   **Frontend:**
    -   HTML5
    -   Tailwind CSS
    -   JavaScript
-   **Backend:**
    -   Python 3
    -   Flask
    -   Gunicorn (para produção)
-   **Banco de Dados:**
    -   Supabase (PostgreSQL)

---

## 🚀 Guia de Implantação Segura

Este guia irá mostrar-lhe como colocar a sua aplicação online de forma segura e profissional, hospedando o frontend no GitHub Pages e o backend em Python no Render.

### Parte 1: Preparar o Backend para a Internet

O seu servidor precisa de um pequeno ajuste para funcionar em produção.

#### 1. Adicionar um Servidor de Produção

O servidor que o Flask usa por defeito é ótimo para testes, mas não para um site real. Vamos adicionar o `gunicorn`, um servidor de produção robusto.

Abra o seu ficheiro `requirements.txt` e adicione `gunicorn` no final. Ele deve ficar assim:

```txt
Flask
Flask-Cors
python-dotenv
supabase-client
gunicorn
```

*(Nota: Adapte a lista acima às dependências exatas do seu projeto)*

#### 2. Configurar Variáveis de Ambiente (`.env`)

Para rodar o backend localmente e de forma segura, crie um arquivo chamado `.env` dentro da sua pasta `server/`. Este arquivo **nunca** deve ser enviado para o GitHub (adicione-o ao seu `.gitignore`).

Dentro do `.env`, coloque suas chaves do Supabase:

```env
SUPABASE_URL=https://SUA_URL_DO_SUPABASE.supabase.co
SUPABASE_KEY=SUA_CHAVE_ANON_PUBLIC_DO_SUPABASE
```

O seu código Python (`server.py`) deve usar uma biblioteca como `python-dotenv` para carregar estas variáveis.

#### 3. Enviar o seu Projeto para o GitHub

Certifique-se de que todo o seu projeto (a pasta `server` e o ficheiro `index.html`) está num repositório no seu GitHub.

### Parte 2: Hospedar o Backend no Render (Seguro e Gratuito)

O Render irá correr o seu `server.py` e guardar as suas chaves do Supabase de forma segura.

1.  **Crie uma Conta:** Vá a [render.com](https://render.com) e crie uma conta gratuita, ligando-a à sua conta do GitHub.

2.  **Crie um Novo "Web Service":**
    -   No painel do Render, clique em **"New +"** e depois em **"Web Service"**.
    -   Escolha o seu repositório do GitHub onde está o projeto.

3.  **Configure o Serviço:**
    -   **Name:** Dê um nome ao seu serviço (ex: `leitor-de-placas-api`).
    -   **Root Directory:** Coloque `server` (para dizer ao Render para olhar para dentro da sua pasta de servidor).
    -   **Runtime:** Escolha `Python 3`.
    -   **Build Command:** `pip install -r requirements.txt`
    -   **Start Command:** `gunicorn server:app` (assumindo que seu arquivo se chama `server.py` e a instância do Flask se chama `app`).
    -   **Instance Type:** Escolha o plano `Free`.

4.  **Adicione as Suas Chaves Secretas (O Passo Mais Importante):**
    -   Antes de criar o serviço, vá até à secção **"Environment"**.
    -   Clique em **"Add Environment Variable"**.
    -   Adicione duas variáveis:
        -   **Key:** `SUPABASE_URL`, **Value:** `https://link.supabase.co` (sua URL)
        -   **Key:** `SUPABASE_KEY`, **Value:** (a sua chave anon public completa)
    -   Adicione também uma variável para o Python:
        -   **Key:** `PYTHON_VERSION`, **Value:** `3.10.6` (ou uma versão recente que você usou)

5.  **Crie o Serviço:**
    -   Clique em **"Create Web Service"**. O Render irá instalar as dependências e iniciar o seu servidor.
    -   Após alguns minutos, o seu backend estará online! O Render irá dar-lhe um URL público, algo como `https://leitorplacas.onrender.com`. **Copie este URL.**

### Parte 3: Hospedar o Frontend no GitHub Pages

1.  **Atualize o `index.html`:**
    -   Abra o seu ficheiro `index.html` localmente.
    -   Encontre a linha onde você define o URL da API. Se antes você se conectava diretamente ao Supabase, agora você irá se conectar ao seu novo backend.
    -   Adicione ou modifique a constante da API para usar o URL que o Render lhe deu. O seu JavaScript deve fazer chamadas para este endereço:

    ```javascript
    const API_URL = '[https://leitorplacas-api.onrender.com](https://leitorplacas-api.onrender.com)';

    // Exemplo de como fazer a chamada
    async function queryPlate(plate) {
        const response = await fetch(`${API_URL}/search/${plate}`);
        const data = await response.json();
        // ...lógica para exibir os dados
    }
    ```

    -   Salve e envie esta alteração para o seu repositório no GitHub.

2.  **Ative o GitHub Pages:**
    -   No seu repositório no GitHub, vá a **"Settings"** > **"Pages"**.
    -   Na secção "Branch", escolha o seu ramo principal (geralmente `main`) e a pasta `/(root)`, e clique em **"Save"**.
    -   O GitHub irá criar um site com o seu `index.html` e dar-lhe um URL público (ex: `https://seu-nome.github.io/leitor-de-placas/`).

Após alguns minutos, o seu site estará online e a comunicar de forma segura com o seu backend, sem nunca expor as suas chaves!
