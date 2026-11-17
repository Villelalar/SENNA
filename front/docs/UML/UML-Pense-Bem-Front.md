# Pense Bem (Senna) · Documentação UML do Front-end

Documentação do front-end (`front/`) em UML. Todos os diagramas foram montados a partir do **código real** do projeto
(Expo + React Native + Expo Router). O back-end (`back/`) aparece apenas como **referência de leitura**: nada nele foi alterado.

> **Como visualizar:** os blocos `mermaid` abaixo renderizam no GitHub e na prévia do VS Code (extensão *Markdown Preview Mermaid Support*).
> Cada diagrama também está exportado em PNG em `img/` (para anexar no trabalho) e o texto-fonte está em `src/*.mmd`.
> Mermaid não tem notação nativa de casos de uso e componentes, então esses dois diagramas usam `flowchart` seguindo a convenção UML.

## Sumário

| # | Diagrama | Tipo UML | Imagem |
|---|----------|----------|--------|
| 1 | Casos de uso | Casos de uso | `img/01-casos-de-uso.png` |
| 2 | Arquitetura em camadas | Componentes | `img/02-arquitetura.png` |
| 3 | Classes do front-end | Classes | `img/03-classes-front.png` |
| 4 | Fluxo de telas | Máquina de estados | `img/04-fluxo-telas.png` |
| 5 | Navegação pela barra inferior | Sequência | `img/05-sequencia-barra.png` |
| 6 | Seta voltar da tela Jogos | Sequência | `img/06-sequencia-voltar.png` |
| 7 | Domínio do back-end (referência) | Classes | `img/07-dominio-backend.png` |

---

## 1. Casos de uso

Mostra o que o jogador consegue fazer hoje no app. "Cadastrar-se" e "Perfil" aparecem ligados ao aviso de indisponível porque ainda não há integração/página.

```mermaid
flowchart LR
    J(["👤 Jogador"])
    subgraph SIS["Sistema: Pense Bem (front-end mobile)"]
        direction TB
        UC1(["Entrar (login)"])
        UC2(["Cadastrar-se"])
        UC3(["Ver tela inicial"])
        UC4(["Navegar pela barra inferior<br/>Início · Jogos · Livros · Perfil"])
        UC5(["Ver livro e programas"])
        UC6(["Abrir um programa<br/>(tela do jogo)"])
        UC7(["Ver lista de jogos"])
        UC8(["Voltar à tela anterior"])
        UC9(["Ver aviso<br/>'opção indisponível'"])
    end
    J --- UC1
    J --- UC2
    J --- UC3
    J --- UC4
    J --- UC5
    J --- UC6
    J --- UC7
    J --- UC8
    UC4 -. "«include» quando rota = null (Perfil)" .-> UC9
    UC4 -. "«extend» Livros" .-> UC5
    UC4 -. "«extend» Jogos" .-> UC7
    UC5 -. "«include»" .-> UC6
    UC2 -. "«include» (cadastro ainda sem back-end)" .-> UC9
```

## 2. Arquitetura em camadas (componentes)

Cada arquivo em `src/app` (rota) apenas reexporta uma tela de `src/screen`. As telas usam componentes e estilos. Atenção ao detalhe dos **CSS globais**:
`booksScreen.css` e `gamesScreen.css` são importados como efeito colateral e valem para o app inteiro (todas as páginas carregam os dois).

```mermaid
flowchart LR
    subgraph ROTAS["1 · Rotas (src/app)"]
        direction TB
        r0["_layout.tsx<br/>Stack sem cabeçalho"]
        r1["index.tsx<br/>Redirect para /login"]
        r2["login.jsx"]
        r3["signup.jsx"]
        r4["home.jsx"]
        r5["book.jsx"]
        r6["games.jsx"]
        r7["jogocap.jsx"]
        r8["acertopag.jsx"]
        r9["fimprograma.jsx"]
    end
    subgraph TELAS["2 · Telas (src/screen)"]
        direction TB
        s2["Login/loginScreen"]
        s3["SignUp/signUpScreen"]
        s4["Home/homeScreen"]
        s5["Books/bookScreen"]
        s6["Games/gameScreen"]
        s7["JogoCap/jogoCapScreen"]
        s8["AcertoPag/acertoScreen"]
        s9["FimPrograma/fimProgramaScreen"]
    end
    subgraph COMP["3 · Componentes (src/components)"]
        direction TB
        c1["CardLivroEscolhido.jsx"]
        c2["CardPrograma.jsx"]
    end
    subgraph CSS["4 · Estilos"]
        direction TB
        e1["booksScreen.css<br/>GLOBAL"]
        e2["gamesScreen.css<br/>GLOBAL"]
        e3["CardLivroEscolhido.module.css<br/>escopo do componente"]
        e4["CardPrograma.module.css<br/>escopo do componente"]
    end
    subgraph LIBS["5 · Bibliotecas"]
        direction TB
        l1["expo-router<br/>useRouter · usePathname"]
        l2["@mui/icons-material"]
        l3["react-native<br/>react-native-web"]
    end
    BACK[("Back-end Express /api<br/>SOMENTE LEITURA<br/>ainda não consumido")]
    r2 --> s2
    r3 --> s3
    r4 --> s4
    r5 --> s5
    r6 --> s6
    r7 --> s7
    r8 --> s8
    r9 --> s9
    s5 --> c1
    s5 --> c2
    s5 --> e1
    s6 --> e2
    c1 --> e3
    c2 --> e4
    TELAS -.->|usa| LIBS
    TELAS -.->|futuro| BACK
```

