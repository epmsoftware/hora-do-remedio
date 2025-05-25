
# Hora do Remédio

**Hora do Remédio** é um sistema web para gerenciamento de medicamentos. Permite cadastrar pacientes e seus respectivos medicamentos, com controle de horários para lembretes automáticos.

---

## Objetivo

Fornecer uma aplicação intuitiva para gerenciar a administração de medicamentos, com lembretes em horários programados para cada paciente.

---

## Arquitetura do Projeto

O projeto segue uma arquitetura **MVC simplificada**, com separação clara entre frontend e backend.

```
Hora-do-Remédio/
│
├── backend/                 # Lógica de servidor e banco de dados
│   ├── rotas/               # Arquivos de rotas Express
│   │   ├── autenticacao.js
│   │   ├── medicamentos.js
│   │   └── pacientes.js
│   ├── banco.sqlite         # Banco de dados SQLite
│   ├── db.js                # Inicialização e estrutura do banco
│   └── server.js            # Inicialização do servidor
│
├── frontend/                # Interface do usuário
│   ├── html/                # Páginas HTML
│   ├── css/                 # Estilos
│   ├── javascript/          # Scripts JS
│   ├── images/              # Imagens
│   ├── audio/               # Áudios de lembrete
│   └── video/               # Vídeos informativos (opcional)
│
├── node_modules/            # Dependências Node.js
├── package.json             # Configurações do projeto
└── package-lock.json        # Lock de dependências
```

---

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- SQLite
- bcrypt (para senhas)
- body-parser
- cors

### Frontend
- HTML5
- CSS3
- JavaScript (vanilla)

---

## Estrutura do Banco de Dados

### Tabela: `usuarios`
Armazena dados de autenticação.
```sql
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    senha TEXT NOT NULL
);
```

### Tabela: `pacientes`
Armazena dados dos pacientes.
```sql
CREATE TABLE pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    idade INTEGER,
    peso REAL,
    altura REAL,
    email TEXT,
    telefone TEXT,
    descricao TEXT
);
```

### Tabela: `medicamentos`
Vincula medicamentos a pacientes.
```sql
CREATE TABLE medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    validade TEXT,
    quantidade INTEGER,
    dosagem TEXT,
    descricao TEXT,
    paciente_id INTEGER NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);
```

### Tabela: `frequencias`
Registra os horários de uso de cada medicamento.
```sql
CREATE TABLE frequencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicamento_id INTEGER NOT NULL,
    horario TEXT NOT NULL, -- Ex: '08:00'
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id)
);
```

---

## Funcionamento

1. Usuário faz login ou se cadastra.
2. Cadastra um paciente.
3. Para cada paciente, cadastra medicamentos e horários.
4. O sistema avisa nos horários programados com alertas sonoros/visuais.

---

## Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor backend
```bash
node backend/server.js
```

### 3. Abrir frontend
Abra `frontend/html/inicial.html` no navegador (ou use Live Server).

---

## Melhorias Futuras

- Autenticação com JWT.
- Interface responsiva com TailwindCSS.
- Notificações push (via service workers).
- Exportação de dados em PDF/CSV.
- Painel de relatórios por paciente.

---

## Licença

Projeto educacional. Livre para uso e modificação.
