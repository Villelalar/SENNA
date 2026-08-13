# Pense Bem 🎮📖

## Sobre o projeto

**Pense Bem** é uma recriação inspirada no clássico aparelho da **Tec Toy**, um dos brinquedos eletrônicos mais icônicos do Brasil nos anos 90 e 2000. O produto original funcionava em conjunto com a revista *Pense Bem*, que trazia códigos numéricos impressos em suas páginas. Ao digitar esses códigos no aparelho, ele "reconhecia" a pergunta correspondente e o jogador respondia usando os botões físicos — misturando leitura, jogo e interatividade de um jeito único para a época.

Este projeto busca recriar essa experiência de forma digital: um sistema onde perguntas são cadastradas e associadas a códigos, podendo ser consultadas e respondidas através de uma aplicação web, com os dados armazenados em um banco de dados MongoDB.

### Objetivo

Resgatar e homenagear um marco da cultura de brinquedos eletrônicos brasileiros, aplicando conceitos de desenvolvimento back-end com Node.js, Express e MongoDB.

---

## Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript
- **Express** — framework para criação do servidor e das rotas
- **Mongoose** — modelagem e comunicação com o MongoDB
- **MongoDB Atlas** — banco de dados na nuvem
- **Dotenv** — gerenciamento de variáveis de ambiente
- **Nodemon** — reinício automático do servidor durante o desenvolvimento

---

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [npm](https://www.npmjs.com/) (já vem junto com o Node.js)
- Uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) com um cluster criado

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd pense-bem
```

### 2. Instale as dependências

Este é um projeto **Node.js**, então as dependências são gerenciadas pelo `package.json` e instaladas com o `npm` — não é necessário (nem existe) um `requirements.txt` funcional aqui, já que esse formato é específico de projetos em Python.

```bash
npm install
```

Isso vai instalar automaticamente tudo que está listado no `package.json`:

```json
{
  "dependencies": {
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongoose": "^9.9.2",
    "nodemon": "^3.1.14"
  }
}
```

> 📄 **Nota sobre requirements.txt:** caso seja exigido pela disciplina um arquivo de referência no formato `requirements.txt` (mesmo não sendo funcional em Node.js), segue a lista equivalente para fins de documentação:
> ```
> dotenv==17.4.2
> express==5.2.1
> mongoose==9.9.2
> nodemon==3.1.14
> ```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo, substituindo pelos seus dados do MongoDB Atlas:

```dotenv
MONGODB_USERNAME="seu_usuario"
MONGODB_PASSWORD="sua_senha"
MONGODB_URI="mongodb+srv://seu_usuario:sua_senha@seu-cluster.mongodb.net/pensebem"
```

⚠️ **Importante:** o arquivo `.env` contém credenciais sensíveis e **não deve ser enviado ao GitHub**. Verifique se ele está listado no `.gitignore`.

### 4. Rode o projeto

Para rodar em modo de desenvolvimento (reinicia sozinho a cada alteração):

```bash
npm run dev
```

Para rodar em modo normal:

```bash
npm start
```

Se tudo estiver certo, você verá no terminal:

```
Database On
Projeto ON
```

O servidor estará disponível em `http://localhost:3000`.

---

## Estrutura do projeto

```
pense-bem/
├── src/
│   └── index.js        # Arquivo principal do servidor
├── .env                 # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
└── README.md
```

---

## Autor

Desenvolvido por Larissa Villela, Pedro Henrique , Matheus Gomes e Thomas Andrew como projeto acadêmico.