## 3. Diagrama de classes do front-end

`BookScreen` e `Gamescreen` têm a **mesma lista de 4 itens de navegação** (`itensNavegacao`). Os tipos de dado são estruturas de objeto do JavaScript (não são classes reais), e
as telas são componentes funcionais de React; o diagrama usa estereótipos para deixar isso explícito.

```mermaid
classDiagram
    direction TB
    class ItemNavegacao {
        <<tipo de dado>>
        +string rotulo
        +string|null rota
        +Componente icone
        +Componente iconeAtivo
    }
    class Programa {
        <<tipo de dado>>
        +string id
        +number totalPerguntas
        +number respondidas
    }
    class ProgramaJogo {
        <<tipo de dado>>
        +string id
        +string titulo
        +string descricao
        +number progresso
        +string cor
    }
    class BookScreen {
        <<tela · rota /book>>
        -List~Programa~ programasDemo
        -List~string~ coresDosProgramas
        -List~ItemNavegacao~ itensNavegacao
        +abrirPrograma(programa)
        +aoSelecionarNavegacao(item, ativo)
    }
    class Gamescreen {
        <<tela · rota /games>>
        -List~ProgramaJogo~ programas
        -List~ItemNavegacao~ itensNavegacao
        +voltar()
        +aoSelecionarNavegacao(item, ativo)
    }
    class CardLivroEscolhido {
        <<componente>>
        +string titulo
        +List~Programa~ programas
        +number perguntasRespondidas
        +string capa
    }
    class CardPrograma {
        <<componente>>
        +string id
        +number respondidas
        +number totalPerguntas
        +string cor
        +onSelecionar()
    }
    BookScreen "1" *-- "4" ItemNavegacao
    Gamescreen "1" *-- "4" ItemNavegacao
    BookScreen "1" *-- "5" Programa
    Gamescreen "1" *-- "6" ProgramaJogo
    BookScreen ..> CardLivroEscolhido : usa
    BookScreen ..> CardPrograma : usa
    CardLivroEscolhido o-- Programa
    note for ItemNavegacao "Mesma lista nas duas telas (Inicio /home, Jogos /games, Livros /book, Perfil null)"
    note for Gamescreen "Navegação via expo-router: useRouter() (push, replace, back, canGoBack) e usePathname()"
    note for BookScreen "Mesma navegação via expo-router (useRouter e usePathname)"
```

## 4. Fluxo de telas

Navegação real implementada hoje (verificada nas chamadas `router.push/replace/back`).

```mermaid
stateDiagram-v2
    direction LR
    AcertoPag : rota /acertopag
    [*] --> Index
    Index --> Login : Redirect /login
    Login --> Home : replace /home<br/>(e-mail e senha preenchidos)
    Login --> SignUp : push /signup
    SignUp --> Login : replace /login
    Book --> JogoCap : push /jogocap<br/>(toque no card do programa)
    Book --> Games : barra "Jogos"<br/>replace /games
    Book --> Home : barra "Início"<br/>replace /home
    Games --> Book : barra "Livros"<br/>replace /book
    Games --> Home : barra "Início"<br/>ou seta voltar sem histórico
    Games --> TelaAnterior : seta voltar com histórico<br/>back
    JogoCap --> Home : seta voltar sem histórico
    JogoCap --> Book : seta voltar com histórico<br/>back
    FimPrograma --> Index : "Voltar ao início"<br/>replace /
    note right of Home
        Todas as opções de Home mostram "indisponível"
        e Home não tem barra de navegação:
        Livros e Jogos só abrem pela URL.
    end note
    note right of Book
        Perfil (rota null) só exibe aviso.
        A seta voltar de Book ainda não tem ação.
    end note
    note right of AcertoPag
        AcertoPag e FimPrograma existem como rotas,
        mas nenhuma tela navega para elas ainda.
    end note
```

