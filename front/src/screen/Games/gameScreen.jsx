import React from 'react';

import '../../../CSS/Screen/gamesScreen.css';

import { usePathname, useRouter } from 'expo-router';
import ArrowBack from '@mui/icons-material/ArrowBack';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';

const programas = [
    { id: '01', titulo: 'Programa 01', descricao: 'Cap. 1 · não iniciado', progresso: 0, cor: '#d92525' },
    { id: '02', titulo: 'Programa 02', descricao: 'Cap. 1 · não iniciado', progresso: 0, cor: '#946600' },
    { id: '03', titulo: 'Programa 03', descricao: 'Cap. 1 · não iniciado', progresso: 0, cor: '#1565c0' },
    { id: '04', titulo: 'Programa 04', descricao: 'Cap. 1 · não iniciado', progresso: 0, cor: '#2e7d32' },
    { id: '05', titulo: 'Programa 05', descricao: 'Cap. 1 · não iniciado', progresso: 0, cor: '#d92525' },
    { id: '06', titulo: 'Programa 06', descricao: 'Cap. 2 · bloqueado', progresso: 0, cor: '#946600' },
];

// Mesma barra de navegação da tela de Livros (bookScreen.jsx).
// rota: null significa que a página ainda não existe no projeto.
// Quando ela for criada, basta trocar o null pelo caminho, que é o nome do
// arquivo em src/app (ex.: '/games' para o arquivo games.jsx).
const itensNavegacao = [
    { rotulo: 'Início', rota: '/home', icone: HomeOutlinedIcon, iconeAtivo: HomeIcon },
    { rotulo: 'Jogos', rota: '/games', icone: SportsEsportsOutlinedIcon, iconeAtivo: SportsEsportsIcon },
    { rotulo: 'Livros', rota: '/book', icone: MenuBookOutlinedIcon, iconeAtivo: MenuBookIcon },
    { rotulo: 'Perfil', rota: null, icone: PersonOutlinedIcon, iconeAtivo: PersonIcon },
];

const Gamescreen = () => {
    const router = useRouter();
    const pathname = usePathname();
    const total = programas.length;

    // Volta para a tela anterior. Se não houver histórico (ex.: a página foi
    // aberta direto pela URL), leva para a tela inicial (/home).
    function voltar() {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/home');
        }
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
        <div className='containe_principal_games'>
            <header className='header_games'>
                <div className="header_top">
                    <button className="row_back" type="button" aria-label="Voltar" onClick={voltar}>
                        <ArrowBack />
                    </button>
                    <h1>Jogos</h1>
                </div>

                <p className='subtitle_games'>
                    {total} {total === 1 ? 'programa disponível' : 'programas disponíveis'}
                </p>
            </header>

            <main className="content_games">
                {programas.map((item) => (
                    <div key={item.id} className="card_games_container">
                        {/* Badge com o número ID */}
                        <div className="card_games_badge" style={{ backgroundColor: item.cor }}>
                            <span>{item.id}</span>
                        </div>

                        {/* Conteúdo com Título, Subtítulo e Barra de Progresso */}
                        <div className="card_games_content">
                            <h2>{item.titulo}</h2>
                            <p>{item.descricao}</p>

                            {/* Trilho de progresso */}
                            <div className="progress_track">
                                <div
                                    className="progress_fill"
                                    style={{ width: `${item.progresso}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
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
    );
};

export default Gamescreen;