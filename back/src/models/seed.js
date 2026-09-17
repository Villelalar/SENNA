/**
 * SEED - "Pense Bem: Fórmula 1" (Nova Cultural / Tec Toy)
 * ---------------------------------------------------------
 * Segue a MESMA estrutura que você já usa no Mongo (coleções
 * "livros" e "perguntas"), só que para este livro cada
 * "Programa" do livro vira um documento em "livros" (como no
 * exemplo do Ayrton Senna que você mostrou), e cada uma das
 * 150 perguntas referencia o "livro" (programa) ao qual pertence.
 *
 * Programa 6 não tem perguntas próprias: o livro avisa que é
 * uma revisão com 6 perguntas sorteadas de cada um dos
 * Programas 1 a 5. Por isso ele existe como "livro" (para você
 * poder montar essa tela), mas sem perguntas atreladas a ele.
 *
 * ATENÇÃO - RESPOSTAS MARCADAS COM "// ⚠"
 * -----------------------------------------
 * O PDF escaneado não traz gabarito impresso (o dispositivo
 * eletrônico "Pense Bem" é que validava as respostas). Preenchi
 * `respostaCorreta` usando fatos reais de F1 (verificados),
 * mas alguns itens dependem de LEITURA VISUAL de imagens do
 * livro (partes do carro, quebra-cabeça, pinturas dos carros) ou
 * de números que não bati 100% com fonte confiável. Esses estão
 * comentados com "// ⚠ verificar" — revise contra o livro físico
 * (ou o gabarito do próprio aparelho, se você ainda o tiver)
 * antes de publicar.
 *
 * Uso:
 *   MONGODB_URI="mongodb://localhost:27017" node seed-formula1.js
 */

import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "pense_bem";

// ---------------------------------------------------------------
// 1) LIVROS (um documento por "Programa" do livro Fórmula 1)
// ---------------------------------------------------------------
const livros = [
  { _id: new ObjectId(), codigo: "011", titulo: "Programa 1 – Ayrton Senna e o Brasil" },
  { _id: new ObjectId(), codigo: "012", titulo: "Programa 2 – Circuitos e a Máquina" },
  { _id: new ObjectId(), codigo: "013", titulo: "Programa 3 – Nelson Piquet e as Bandeiras" },
  { _id: new ObjectId(), codigo: "014", titulo: "Programa 4 – Pilotos e Recordes" },
  { _id: new ObjectId(), codigo: "015", titulo: "Programa 5 – Emerson Fittipaldi" },
  { _id: new ObjectId(), codigo: "016", titulo: "Programa 6 – Revisão Geral (sorteio dos Programas 1 a 5)" },
];

const idProg1 = livros[0]._id;
const idProg2 = livros[1]._id;
const idProg3 = livros[2]._id;
const idProg4 = livros[3]._id;
const idProg5 = livros[4]._id;