## 5. Sequência: navegação pela barra inferior

Regra única, igual nas telas Livros e Jogos. Rotas da barra: **Início** `/home` · **Jogos** `/games` · **Livros** `/book` · **Perfil** `null` (sem página).

```mermaid
sequenceDiagram
    autonumber
    actor U as Jogador
    participant B as Botão .nav_item
    participant T as Tela (Book ou Games)
    participant R as expo-router
    U->>B: clica ou toca em "Jogos"
    B->>T: onClick → aoSelecionarNavegacao(item, ativo)
    alt item.rota === null (Perfil)
        T-->>U: window.alert("Esta opção está indisponível.")
    else ativo === true (já está nessa página)
        T-->>U: nada acontece
    else rota válida
        T->>R: router.replace(item.rota)
        R-->>T: novo pathname (/games)
        T->>T: ativo = (pathname === item.rota)
        T-->>U: tela de destino com o botão em pílula escura<br/>aria-current="page"
    end
    Note over T,R: replace evita empilhar histórico
```

## 6. Sequência: seta voltar na tela Jogos

```mermaid
sequenceDiagram
    autonumber
    actor U as Jogador
    participant S as Seta ArrowBack (Games)
    participant G as Gamescreen
    participant R as expo-router
    U->>S: clica ou toca
    S->>G: onClick → voltar()
    G->>R: router.canGoBack()
    alt existe tela anterior no histórico
        R-->>G: true
        G->>R: router.back()
        R-->>U: tela anterior
    else sem histórico (ex.: página aberta pela URL)
        R-->>G: false
        G->>R: router.replace("/home")
        R-->>U: tela inicial (/home)
    end
```

## 7. Domínio do back-end (somente referência)

Contrato lido de `back/` sem modificar nada. **O front ainda não consome a API.**

```mermaid
classDiagram
    direction LR
    class Livro {
        <<model · coleção livros>>
        +String codigo [unico]
        +String titulo
        +Date createdAt
        +Date updatedAt
    }
    class Pergunta {
        <<model · coleção perguntas>>
        +ObjectId livro
        +Number numero
        +String categoria
        +String enunciado
        +List~String~ alternativas [min 4]
        +String respostaCorreta [oculta nas consultas]
        indice unico (livro, numero)
    }
    class Usuario {
        <<model · coleção usuarios>>
        +String nome
        +String email [unico]
        +String senha [hash bcrypt]
    }
    class Jogo {
        <<catalogo em memoria · 11 jogos>>
        +String slug
        +String nome
        +String descricao
        +String correcao [servidor ou cliente]
    }
    class API {
        <<Express /api · referencia>>
        GET /livros
        GET /livros/:codigo
        GET /livros/:codigo/perguntas
        GET /livros/:codigo/perguntas/:numero
        GET /jogos
        POST /users/create
        POST /users/login
        GET /users/:id
        GET /users/nome/:nome
    }
    Livro "1" <-- "0..*" Pergunta : pertence a
    API ..> Livro
    API ..> Pergunta
    API ..> Usuario
    API ..> Jogo
    note for API "Contrato lido do back-end (somente leitura). O front ainda NAO chama nenhum endpoint."
```

---

## Regras do projeto respeitadas

- Back-end intocado: nenhum arquivo de `back/` foi alterado, criado ou removido.
- Arquitetura preservada: rotas em `src/app`, telas em `src/screen`, componentes em `src/components`.
- O caminho de uma rota é o **nome do arquivo** em `src/app`: `book.jsx` → `/book`, `games.jsx` → `/games`, `home.jsx` → `/home`.
  (`/livros` e `/jogos` são nomes de endpoints da API, **não** rotas do front.)
- A barra usa `router.replace` (e não `push`) para trocar de aba sem empilhar histórico.

## Pontos em aberto (não implementados, listados para transparência)

1. Home ainda não leva a Livros e Jogos (todas as opções mostram "indisponível").
2. A seta voltar da tela **Livros** ainda não tem ação.
3. Perfil não tem página (`rota: null`).
4. `AcertoPag` e `FimPrograma` existem como rotas, mas nenhuma tela navega para elas.
5. Nenhuma tela chama a API do back-end.
6. `booksScreen.css` e `gamesScreen.css` declaram **classes iguais** (`.nav_item`, `.navigationBar_games`, `.header_top`...) com valores diferentes.
   Como ambos são globais e `gamesScreen.css` é carregado por último, o estilo do Games prevalece nas duas telas.
   A barra fica idêntica nas duas (por isso nada foi alterado), mas o ideal futuro é extrair a barra para um componente único.
