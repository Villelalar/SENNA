import '../../../CSS/Screen/booksScreen.css'

import { usePathname, useRouter } from 'expo-router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Home from '@mui/icons-material/Home';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import MenuBook from '@mui/icons-material/MenuBook';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import Person from '@mui/icons-material/Person';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import SportsEsports from '@mui/icons-material/SportsEsports';
import SportsEsportsOutlined from '@mui/icons-material/SportsEsportsOutlined';
import CardLivroEscolhido from '../../components/CardLivroEscolhido';
import CardPrograma from '../../components/CardPrograma';

// Dados fictícios, só para demonstrar. Quando existir uma API,
// basta preencher esta lista com a resposta dela neste mesmo formato.
const programasDemo = [
    { id: '021', totalPerguntas: 30, respondidas: 12 },
    { id: '022', totalPerguntas: 30, respondidas: 0 },
    { id: '023', totalPerguntas: 30, respondidas: 0 },
    { id: '024', totalPerguntas: 30, respondidas: 0 },
    { id: '025', totalPerguntas: 30, respondidas: 0 },
];

// Mesmas cores usadas em fimProgramaScreen.jsx (vermelho, marrom, azul, verde).
const coresDosProgramas = ['#d62929', '#875700', '#1561b9', '#18864a'];

// rota: null significa que a página ainda não existe no projeto.
// Quando ela for criada, basta trocar o null pelo caminho, que é o nome do
// arquivo em src/app (ex.: '/games' para o arquivo games.jsx).
const itensNavegacao = [
    { rotulo: 'Início', rota: '/home', icone: HomeOutlined, iconeAtivo: Home },
    { rotulo: 'Jogos', rota: '/games', icone: SportsEsportsOutlined, iconeAtivo: SportsEsports },
    { rotulo: 'Livros', rota: '/book', icone: MenuBookOutlined, iconeAtivo: MenuBook },
    { rotulo: 'Perfil', rota: null, icone: PersonOutlined, iconeAtivo: Person },
];

const BookScreen = () => {
    const router = useRouter();
    const pathname = usePathname();

    const perguntasRespondidas = programasDemo.reduce(
        (soma, programa) => soma + programa.respondidas,
        0,
    );

    function abrirPrograma(programa) {
        router.push({ pathname: '/jogocap', params: { programa: programa.id } });
    }

    function aoSelecionarNavegacao(item, ativo) {
        if (item.rota === null) {
            window.alert('Esta opção está indisponível.');
            return;
        }

        if (ativo) return;

        router.replace(item.rota);
    }

    return (
        <>
            <div className="container-book">
                <header className="header_games">
                    <div className="header_top">
                        <button className="row_back_book" type="button" aria-label="Voltar">
                            <ArrowBack />
                        </button>
                        <h1>Livros</h1>
                    </div>

                    <div className="livro">
                        <CardLivroEscolhido
                            titulo="Início Ayrton Senna"
                            programas={programasDemo}
                            perguntasRespondidas={perguntasRespondidas}
                        />
                    </div>
                </header>

                <main className="programas">
                    <h2 className="programas_titulo">Programas do livro</h2>

                    <ul className="programas_lista">
                        {programasDemo.map((programa, indice) => (
                            <li key={programa.id}>
                                <CardPrograma
                                    id={programa.id}
                                    respondidas={programa.respondidas}
                                    totalPerguntas={programa.totalPerguntas}
                                    cor={coresDosProgramas[indice % coresDosProgramas.length]}
                                    onSelecionar={() => abrirPrograma(programa)}
                                />
                            </li>
                        ))}
                    </ul>
                </main>

                <nav className="navigationBar_games" aria-label="Navegação principal">
                    {itensNavegacao.map((item) => {
                        const ativo = item.rota !== null && pathname === item.rota;
                        const Icone = ativo ? item.iconeAtivo : item.icone;

                        return (
                            <button
                                key={item.rotulo}
                                type="button"
                                className={ativo ? 'nav_item active' : 'nav_item'}
                                aria-current={ativo ? 'page' : undefined}
                                onClick={() => aoSelecionarNavegacao(item, ativo)}
                            >
                                <Icone aria-hidden="true" />
                                <span>{item.rotulo}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    )
}

export default BookScreen