// ---------------------------------------------------------------
// 2) PERGUNTAS (150 no total, numero 1-150, como impresso no livro)
// ---------------------------------------------------------------
const perguntas = [
  // ============== PROGRAMA 1 (1-30) ==============
  // --- Você sabia? (1-7) ---
  { livro: idProg1, numero: 1, categoria: "Você sabia?",
    enunciado: "Que país realizou o maior número de corridas na história da F1?",
    alternativas: ["Austrália", "Portugal", "Brasil", "Estados Unidos"],
    respostaCorreta: "Estados Unidos" },
  { livro: idProg1, numero: 2, categoria: "Você sabia?",
    enunciado: "Quem foi o piloto mais jovem a ganhar um título de F1?",
    alternativas: ["Niki Lauda", "Emerson Fittipaldi", "Alain Prost", "Mario Andretti"],
    respostaCorreta: "Emerson Fittipaldi" },
  { livro: idProg1, numero: 3, categoria: "Você sabia?",
    enunciado: "Qual é a menor distância permitida entre as fileiras do grid de largada?",
    alternativas: ["7 metros", "22 metros", "15 metros", "2 metros"],
    respostaCorreta: "7 metros" }, // ⚠ verificar (não achei a regra exata vigente na época do livro)
  { livro: idProg1, numero: 4, categoria: "Você sabia?",
    enunciado: "Qual o piloto mais velho a vencer um campeonato de F1?",
    alternativas: ["Juan Fangio", "Graham Hill", "Jackie Stewart", "James Hunt"],
    respostaCorreta: "Juan Fangio" },
  { livro: idProg1, numero: 5, categoria: "Você sabia?",
    enunciado: "Italiana, pilotando um March conseguiu 0,5 ponto pela sexta colocação no GP da Espanha de 1975. Seu nome é...",
    alternativas: ["Bruna Lombardi", "Angélica", "Xuxa", "Lella Lombardi"],
    respostaCorreta: "Lella Lombardi" },
  { livro: idProg1, numero: 6, categoria: "Você sabia?",
    enunciado: "As três edições do GP da Hungria foram vencidas por pilotos da mesma nacionalidade. De que país são eles?",
    alternativas: [
      "Grã-Bretanha (Mansell, Brundle, Mansell)",
      "Brasil (Piquet, Piquet, Senna)",
      "França (Prost, Prost, Laffite)",
      "Itália (Alboreto, Capelli, Nannini)",
    ],
    respostaCorreta: "Brasil (Piquet, Piquet, Senna)" },
  { livro: idProg1, numero: 7, categoria: "Você sabia?",
    enunciado: "Piloto inglês que foi campeão de F1 pela Ferrari em 1964 e sete vezes campeão de motociclismo.",
    alternativas: ["Emerson Fittipaldi", "John Surtees", "Niki Lauda", "René Arnoux"],
    respostaCorreta: "John Surtees" },

  // --- Ayrton Senna (8-20) ---
  { livro: idProg1, numero: 8, categoria: "Ayrton Senna",
    enunciado: "Onde nasceu Ayrton Senna?",
    alternativas: ["Jacareí", "Vitória", "Brasília", "São Paulo"],
    respostaCorreta: "São Paulo" },
  { livro: idProg1, numero: 9, categoria: "Ayrton Senna",
    enunciado: "Sua estreia nas pistas, aos 13 anos, foi pilotando um ... .",
    alternativas: ["kart", "skate", "patinete", "jipe"],
    respostaCorreta: "kart" },
  { livro: idProg1, numero: 10, categoria: "Ayrton Senna",
    enunciado: "Em 1982 venceu dois campeonatos (o Inglês e o Europeu) de Fórmula ...... .",
    alternativas: ["Ford 2000", "Álcool 500", "Fiat 500", "Honda 750"],
    respostaCorreta: "Ford 2000" },
  { livro: idProg1, numero: 11, categoria: "Ayrton Senna",
    enunciado: "Em 1983 venceu o Campeonato Inglês de ... .",
    alternativas: ["Motociclismo", "Kart", "Tênis", "Fórmula 3"],
    respostaCorreta: "Fórmula 3" },
  { livro: idProg1, numero: 12, categoria: "Ayrton Senna",
    enunciado: "Em que ano estreou na Fórmula 1?",
    alternativas: ["1974", "1984", "1960", "1964"],
    respostaCorreta: "1984" },
  { livro: idProg1, numero: 13, categoria: "Ayrton Senna",
    enunciado: "Ganhou o primeiro Grande Prêmio em 1985 no GP de ...... .",
    alternativas: ["Mônaco", "San Marino", "Portugal", "Luxemburgo"],
    respostaCorreta: "Portugal" },
  { livro: idProg1, numero: 14, categoria: "Ayrton Senna",
    enunciado: "A McLaren é sua terceira equipe de F1. Quais foram as duas anteriores?",
    alternativas: ["Renault e Benetton", "Lotus e Brabham", "Toleman e Lotus", "Tyrrell e Ferrari"],
    respostaCorreta: "Toleman e Lotus" },
  { livro: idProg1, numero: 15, categoria: "Ayrton Senna",
    enunciado: "Quem foi seu companheiro de equipe em 1988?",
    alternativas: ["Gerhard Berger", "Alain Prost", "Nigel Mansell", "Nelson Piquet"],
    respostaCorreta: "Alain Prost" },
  { livro: idProg1, numero: 16, categoria: "Ayrton Senna",
    enunciado: "Na temporada de 88, a primeira vitória de Senna foi no GP de ... .",
    alternativas: ["Israel", "Chicago", "San Marino", "Cingapura"],
    respostaCorreta: "San Marino" },
  { livro: idProg1, numero: 17, categoria: "Ayrton Senna",
    enunciado: "No GP da Itália de 1988, ele completou ..... voltas liderando uma corrida de F1.",
    alternativas: ["3000", "500", "5000", "1000"],
    respostaCorreta: "1000" }, // ⚠ verificar (não encontrei a estatística exata desse marco)
  { livro: idProg1, numero: 18, categoria: "Ayrton Senna",
    enunciado: "Senna tem uma habilidade especial que o fez conhecido como o \"rei da .......\".",
    alternativas: ["pista", "dança", "bola", "chuva"],
    respostaCorreta: "chuva" },
  { livro: idProg1, numero: 19, categoria: "Ayrton Senna",
    enunciado: "Sagrou-se campeão mundial em 1988 ao vencer brilhantemente o GP do ......... .",
    alternativas: ["México", "Brasil", "Canadá", "Japão"],
    respostaCorreta: "Japão" },
  { livro: idProg1, numero: 20, categoria: "Ayrton Senna",
    enunciado: "Quantos GPs Ayrton Senna venceu na temporada de 88?",
    alternativas: ["10", "8", "1", "12"],
    respostaCorreta: "8" },

  // --- Grandes Prêmios do Brasil (21-30) ---
  { livro: idProg1, numero: 21, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Em que ano e autódromo o Grande Prêmio do Brasil começou a contar pontos para o Campeonato Mundial?",
    alternativas: ["1978, Jacarepaguá", "1986, Brasília", "1980, Taruã", "1973, Interlagos"],
    respostaCorreta: "1973, Interlagos" },
  { livro: idProg1, numero: 22, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Quem foi o piloto que venceu o primeiro GP oficial de F1 no Brasil?",
    alternativas: ["Emerson Fittipaldi", "Niki Lauda", "Carlos Reutemann", "Nelson Piquet"],
    respostaCorreta: "Emerson Fittipaldi" },
  { livro: idProg1, numero: 23, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Quantas provas válidas pelo Campeonato Mundial de F1 já foram realizadas no Brasil?",
    alternativas: ["9", "16", "12", "20"],
    respostaCorreta: "16" },
  { livro: idProg1, numero: 24, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Qual o número de corridas oficiais de F1 disputadas no Autódromo de Interlagos?",
    alternativas: ["6", "9", "4", "12"],
    respostaCorreta: "6" }, // ⚠ verificar (contagem real até 1988 ficou perto de 7)
  { livro: idProg1, numero: 25, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Quando foi disputado o primeiro GP no Autódromo de Jacarepaguá?",
    alternativas: ["1982", "1973", "1978", "1979"],
    respostaCorreta: "1978" },
  { livro: idProg1, numero: 26, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Três pilotos brasileiros (com cinco vitórias) já venceram o GP do Brasil. Quem são eles?",
    alternativas: [
      "Serra (1), Piquet (2), Senna (2)",
      "Hoffmann (1), Pace (2), Senna (2)",
      "Gugelmin (1), Emerson (2), Piquet (2)",
      "Emerson (2), Pace (1), Piquet (2)",
    ],
    respostaCorreta: "Emerson (2), Pace (1), Piquet (2)" },
  { livro: idProg1, numero: 27, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Em que ano o Fitti-1 (Equipe Copersucar/Fittipaldi), o primeiro carro brasileiro de F1, fez sua estreia no Brasil?",
    alternativas: ["1975", "1988", "1978", "1980"],
    respostaCorreta: "1975" },
  { livro: idProg1, numero: 28, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Que piloto conquistou a pole position no GP do Brasil de 1988?",
    alternativas: ["Piquet", "Alboreto", "Senna", "Mansell"],
    respostaCorreta: "Senna" },
  { livro: idProg1, numero: 29, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Quem tem o maior número de vitórias no GP do Brasil?",
    alternativas: ["Prost", "Senna", "Emerson", "Piquet"],
    respostaCorreta: "Prost" },
  { livro: idProg1, numero: 30, categoria: "Grandes Prêmios do Brasil",
    enunciado: "Qual é a equipe recordista de vitórias (4) no GP do Brasil?",
    alternativas: ["Ferrari", "McLaren", "Copersucar", "Renault"],
    respostaCorreta: "McLaren" },

  // ============== PROGRAMA 2 (31-60) ==============
  // --- Circuitos (31-50) ---
  { livro: idProg2, numero: 31, categoria: "Circuitos",
    enunciado: "Quem ganhou o apelido de \"rei do Rio\" por ter vencido 5 GPs nesse autódromo? (GP do Brasil - Autódromo de Jacarepaguá)",
    alternativas: ["Emerson", "Prost", "Senna", "Piquet"],
    respostaCorreta: "Prost" },
  { livro: idProg2, numero: 32, categoria: "Circuitos",
    enunciado: "Curiosamente, o GP de San Marino é disputado em outro país. Em que país fica a cidade de Imola, onde se localiza esse autódromo?",
    alternativas: ["França", "México", "Itália", "Luxemburgo"],
    respostaCorreta: "Itália" },
  { livro: idProg2, numero: 33, categoria: "Circuitos",
    enunciado: "Apenas uma vez um piloto brasileiro venceu no famoso circuito de rua de Monte Carlo. Quem foi e em que ano?",
    alternativas: ["Emerson, 1974", "Gugelmin, 1988", "Piquet, 1983", "Senna, 1987"],
    respostaCorreta: "Senna, 1987" },
  { livro: idProg2, numero: 34, categoria: "Circuitos",
    enunciado: "A altitude é uma dificuldade especial apresentada por esse autódromo da Cidade do México. A que altitude ele fica?",
    alternativas: ["2 286 metros", "4 500 metros", "1 050 metros", "700 metros"],
    respostaCorreta: "2 286 metros" },
  { livro: idProg2, numero: 35, categoria: "Circuitos",
    enunciado: "Das vinte edições do GP do Canadá, os pilotos brasileiros obtiveram o maior número de vitórias. Quantas foram?",
    alternativas: ["12", "7", "4", "8"],
    respostaCorreta: "4" }, // ⚠ verificar
  { livro: idProg2, numero: 36, categoria: "Circuitos",
    enunciado: "O GP dos Estados Unidos é disputado num circuito montado nas ruas de Detroit, a capital do automóvel. Quem ganhou as três últimas provas nesse circuito?",
    alternativas: ["Senna", "Prost", "Mansell", "Piquet"],
    respostaCorreta: "Senna" },
  { livro: idProg2, numero: 37, categoria: "Circuitos",
    enunciado: "Este autódromo viu a única vitória de um brasileiro no GP da França. De quem foi essa vitória?",
    alternativas: ["Emerson (1972)", "Pace (1975)", "Piquet (1985)", "Senna (1986)"],
    respostaCorreta: "Piquet (1985)" }, // ⚠ verificar
  { livro: idProg2, numero: 38, categoria: "Circuitos",
    enunciado: "Por causa das brilhantes atuações de Ayrton Senna da Silva nesse autódromo, o circuito ganhou o apelido de ... . (GP da Inglaterra - Silverstone)",
    alternativas: ["Silversilva", "Silversenna", "Ayrtonstone", "Silvastone"],
    respostaCorreta: "Silversenna" },
  { livro: idProg2, numero: 39, categoria: "Circuitos",
    enunciado: "O GP da Alemanha, disputado nesse autódromo, foi vencido nos três últimos anos por dois pilotos da mesma nacionalidade. Quem são eles?",
    alternativas: [
      "Piquet (2) e Senna",
      "Patrese (2) e Alboreto",
      "Arnoux e Prost (2)",
      "Mansell (2) e Warwick",
    ],
    respostaCorreta: "Piquet (2) e Senna" },
  { livro: idProg2, numero: 40, categoria: "Circuitos",
    enunciado: "O GP da Hungria existe há apenas três anos. Em 1988, esse GP foi realizado no tempo de 1:57'47\"081, tendo sido portanto a prova mais ........ da temporada.",
    alternativas: ["bonita", "demorada", "curta", "chata"],
    respostaCorreta: "demorada" },
  { livro: idProg2, numero: 41, categoria: "Circuitos",
    enunciado: "Este circuito, onde é disputado o GP da Bélgica, apresenta o mais ..... traçado de pista dos campeonatos atuais.",
    alternativas: ["longo", "difícil", "fácil", "rápido"],
    respostaCorreta: "longo" },
  { livro: idProg2, numero: 42, categoria: "Circuitos",
    enunciado: "O GP da Itália, em Monza, foi a única prova de 1988 em que houve uma \"dobradinha\" (1º e 2º lugares) desta equipe.",
    alternativas: ["Benetton", "Ferrari", "Lotus", "McLaren"],
    respostaCorreta: "Ferrari" },
  { livro: idProg2, numero: 43, categoria: "Circuitos",
    enunciado: "O francês Alain Prost é recordista de vitórias no GP de Portugal, realizado no Autódromo do Estoril. Quantas vezes ele venceu?",
    alternativas: ["5", "3", "8", "2"],
    respostaCorreta: "3" }, // ⚠ verificar
  { livro: idProg2, numero: 44, categoria: "Circuitos",
    enunciado: "Emerson Fittipaldi foi o único brasileiro a vencer (e duas vezes) o GP da Espanha, hoje disputado em Jerez. Em que circuitos ele venceu?",
    alternativas: [
      "Jerez (81) e Montjuich (86)",
      "Jarama (78) e Jerez (80)",
      "Jarama (72) e Montjuich (73)",
      "Madri (80) e Jerez (88)",
    ],
    respostaCorreta: "Jarama (72) e Montjuich (73)" }, // ⚠ verificar (Fittipaldi venceu Montjuich-73 e Jarama-74)
  { livro: idProg2, numero: 45, categoria: "Circuitos",
    enunciado: "No GP do Japão de 1988, em Suzuka, Senna sagrou-se campeão pilotando um McLaren equipado com motor ......... .",
    alternativas: ["Yamaha", "Ford", "Renault", "Honda"],
    respostaCorreta: "Honda" },
  { livro: idProg2, numero: 46, categoria: "Circuitos",
    enunciado: "O pódio do GP da Austrália de 1988 no circuito de Adelaide reuniu os três últimos campeões mundiais. Quem foram os pilotos?",
    alternativas: [
      "Lauda, Prost, Senna",
      "Mansell, Piquet, Senna",
      "Prost, Senna, Piquet",
      "Prost, Mansell, Piquet",
    ],
    respostaCorreta: "Prost, Senna, Piquet" },
  { livro: idProg2, numero: 47, categoria: "Circuitos",
    enunciado: "O Autódromo de Nürburgring, na Alemanha, é o mais longo circuito do mundo, com 22 835 metros de extensão. Quando ocorreu a última prova de F1 nesse circuito?",
    alternativas: ["1979", "1985", "1987", "1965"],
    respostaCorreta: "1985" }, // ⚠ verificar
  { livro: idProg2, numero: 48, categoria: "Circuitos",
    enunciado: "O GP da Itália, um dos mais tradicionais da F1, sempre foi disputado no Autódromo de Monza. O piloto que mais vezes venceu esse GP é Nelson Piquet, com ........... vitórias.",
    alternativas: ["3", "7", "4", "6"],
    respostaCorreta: "3" }, // ⚠ verificar
  { livro: idProg2, numero: 49, categoria: "Circuitos",
    enunciado: "Além dos GPs da África do Sul, que outro país africano já sediou uma prova válida pelo Campeonato Mundial de F1?",
    alternativas: ["Índia, em 1967", "Cuba, em 1959", "Irã, em 1979", "Marrocos, em 1958"],
    respostaCorreta: "Marrocos, em 1958" },
  { livro: idProg2, numero: 50, categoria: "Circuitos",
    enunciado: "Em 1981, os Estados Unidos realizaram três provas no mesmo campeonato. Em que cidades foram disputados os GPs?",
    alternativas: [
      "Nova York, Las Vegas, Detroit",
      "Long Beach, Detroit, Las Vegas",
      "Detroit, Dallas, Long Beach",
      "Las Vegas, Long Beach, Boston",
    ],
    respostaCorreta: "Long Beach, Detroit, Las Vegas" },

  // --- Partes do carro (51-60) -- ⚠ baseadas no diagrama do livro, CONFIRME VISUALMENTE ---
  { livro: idProg2, numero: 51, categoria: "Partes do carro",
    enunciado: "O que é A? (indicado no desenho do carro de F1)",
    alternativas: ["Retrovisor", "Rodas", "Motor", "Aerofólio"],
    respostaCorreta: "Aerofólio" }, // ⚠ verificar no diagrama
  { livro: idProg2, numero: 52, categoria: "Partes do carro",
    enunciado: "O que é B? (indicado no desenho do carro de F1)",
    alternativas: ["Suspensão", "Volante", "Pneus", "Santantônio"],
    respostaCorreta: "Volante" }, // ⚠ verificar no diagrama
  { livro: idProg2, numero: 53, categoria: "Partes do carro",
    enunciado: "O que é C? (indicado no desenho do carro de F1)",
    alternativas: ["Aerofólio", "Chassi", "Spoiler", "Tomada de ar"],
    respostaCorreta: "Tomada de ar" }, // ⚠ verificar no diagrama
  { livro: idProg2, numero: 54, categoria: "Partes do carro",
    enunciado: "O que é D? (indicado no desenho do carro de F1)",
    alternativas: ["Pneu", "Turbo", "Radiador", "Volante"],
    respostaCorreta: "Pneu" },
  { livro: idProg2, numero: 55, categoria: "Partes do carro",
    enunciado: "O que é E? (indicado no desenho do carro de F1)",
    alternativas: ["Rodas", "Motor", "Aerofólio", "Suspensão"],
    respostaCorreta: "Suspensão" },
  { livro: idProg2, numero: 56, categoria: "Partes do carro",
    enunciado: "O que é F? (indicado no desenho do carro de F1)",
    alternativas: ["Retrovisor", "Câmbio", "Turbo", "Pneus"],
    respostaCorreta: "Câmbio" }, // ⚠ verificar no diagrama
  { livro: idProg2, numero: 57, categoria: "Partes do carro",
    enunciado: "O que é G? (indicado no desenho do carro de F1)",
    alternativas: ["Radiador", "Spoiler", "Santantônio", "Motor"],
    respostaCorreta: "Radiador" }, // ⚠ verificar no diagrama
  { livro: idProg2, numero: 58, categoria: "Partes do carro",
    enunciado: "O que é H? (indicado no desenho do carro de F1)",
    alternativas: ["Volante", "Chassi", "Carenagem", "Tomada de ar"],
    respostaCorreta: "Carenagem" }, // ⚠ verificar no diagrama
  { livro: idProg2, numero: 59, categoria: "Partes do carro",
    enunciado: "O que é I? (indicado no desenho do carro de F1)",
    alternativas: ["Câmbio", "Suspensão", "Radiador", "Retrovisor"],
    respostaCorreta: "Suspensão" }, // ⚠ verificar no diagrama
  { livro: idProg2, numero: 60, categoria: "Partes do carro",
    enunciado: "O que é J? (indicado no desenho do carro de F1)",
    alternativas: ["Spoiler", "Santantônio", "Chassi", "Turbo"],
    respostaCorreta: "Spoiler" }, // ⚠ verificar no diagrama

  // ============== PROGRAMA 3 (61-90) ==============
  // --- Quebra-cabeça (61-66) -- ⚠ 100% visual, CONFIRME COM O LIVRO ---
  { livro: idProg3, numero: 61, categoria: "Quebra-cabeça",
    enunciado: "Coloque as peças do quebra-cabeça nos lugares certos. Qual peça (A-F) completa o espaço 61?",
    alternativas: ["E", "B", "A", "C"],
    respostaCorreta: null }, // ⚠ verificar visualmente no livro
  { livro: idProg3, numero: 62, categoria: "Quebra-cabeça",
    enunciado: "Coloque as peças do quebra-cabeça nos lugares certos. Qual peça (A-F) completa o espaço 62?",
    alternativas: ["F", "A", "D", "E"],
    respostaCorreta: null }, // ⚠ verificar visualmente no livro
  { livro: idProg3, numero: 63, categoria: "Quebra-cabeça",
    enunciado: "Coloque as peças do quebra-cabeça nos lugares certos. Qual peça (A-F) completa o espaço 63?",
    alternativas: ["F", "B", "C", "D"],
    respostaCorreta: null }, // ⚠ verificar visualmente no livro
  { livro: idProg3, numero: 64, categoria: "Quebra-cabeça",
    enunciado: "Coloque as peças do quebra-cabeça nos lugares certos. Qual peça (A-F) completa o espaço 64?",
    alternativas: ["C", "E", "D", "B"],
    respostaCorreta: null }, // ⚠ verificar visualmente no livro
  { livro: idProg3, numero: 65, categoria: "Quebra-cabeça",
    enunciado: "Coloque as peças do quebra-cabeça nos lugares certos. Qual peça (A-F) completa o espaço 65?",
    alternativas: ["A", "D", "B", "E"],
    respostaCorreta: null }, // ⚠ verificar visualmente no livro
  { livro: idProg3, numero: 66, categoria: "Quebra-cabeça",
    enunciado: "Coloque as peças do quebra-cabeça nos lugares certos. Qual peça (A-F) completa o espaço 66?",
    alternativas: ["A", "B", "C", "F"],
    respostaCorreta: null }, // ⚠ verificar visualmente no livro

  // --- Nelson Piquet (67-80) ---
  { livro: idProg3, numero: 67, categoria: "Nelson Piquet",
    enunciado: "Em que cidade nasceu Nelson Piquet?",
    alternativas: ["Recife", "Brasília", "Rio de Janeiro", "Sorocaba"],
    respostaCorreta: "Rio de Janeiro" },
  { livro: idProg3, numero: 68, categoria: "Nelson Piquet",
    enunciado: "Em 1976, com 24 anos, foi campeão brasileiro da categoria ........ .",
    alternativas: ["Super-H", "Super-Vê", "Super-8", "Ford-400"],
    respostaCorreta: "Super-Vê" },
  { livro: idProg3, numero: 69, categoria: "Nelson Piquet",
    enunciado: "Foi campeão de F3 na Inglaterra em ........ .",
    alternativas: ["1956", "1976", "1970", "1978"],
    respostaCorreta: "1978" },
  { livro: idProg3, numero: 70, categoria: "Nelson Piquet",
    enunciado: "Sua corrida de estréia na F1 foi no GP da Alemanha de 1978, pilotando um ..... .",
    alternativas: ["Ferrari", "Ensign", "Honda", "Brabham"],
    respostaCorreta: "Ensign" },
  { livro: idProg3, numero: 71, categoria: "Nelson Piquet",
    enunciado: "A primeira vitória foi no GP dos Estados Unidos-Oeste de 1980, em Long Beach. Nesse ano, ele seria ............... .",
    alternativas: ["campeão", "3º colocado", "desclassificado", "vice-campeão"],
    respostaCorreta: "vice-campeão" },
  { livro: idProg3, numero: 72, categoria: "Nelson Piquet",
    enunciado: "Em 1981 realizou-se pela primeira vez o GP de ........... e Piquet foi o vencedor.",
    alternativas: ["Uganda", "Japão", "Coréia", "San Marino"],
    respostaCorreta: "San Marino" },
  { livro: idProg3, numero: 73, categoria: "Nelson Piquet",
    enunciado: "Ganhou seu primeiro título mundial numa disputa acirrada com Carlos Reutemann durante o ..............., última prova de 1981.",
    alternativas: ["GP da Argentina", "GP da Austrália", "GP da Holanda", "GP dos Estados Unidos"],
    respostaCorreta: "GP dos Estados Unidos" },
  { livro: idProg3, numero: 74, categoria: "Nelson Piquet",
    enunciado: "Em 1983, ano em que se tornou bicampeão, Piquet venceu três GPs: Brasil, ........... e Europa (Brands Hatch).",
    alternativas: ["Itália", "Paquistão", "China", "Madagascar"],
    respostaCorreta: "Itália" },
  { livro: idProg3, numero: 75, categoria: "Nelson Piquet",
    enunciado: "Em 1987 fez a volta mais rápida da temporada no GP da Áustria, com uma média horária de ............... .",
    alternativas: ["480,244 km/h", "184,995 km/h", "256,622 km/h", "51,376 km/h"],
    respostaCorreta: "256,622 km/h" },
  { livro: idProg3, numero: 76, categoria: "Nelson Piquet",
    enunciado: "Conquistou o tricampeonato em 1987. Nesse ano, seu companheiro de equipe na Williams (e rival nas pistas) foi ........... .",
    alternativas: ["Ayrton Senna", "Ronnie Peterson", "Nigel Mansell", "Alain Prost"],
    respostaCorreta: "Nigel Mansell" },
  { livro: idProg3, numero: 77, categoria: "Nelson Piquet",
    enunciado: "Dois autódromos brasileiros levam o nome do tricampeão: o de Jacarepaguá e o de ........... .",
    alternativas: ["Goiânia", "Brasília", "Curitiba", "Ribeirão Preto"],
    respostaCorreta: "Brasília" },
  { livro: idProg3, numero: 78, categoria: "Nelson Piquet",
    enunciado: "Em que temporada Piquet conseguiu o maior número de pole positions e quantas foram?",
    alternativas: ["1984, 9", "1970, 5", "1983, 12", "1987, 7"],
    respostaCorreta: "1984, 9" },
  { livro: idProg3, numero: 79, categoria: "Nelson Piquet",
    enunciado: "Quantas vezes ele venceu o GP do Brasil?",
    alternativas: ["3 (1981, 83, 84)", "1 (1983)", "4 (1979, 82, 83, 85)", "2 (1983, 86)"],
    respostaCorreta: "2 (1983, 86)" },
  { livro: idProg3, numero: 80, categoria: "Nelson Piquet",
    enunciado: "Quantos GPs Piquet disputou até 1988?",
    alternativas: ["286", "157", "591", "31"],
    respostaCorreta: "157" },

  // --- Bandeiras de sinalização (81-90) ---
  { livro: idProg3, numero: 81, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira amarela lisa: o que ela significa?",
    alternativas: ["Cuidado! Perigo na pista.", "Você está correndo muito.", "Desligue o rádio.", "Animais na pista."],
    respostaCorreta: "Cuidado! Perigo na pista." },
  { livro: idProg3, numero: 82, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira verde: o que ela significa?",
    alternativas: ["Não pise na grama.", "Dê marcha à ré.", "Fogo! Tome cuidado.", "Fim do perigo. Pista liberada."],
    respostaCorreta: "Fim do perigo. Pista liberada." },
  { livro: idProg3, numero: 83, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira amarela com listras vermelhas: o que ela significa?",
    alternativas: ["Pegue atalho à direita.", "Pare na próxima volta.", "Óleo ou poça d'água na pista.", "Fim da competição."],
    respostaCorreta: "Óleo ou poça d'água na pista." },
  { livro: idProg3, numero: 84, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira meio preta, meio branca (diagonal): o que ela significa?",
    alternativas: ["Subida íngreme à frente.", "Experimente os freios.", "Falta grave. Última advertência.", "Não tente ultrapassar."],
    respostaCorreta: "Falta grave. Última advertência." },
  { livro: idProg3, numero: 85, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira preta lisa: o que ela significa?",
    alternativas: ["Céu encoberto.", "Acenda os faróis.", "Perigo na pista.", "Pare no boxe imediatamente."],
    respostaCorreta: "Pare no boxe imediatamente." },
  { livro: idProg3, numero: 86, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira preta com círculo laranja: o que ela significa?",
    alternativas: ["Pista esburacada.", "Túnel à frente.", "Cuidado! Bolas na pista.", "Seu carro oferece perigo."],
    respostaCorreta: "Seu carro oferece perigo." },
  { livro: idProg3, numero: 87, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira branca lisa: o que ela significa?",
    alternativas: ["Neblina. Pouca visibilidade.", "Veículo de serviço na pista.", "Neve no fim da reta.", "Cuidado! Poça d'água na curva."],
    respostaCorreta: "Veículo de serviço na pista." },
  { livro: idProg3, numero: 88, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira azul lisa: o que ela significa?",
    alternativas: ["Tudo azul. Siga em frente.", "Não obstar ultrapassagem.", "Seu pneu está furado.", "Faltam só duas voltas."],
    respostaCorreta: "Não obstar ultrapassagem." },
  { livro: idProg3, numero: 89, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira vermelha lisa: o que ela significa?",
    alternativas: ["Atenção! Pista escorregadia.", "Cuidado! Fogo na pista.", "Parada imediata de todos os carros.", "Bombeiros à frente."],
    respostaCorreta: "Parada imediata de todos os carros." },
  { livro: idProg3, numero: 90, categoria: "Bandeiras de sinalização",
    enunciado: "Bandeira quadriculada (preto e branco): o que ela significa?",
    alternativas: ["Fim da competição.", "Pista irregular.", "Ultrapasse na próxima volta.", "Economize combustível."],
    respostaCorreta: "Fim da competição." },

  // ============== PROGRAMA 4 (91-120) ==============
  // --- Fototeste (91-97) ---
  { livro: idProg4, numero: 91, categoria: "Fototeste",
    enunciado: "Ele foi homenageado com um selo comemorativo pelo tricampeonato de F1 conquistado em 1987.",
    alternativas: ["Gugelmin", "Mansell", "Senna", "Piquet"],
    respostaCorreta: "Piquet" },
  { livro: idProg4, numero: 92, categoria: "Fototeste",
    enunciado: "Piloto austríaco, sagrou-se tricampeão em 1984 por uma diferença de 0,5 ponto para o segundo colocado.",
    alternativas: ["Boutsen", "Johansson", "Lauda", "Berger"],
    respostaCorreta: "Lauda" },
  { livro: idProg4, numero: 93, categoria: "Fototeste",
    enunciado: "Venceu o Grande Prêmio da Itália de 1988.",
    alternativas: ["Berger", "Lauda", "Patrese", "Nannini"],
    respostaCorreta: "Berger" },
  { livro: idProg4, numero: 94, categoria: "Fototeste",
    enunciado: "Ídolo italiano, em 1988 defendeu a Ferrari e foi o quinto colocado no Campeonato Mundial.",
    alternativas: ["Prost", "Arnoux", "Nakajima", "Alboreto"],
    respostaCorreta: "Alboreto" },
  { livro: idProg4, numero: 95, categoria: "Fototeste",
    enunciado: "Em 1988 foi o primeiro piloto brasileiro a vencer o Grande Prêmio do Japão.",
    alternativas: ["Piquet", "Gugelmin", "Senna", "Moreno"],
    respostaCorreta: "Senna" },
  { livro: idProg4, numero: 96, categoria: "Fototeste",
    enunciado: "Piloto francês vencedor do GP da Austrália, último da temporada de 1988.",
    alternativas: ["Berger", "Capelli", "Prost", "Cheever"],
    respostaCorreta: "Prost" },
  { livro: idProg4, numero: 97, categoria: "Fototeste",
    enunciado: "Saiu da equipe Williams para pilotar um Ferrari no campeonato de 1989.",
    alternativas: ["Alboreto", "Senna", "Piquet", "Mansell"],
    respostaCorreta: "Mansell" },

  // --- Capacetes (98-103) ---
  { livro: idProg4, numero: 98, categoria: "Capacetes",
    enunciado: "Austríaco, em 1988 ficou na terceira colocação no campeonato correndo pela Ferrari.",
    alternativas: ["Alboreto", "Cheever", "Berger", "Palmer"],
    respostaCorreta: "Berger" },
  { livro: idProg4, numero: 99, categoria: "Capacetes",
    enunciado: "Tricampeão em 1987, trocou a Williams pela Lotus na temporada de 1988; terminou em sexto lugar.",
    alternativas: ["Alliot", "Nannini", "Piquet", "Tarquini"],
    respostaCorreta: "Piquet" },
  { livro: idProg4, numero: 100, categoria: "Capacetes",
    enunciado: "Em 1988 deixou a Lotus pela McLaren e sagrou-se campeão mundial.",
    alternativas: ["Arnoux", "Patrese", "Senna", "Warwick"],
    respostaCorreta: "Senna" },
  { livro: idProg4, numero: 101, categoria: "Capacetes",
    enunciado: "Belga, em 1988 defendeu a Benetton e foi o quarto colocado.",
    alternativas: ["De Cesaris", "Boutsen", "Modena", "Sala"],
    respostaCorreta: "Boutsen" },
  { livro: idProg4, numero: 102, categoria: "Capacetes",
    enunciado: "Brasileiro, em 1988 marcou seus primeiros pontos pilotando um March.",
    alternativas: ["Gugelmin", "Mansell", "Ghinzani", "Pupo Moreno"],
    respostaCorreta: "Gugelmin" },
  { livro: idProg4, numero: 103, categoria: "Capacetes",
    enunciado: "Francês, em 1988 foi vice-campeão pela McLaren.",
    alternativas: ["Capelli", "Nakajima", "Johansson", "Prost"],
    respostaCorreta: "Prost" },

  // --- Os recordistas (104-110) ---
  { livro: idProg4, numero: 104, categoria: "Os recordistas",
    enunciado: "Quem é o recordista de vitórias em Grandes Prêmios de F1?",
    alternativas: ["Stewart (27)", "Prost (35)", "Clark (25)", "Fangio (24)"],
    respostaCorreta: "Prost (35)" },
  { livro: idProg4, numero: 105, categoria: "Os recordistas",
    enunciado: "Que piloto conseguiu o maior número de vitórias numa só temporada?",
    alternativas: ["Senna (8)", "Lauda (5)", "Ascari (6)", "Clark (7)"],
    respostaCorreta: "Senna (8)" },
  { livro: idProg4, numero: 106, categoria: "Os recordistas",
    enunciado: "Qual equipe detém o maior número de títulos no Campeonato Mundial de Construtores?",
    alternativas: ["Lotus (7)", "Ferrari (8)", "McLaren (6)", "Williams (5)"],
    respostaCorreta: "Ferrari (8)" },
  { livro: idProg4, numero: 107, categoria: "Os recordistas",
    enunciado: "Na temporada de 1988, ele igualou o recorde de 176 GPs disputados, até então em poder de Hill e Lafitte. Seu nome é ........ .",
    alternativas: ["Nelson Piquet", "Riccardo Patrese", "Alain Prost", "Ayrton Senna"],
    respostaCorreta: "Riccardo Patrese" },
  { livro: idProg4, numero: 108, categoria: "Os recordistas",
    enunciado: "Que piloto conseguiu o maior número de pole positions numa mesma temporada (13 em 16 provas, durante o campeonato de 1988)?",
    alternativas: ["Alain Prost", "Nelson Piquet", "Gerhard Berger", "Ayrton Senna"],
    respostaCorreta: "Ayrton Senna" },
  { livro: idProg4, numero: 109, categoria: "Os recordistas",
    enunciado: "Considerando a nacionalidade dos pilotos, qual é o país que possui o maior número de títulos de Fórmula 1?",
    alternativas: ["Brasil (6)", "Escócia (5)", "Argentina (5)", "Inglaterra (5)"],
    respostaCorreta: "Brasil (6)" },
  { livro: idProg4, numero: 110, categoria: "Os recordistas",
    enunciado: "Em 1988, a equipe McLaren conseguiu o recorde de \"dobradinhas\" (1º e 2º lugares) com Senna e Prost. Quantas foram?",
    alternativas: ["9", "10", "8", "12"],
    respostaCorreta: "10" },

  // --- As máquinas (111-116) -- ⚠ pinturas dos carros, CONFIRME VISUALMENTE ---
  { livro: idProg4, numero: 111, categoria: "As máquinas",
    enunciado: "Identifique a equipe a que pertence este carro de F1 (branco e vermelho, Marlboro, nº 12).",
    alternativas: ["Benetton", "McLaren", "Ligier", "Lotus"],
    respostaCorreta: "McLaren" },
  { livro: idProg4, numero: 112, categoria: "As máquinas",
    enunciado: "Identifique a equipe a que pertence este carro de F1 (vermelho, nº 27).",
    alternativas: ["Fitti-1", "Williams", "Lotus", "Ferrari"],
    respostaCorreta: "Ferrari" },
  { livro: idProg4, numero: 113, categoria: "As máquinas",
    enunciado: "Identifique a equipe a que pertence este carro de F1 (amarelo/laranja, Camel).",
    alternativas: ["Lotus", "Minardi", "Benetton", "McLaren"],
    respostaCorreta: "Lotus" },
  { livro: idProg4, numero: 114, categoria: "As máquinas",
    enunciado: "Identifique a equipe a que pertence este carro de F1 (prateado/azul claro).",
    alternativas: ["Ferrari", "Fitti-1", "McLaren", "Williams"],
    respostaCorreta: "Fitti-1" }, // ⚠ verificar visualmente
  { livro: idProg4, numero: 115, categoria: "As máquinas",
    enunciado: "Identifique a equipe a que pertence este carro de F1 (azul escuro, nº 25).",
    alternativas: ["March", "Benetton", "Ferrari", "Ligier"],
    respostaCorreta: "Ligier" }, // ⚠ verificar visualmente
  { livro: idProg4, numero: 116, categoria: "As máquinas",
    enunciado: "Identifique a equipe a que pertence este carro de F1 (amarelo e azul, Canon/Barclay).",
    alternativas: ["Williams", "McLaren", "March", "Arrows"],
    respostaCorreta: "Arrows" }, // ⚠ verificar visualmente

  // --- Ases do passado (117-120) ---
  { livro: idProg4, numero: 117, categoria: "Ases do passado",
    enunciado: "O argentino Juan Manuel Fangio recebeu da imprensa especializada o título de Maior Campeão Mundial de Fórmula 1. Quantas vezes ele venceu o campeonato?",
    alternativas: ["4 (1954, 55, 56, 57)", "5 (1951, 54, 55, 56, 57)", "6 (1952, 53, 58, 59, 60, 64)", "3 (1952, 54, 55)"],
    respostaCorreta: "5 (1951, 54, 55, 56, 57)" },
  { livro: idProg4, numero: 118, categoria: "Ases do passado",
    enunciado: "Bicampeão mundial de F1 (1963, 65), Jim Clark foi um dos maiores pilotos de todos os tempos. Até hoje é o recordista de pole positions. Quantas pole esse \"escocês voador\" conseguiu?",
    alternativas: ["28", "33", "17", "24"],
    respostaCorreta: "33" },
  { livro: idProg4, numero: 119, categoria: "Ases do passado",
    enunciado: "Por ter vencido 5 vezes o GP de Mônaco (1963, 64, 65, 68, 69) o inglês Graham Hill recebeu o apelido de ......... .",
    alternativas: ["Rei de Mônaco", "Sr. Monte Carlo", "Mr. Mônaco", "Mr. Universo"],
    respostaCorreta: "Mr. Mônaco" },
  { livro: idProg4, numero: 120, categoria: "Ases do passado",
    enunciado: "Jackie Stewart sagrou-se tricampeão mundial de F1 em 1973 e, a seguir, abandonou as pistas. Atualmente dedica-se a uma atividade menos perigosa. O que faz este outro \"escocês voador\"?",
    alternativas: ["Chefe de equipe", "Desenhista", "Escritor", "Comentarista de TV"],
    respostaCorreta: "Comentarista de TV" },

  // ============== PROGRAMA 5 (121-150) ==============
  // --- Quantos pontos eles ganham (121-127) ---
  { livro: idProg5, numero: 121, categoria: "Quantos pontos eles ganham",
    enunciado: "Quantos pontos ganha o piloto que chega em 1º lugar?",
    alternativas: ["8", "10", "7", "9"],
    respostaCorreta: "9" },
  { livro: idProg5, numero: 122, categoria: "Quantos pontos eles ganham",
    enunciado: "Quantos pontos ganha o piloto que chega em 2º lugar?",
    alternativas: ["7", "5", "6", "8"],
    respostaCorreta: "6" },
  { livro: idProg5, numero: 123, categoria: "Quantos pontos eles ganham",
    enunciado: "Quantos pontos ganha o piloto que chega em 3º lugar?",
    alternativas: ["6", "5", "4", "7"],
    respostaCorreta: "4" },
  { livro: idProg5, numero: 124, categoria: "Quantos pontos eles ganham",
    enunciado: "Quantos pontos ganha o piloto que chega em 4º lugar?",
    alternativas: ["5", "6", "2", "3"],
    respostaCorreta: "3" },
  { livro: idProg5, numero: 125, categoria: "Quantos pontos eles ganham",
    enunciado: "Quantos pontos ganha o piloto que chega em 5º lugar?",
    alternativas: ["4", "3", "5", "2"],
    respostaCorreta: "2" },
  { livro: idProg5, numero: 126, categoria: "Quantos pontos eles ganham",
    enunciado: "Quantos pontos ganha o piloto que chega em 6º lugar?",
    alternativas: ["1", "3", "2", "0"],
    respostaCorreta: "1" },
  { livro: idProg5, numero: 127, categoria: "Quantos pontos eles ganham",
    enunciado: "Quantos pontos ganha o piloto que chega em 7º lugar?",
    alternativas: ["0", "3", "1", "2"],
    respostaCorreta: "0" },

  // --- Emerson Fittipaldi (128-140) ---
  { livro: idProg5, numero: 128, categoria: "Emerson Fittipaldi",
    enunciado: "Qual é o apelido de Emerson Fittipaldi?",
    alternativas: ["Vesgo", "Rato", "Tatu", "Moco"],
    respostaCorreta: null }, // ⚠ não confirmado - verificar no livro
  { livro: idProg5, numero: 129, categoria: "Emerson Fittipaldi",
    enunciado: "Estreou na F1 no GP da Inglaterra de 1970, pilotando um Lotus. Que classificação obteve nessa primeira prova?",
    alternativas: ["3º lugar", "1º lugar", "não classificou", "8º lugar"],
    respostaCorreta: "8º lugar" },
  { livro: idProg5, numero: 130, categoria: "Emerson Fittipaldi",
    enunciado: "Seu companheiro na Lotus morreria pouco depois, durante os treinos para o GP da Itália. Quem era ele?",
    alternativas: ["François Cevert", "Jochen Rindt", "Jo Siffert", "Ronnie Peterson"],
    respostaCorreta: "Jochen Rindt" },
  { livro: idProg5, numero: 131, categoria: "Emerson Fittipaldi",
    enunciado: "Ainda em 1970, Emerson conseguiu sua primeira vitória. Qual foi o GP que ele venceu?",
    alternativas: ["Canadá", "Brasil", "Estados Unidos", "África do Sul"],
    respostaCorreta: "Estados Unidos" },
  { livro: idProg5, numero: 132, categoria: "Emerson Fittipaldi",
    enunciado: "Emerson foi o mais jovem piloto a sagrar-se campeão mundial, em 1972. Que idade tinha então?",
    alternativas: ["28 anos", "32 anos", "21 anos", "24 anos"],
    respostaCorreta: "24 anos" }, // ⚠ verificar - na realidade ele tinha 25 anos; nenhuma opção bate exatamente
  { livro: idProg5, numero: 133, categoria: "Emerson Fittipaldi",
    enunciado: "Foi bicampeão em 1974 pilotando um ........ . Graças a Emerson, essa equipe conseguiu seu primeiro título no Mundial de Construtores.",
    alternativas: ["Benetton", "Ferrari", "Williams", "McLaren"],
    respostaCorreta: "McLaren" },
  { livro: idProg5, numero: 134, categoria: "Emerson Fittipaldi",
    enunciado: "Emerson venceu os dois primeiros GPs do Brasil, em 1973 e 1974. Em que autódromo foram realizados?",
    alternativas: ["Jacarepaguá", "Jacupiranga", "Interlagos", "Belo Horizonte"],
    respostaCorreta: "Interlagos" },
  { livro: idProg5, numero: 135, categoria: "Emerson Fittipaldi",
    enunciado: "Em que anos foi vice-campeão mundial?",
    alternativas: ["1971 e 1975", "1970 e 1971", "1973 e 1975", "1971 e 1973"],
    respostaCorreta: "1973 e 1975" },
  { livro: idProg5, numero: 136, categoria: "Emerson Fittipaldi",
    enunciado: "No final da temporada de 1975 Emerson deixou a McLaren para pilotar o ........., primeiro carro brasileiro de F1.",
    alternativas: ["Coperturbo", "Copersucar", "Copersal", "Fitti-sucar"],
    respostaCorreta: "Copersucar" },
  { livro: idProg5, numero: 137, categoria: "Emerson Fittipaldi",
    enunciado: "A melhor classificação que obteve com esse carro foi um segundo lugar em 1978. Em que prova foi?",
    alternativas: ["GP de Mônaco", "GP da Inglaterra", "GP da Itália", "GP do Brasil"],
    respostaCorreta: "GP do Brasil" },
  { livro: idProg5, numero: 138, categoria: "Emerson Fittipaldi",
    enunciado: "Emerson abandonou a F1 em 1981. Durante seus 11 anos de carreira quantas vezes subiu ao pódio?",
    alternativas: ["12 vezes", "35 vezes", "8 vezes", "80 vezes"],
    respostaCorreta: "35 vezes" },
  { livro: idProg5, numero: 139, categoria: "Emerson Fittipaldi",
    enunciado: "Dos 144 Grandes Prêmios que disputou, quantos ele venceu?",
    alternativas: ["90", "14", "2", "45"],
    respostaCorreta: "14" },
  { livro: idProg5, numero: 140, categoria: "Emerson Fittipaldi",
    enunciado: "Atualmente corre na Fórmula Indy. Sua primeira vitória nessa competição norte-americana de velocidade foi em 1985, nas ........ .",
    alternativas: ["450 Milhas de Indianápolis", "500 Milhas de Michigan", "125 Milhas de Detroit", "275 Milhas de Phoenix"],
    respostaCorreta: "500 Milhas de Michigan" }, // ⚠ verificar

  // --- Palavras cruzadas (141-146) ---
  { livro: idProg5, numero: 141, categoria: "Palavras cruzadas",
    enunciado: "(Horizontal) Assim como os carros e os pilotos, eles são peças importantes no \"circo\" da Fórmula 1.",
    alternativas: ["Macacos", "Mecânicos", "Leões", "Parafusos"],
    respostaCorreta: "Mecânicos" },
  { livro: idProg5, numero: 142, categoria: "Palavras cruzadas",
    enunciado: "(Horizontal) Venceu o Campeonato Mundial de Construtores de 1988.",
    alternativas: ["Toyota", "Renault", "Williams", "McLaren"],
    respostaCorreta: "McLaren" },
  { livro: idProg5, numero: 143, categoria: "Palavras cruzadas",
    enunciado: "(Horizontal) Equipe em que Emerson ganhou seu primeiro título de F1.",
    alternativas: ["Lotus", "Tyrrell", "Ferrari", "Ligier"],
    respostaCorreta: "Lotus" },
  { livro: idProg5, numero: 144, categoria: "Palavras cruzadas",
    enunciado: "(Vertical) Equipamento obrigatório de segurança dos pilotos.",
    alternativas: ["Freios", "Capacete", "Relógio", "Lenço"],
    respostaCorreta: "Capacete" },
  { livro: idProg5, numero: 145, categoria: "Palavras cruzadas",
    enunciado: "(Vertical) Nela se ganha ou se perde uma corrida.",
    alternativas: ["Praia", "Véspera", "Arquibancada", "Pista"],
    respostaCorreta: "Pista" },
  { livro: idProg5, numero: 146, categoria: "Palavras cruzadas",
    enunciado: "(Vertical) Ele também é recordista de pole positions sucessivas.",
    alternativas: ["Fangio", "Piquet", "Jim Clark", "Senna"],
    respostaCorreta: "Senna" },

  // --- O que eles fazem (147-150) ---
  { livro: idProg5, numero: 147, categoria: "O que eles fazem",
    enunciado: "Eles marcam e controlam o tempo gasto pelos carros em cada volta.",
    alternativas: ["Bandeirinhas", "Pilotos", "Relógios", "Cronometristas"],
    respostaCorreta: "Cronometristas" },
  { livro: idProg5, numero: 148, categoria: "O que eles fazem",
    enunciado: "Eles regulam e fazem os acertos nos carros.",
    alternativas: ["Bombeiros", "Mecânicos", "Médicos", "Juízes"],
    respostaCorreta: "Mecânicos" },
  { livro: idProg5, numero: 149, categoria: "O que eles fazem",
    enunciado: "Estes homens estão sempre a postos para uma possível emergência.",
    alternativas: ["Motoristas", "Barbeiros", "Jóqueis", "Bombeiros"],
    respostaCorreta: "Bombeiros" },
  { livro: idProg5, numero: 150, categoria: "O que eles fazem",
    enunciado: "Eles se distribuem ao longo da pista para advertir os pilotos em várias situações.",
    alternativas: ["Médicos", "Bandeirinhas", "Bombeiros", "Mecânicos"],
    respostaCorreta: "Bandeirinhas" },
];

// ---------------------------------------------------------------
// 3) Seed
// ---------------------------------------------------------------
async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const livrosCol = db.collection("livros");
    const perguntasCol = db.collection("perguntas");

    // Evita duplicar se rodar de novo: remove só os códigos deste livro
    const codigos = livros.map((l) => l.codigo);
    const livrosAntigos = await livrosCol.find({ codigo: { $in: codigos } }).toArray();
    const idsAntigos = livrosAntigos.map((l) => l._id);
    if (idsAntigos.length) {
      await perguntasCol.deleteMany({ livro: { $in: idsAntigos } });
      await livrosCol.deleteMany({ _id: { $in: idsAntigos } });
      console.log(`Removidos ${idsAntigos.length} livro(s) e suas perguntas antigas.`);
    }

    const resLivros = await livrosCol.insertMany(livros);
    console.log(`Inseridos ${resLivros.insertedCount} livros (programas).`);

    const resPerguntas = await perguntasCol.insertMany(perguntas);
    console.log(`Inseridas ${resPerguntas.insertedCount} perguntas.`);

    console.log("\nSeed concluído. Revise os itens marcados com // ⚠ antes de publicar.");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Erro ao rodar o seed:", err);
  process.exit(1);
});

