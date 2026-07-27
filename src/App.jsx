import { useState, useEffect } from "react";

import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
// Poster URLs diretas do TMDB — carregam no browser do usuário
const POSTERS = {
  "Avatar - Fogo e Cinzas":        "https://image.tmdb.org/t/p/w300/nHf61UzkfFno5X1ofIjkf9b5joL.jpg",
  "Caramelo":                      "https://image.tmdb.org/t/p/w300/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg",
  "Greenland 2 - Destruição Total":"https://image.tmdb.org/t/p/w300/fOjMDreBq0FLXzSjEQzNkO8cEVT.jpg",
  "Pânico 7":                      "https://image.tmdb.org/t/p/w300/5oADkJGXFAFGvYvlDd0EL4Bp0Dm.jpg",
  "Justiça Artificial - Mercy":    "https://image.tmdb.org/t/p/w300/6oom5dkOmqKFUkHyPSbzTIBuXMI.jpg",
  "O Agente Secreto":              "https://image.tmdb.org/t/p/w300/mXLOHHc1Zeuwsl4xYKjKh2280oL.jpg",
  "Bagagem de Risco":              "https://image.tmdb.org/t/p/w300/A7AoNT06aRAc4SV89Dwxj3EYCHs.jpg",
  "Hamnet":                        "https://image.tmdb.org/t/p/w300/aYVRRqfGkMhBKsxBOyFQ2UjuHpT.jpg",
  "A Empregada":                   "https://image.tmdb.org/t/p/w300/rTh4K5FEwNrXEgrDwVkq1FIxRJN.jpg",
  "O Som da Morte":                "https://image.tmdb.org/t/p/w300/t2LpcdbIhCxJvCHXJEnD1gK4GFQ.jpg",
  "Jogo dos Predadores":           "https://image.tmdb.org/t/p/w300/uKb22E0xDIkBBWNOoGSjMYiOqUy.jpg",
  "O Diabo Veste Prada 2":         "https://image.tmdb.org/t/p/w300/7BWAuWaGFiTHtGGlvHvDHDltkKs.jpg",
  "Dungeons & Dragons":            "https://image.tmdb.org/t/p/w300/A7AoNT06aRAc4SV89Dwxj3EYCHs.jpg",
  "Meu Melhor Amigo":              "https://image.tmdb.org/t/p/w300/qnqGbB22YJ7dSs4o6M7exAtylS5.jpg",
  "Locked":                        "https://image.tmdb.org/t/p/w300/dkckd4Gq94PBJ8GBWP0PdmNXxlq.jpg",
  "Ice Fall":                      "https://image.tmdb.org/t/p/w300/4YZgsm9Bpkk7WZiSMFOFaIKQbBH.jpg",
  "Rebel Ridge":                   "https://image.tmdb.org/t/p/w300/5KCVkau1HEl7ZzSPXIItu2fqHLy.jpg",
  "Força Bruta":                   "https://image.tmdb.org/t/p/w300/z1p34vh7dEOnLJ2so7NTk3OfTsm.jpg",
  "Good Boy":                      "https://image.tmdb.org/t/p/w300/j2HqxMQ8k8JGIFVPMTqHLrwFb6X.jpg",
  "Maldição da Múmia":             "https://image.tmdb.org/t/p/w300/nfOOFmJR0GlRtkNIhObTr0bv4Eg.jpg",
  "Socorro":                       "https://image.tmdb.org/t/p/w300/4FJuNbwAFBqFiGpNNXpL5BDlKYJ.jpg",
  "O Silêncio dos Inocentes":      "https://image.tmdb.org/t/p/w300/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
  "Enterramos os Mortos":          "https://image.tmdb.org/t/p/w300/6FRFIogh3zFnVWn7Z6oeajvFbgQ.jpg",
  "Shelter":                       "https://image.tmdb.org/t/p/w300/qA5kPYZA7FkVvqnzgu8PUeB7Yku.jpg",
  "Obsessiva":                     "https://image.tmdb.org/t/p/w300/A7AoNT06aRAc4SV89Dwxj3EYCHs.jpg",
  "Obsessão":                      "https://image.tmdb.org/t/p/w300/d5sGgCRLbHmxFDwCQRECPmFqkbK.jpg",
  "Firebird 2":                    "https://image.tmdb.org/t/p/w300/aozRmXcRuYbOnI3VZj2sdHjvUqQ.jpg",
  "Cangaço Novo 2":                "https://image.tmdb.org/t/p/w300/h0MJKN84pDTAYxW3e1kLqzxk9gK.jpg",
  "On the Sea":                    "https://image.tmdb.org/t/p/w300/7BWAuWaGFiTHtGGlvHvDHDltkKs.jpg",
  "Jurado Nº 2":                   "https://image.tmdb.org/t/p/w300/5BGLWvqJrBmFl7xjDerILVxG6qR.jpg",
  "Código Preto":                  "https://image.tmdb.org/t/p/w300/bXi6IQiQDHD00JFio5ZSZOeJNPn.jpg",
  "Casa de Dinamite":              "https://image.tmdb.org/t/p/w300/oX9RYPR4WtTVVCO8B08oNL3bvkE.jpg",
  "Mestres do Universo":           "https://image.tmdb.org/t/p/w300/xYHHJ9benFkoKbS0pVHJhFcPpbz.jpg",
  "Se Eu Fosse Você 3":            "https://image.tmdb.org/t/p/w300/seEuFosseVoce3.jpg",
  "Marfil":                        "https://image.tmdb.org/t/p/w300/marfil2026primeVideo.jpg",
  "Águas Mortais":                 "https://image.tmdb.org/t/p/w300/aguasMortais2026.jpg",
  "Baby":                          "https://image.tmdb.org/t/p/w300/baby2024marcelo.jpg",
  "Confia em Mim":                 "https://image.tmdb.org/t/p/w300/confiaEmMim2014.jpg",
  "Eu e Você na Toscana":          "https://image.tmdb.org/t/p/w300/youmetuscany2026.jpg",
  "Jack Ryan: Guerra Fantasma":    "https://image.tmdb.org/t/p/w300/jackryanghost2026.jpg",
  "Segredos de Guerra":            "https://image.tmdb.org/t/p/w300/qnqGbB22YJ7dSs4o6M7exAtylS5.jpg",
  "God's Own Country":             "https://image.tmdb.org/t/p/w300/lMTQ4WiOc9O0EMiH7SYs1tzdVLb.jpg",
  "A Odisseia":                    "https://image.tmdb.org/t/p/w300/odisseia2026nolan.jpg",
  "Michael":                       "https://image.tmdb.org/t/p/w300/michael2026jackson.jpg",
  "Viagem Sem Retorno":            "https://image.tmdb.org/t/p/w300/viagemSemRetorno2026.jpg",
  "Golpe Explosivo":               "https://image.tmdb.org/t/p/w300/kXfDnWgFBNvBFmYbpEBByJYthxq.jpg",
};
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

function usePoster(itemId, title, year) {
  const [posterUrl, setPosterUrl] = useState(POSTERS[title] || null);

  useEffect(() => {
    if (POSTERS[title]) return;

    let cancelled = false;

    async function loadPoster() {
      const ref = doc(db, "posters", String(itemId));
      const cached = await getDoc(ref);
      if (cached.exists()) {
        if (!cancelled) setPosterUrl(cached.data().url);
        return;
      }
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&year=${year || ""}&language=pt-BR`
        );
        const data = await res.json();
        const path = data.results?.[0]?.poster_path;
        if (path) {
          const url = `https://image.tmdb.org/t/p/w300${path}`;
          await setDoc(ref, { url, title, cachedAt: Date.now() });
          if (!cancelled) setPosterUrl(url);
        }
      } catch (e) {
        console.error("Erro ao buscar poster TMDB:", e);
      }
    }

    loadPoster();
    return () => { cancelled = true; };
  }, [itemId, title, year]);

  return posterUrl;
}

const SEED_WATCHED = [
  { id: 115, title: "Avatar - Fogo e Cinzas", year: 2025, genre: "Ação", rating: 10, platform: "Cinema", note: "Jake Sully e Neytiri enfrentam o Povo das Cinzas, uma nova e violenta tribo Na'vi liderada por Varang, enquanto lidam com o luto pela perda do filho mais velho. Dir. James Cameron.", watchedDate: "04/01/2026" },
  { id: 122, title: "Caramelo", year: 2025, genre: "Drama", rating: 9, platform: "Netflix", note: "Pedro, um chef prestes a realizar o sonho de ter seu próprio restaurante, tem a vida revirada por um diagnóstico inesperado. Com a ajuda de um vira-lata caramelo, ele redescobre o significado da vida.", watchedDate: "05/01/2026" },
  { id: 118, title: "Greenland 2 - Destruição Total", year: 2025, genre: "Suspense", rating: 6, platform: "", note: "A família Garrity sobreviveu ao impacto do cometa que devastou a Terra. Agora deixam o bunker na Groenlândia e embarcam em uma perigosa jornada pelo deserto congelado da Europa em busca de um novo lar. Com Gerard Butler.", watchedDate: "10/01/2026" },
  { id: 116, title: "Pânico 7", year: 2026, genre: "Terror", rating: 9, platform: "Cinema", note: "Um novo Ghostface surge na cidade onde Sidney Prescott (Neve Campbell) reconstruiu sua vida. Seus piores medos se tornam reais quando sua filha se torna o próximo alvo do serial killer mascarado.", watchedDate: "01/02/2026" },
  { id: 119, title: "Justiça Artificial - Mercy", year: 2026, genre: "Suspense", rating: 9, platform: "Cinema", note: "Em Los Angeles do futuro (2029), um detetive acusado de matar sua esposa tem apenas 90 minutos para provar sua inocência a um juiz de Inteligência Artificial. Com Chris Pratt e Rebecca Ferguson.", watchedDate: "01/03/2026" },
  { id: 110, title: "O Agente Secreto", year: 2026, genre: "Política", rating: 5, platform: "", note: "Thriller político de espionagem.", watchedDate: "01/03/2026" },
  { id: 102, title: "Bagagem de Risco", year: 2024, genre: "Ação / Suspense", rating: 8, platform: "Netflix", note: "Na véspera do Natal, um jovem agente de segurança aeroportuária é chantageado para deixar passar um pacote perigoso num voo. Com Taron Egerton e Jason Bateman.", watchedDate: "01/03/2026" },
  { id: 120, title: "Hamnet", year: 2025, genre: "Drama", rating: 8, platform: "", note: "A história de Agnes, esposa de William Shakespeare (Paul Mescal), enquanto enfrenta o luto pela perda de seu filho Hamnet, de 11 anos. O drama que inspirou Hamlet. Dir. Chloé Zhao.", watchedDate: "31/03/2026" },
  { id: 121, title: "A Empregada", year: 2025, genre: "Suspense", rating: 10, platform: "Cinema", note: "Millie (Sydney Sweeney) trabalha como empregada para Nina (Amanda Seyfried) e Andrew, um casal milionário. Os segredos dessa família são muito mais perigosos do que parecem.", watchedDate: "01/04/2026" },
  { id: 123, title: "O Som da Morte", year: 2025, genre: "Terror", rating: 9, platform: "", note: "Um grupo de estudantes encontra um antigo Apito da Morte Asteca amaldiçoado. Ao soprá-lo, descobrem que o som aterrorizante invoca suas próprias mortes futuras para caçá-los.", watchedDate: "15/04/2026" },
  { id: 2, title: "Jogo dos Predadores", year: 2025, genre: "Suspense", rating: 9, platform: "", note: "Thriller de suspense.", watchedDate: "02/05/2026" },
  { id: 5, title: "O Diabo Veste Prada 2", year: 2025, genre: "Comédia", rating: 9, platform: "Cinema", note: "Continuação do clássico de 2006.", watchedDate: "04/05/2026" },
  { id: 117, title: "Dungeons & Dragons", year: 2023, genre: "Fantasia", rating: 8, platform: "", note: "Um grupo improvável de aventureiros embarca em uma missão épica nas terras de Faerûn. Repleto de humor, magia e criaturas fantásticas.", watchedDate: "05/05/2026" },
  { id: 3, title: "Meu Melhor Amigo", year: 2025, genre: "LGBT", rating: 7, platform: "", note: "Drama LGBT.", watchedDate: "09/05/2026" },
  { id: 1, title: "Locked", year: 2025, genre: "Suspense / Ação", rating: 8, platform: "Streaming", note: "Eddie (Bill Skarsgård) arromba um SUV de luxo e cai numa armadilha mortal preparada por William (Anthony Hopkins), um autoproclamado justiceiro com sua própria e distorcida marca de justiça.", watchedDate: "10/05/2026" },
  { id: 4, title: "Ice Fall", year: 2025, genre: "Ação", rating: 7, platform: "", note: "Filme de ação.", watchedDate: "10/05/2026" },
  { id: 101, title: "Rebel Ridge", year: 2024, genre: "Thriller Policial", rating: 8, platform: "Netflix", note: "Um ex-fuzileiro naval entra em conflito com um chefe de polícia corrupto ao ter seu dinheiro confiscado. Ele vai até as últimas consequências para recuperá-lo. 96% no Rotten Tomatoes.", watchedDate: "17/05/2026" },
  { id: 109, title: "Força Bruta", year: 2022, genre: "Ação", rating: 8, platform: "", note: "O detetive Ma Seok-do viaja ao Vietnã para extraditar um suspeito, mas descobre uma rede de crimes comandada pelo impiedoso assassino Kang. Mesmo sem autoridade legal, ele vai atrás do vilão do seu jeito. (The Roundup)", watchedDate: "18/05/2026" },
  { id: 111, title: "Good Boy", year: 2025, genre: "Terror", rating: 6, platform: "Streaming", note: "Terror contado sob a perspectiva do cão Indy, que percebe forças sobrenaturais invisíveis aos humanos numa casa no campo e tenta proteger seu dono a todo custo.", watchedDate: "19/05/2026" },
  { id: 113, title: "Maldição da Múmia", year: 2026, genre: "Terror", rating: 9, platform: "Cinema", note: "A filha de um jornalista desaparece no deserto sem deixar rastros. Oito anos depois ela reaparece — mas o reencontro se transforma num pesadelo aterrorizante. Dir. Lee Cronin.", watchedDate: "22/05/2026" },
  { id: 114, title: "Socorro", year: 2026, genre: "Ação", rating: 9, platform: "", note: "Linda e seu chefe machista sobrevivem a um acidente aéreo numa ilha deserta. O jogo de poder do escritório vira de cabeça para baixo. Com Rachel McAdams e Dylan O'Brien. Dir. Sam Raimi.", watchedDate: "22/05/2026" },
  { id: 128, title: "Obsessiva", year: 2009, genre: "Suspense", rating: 9, platform: "", note: "Um executivo bem-sucedido (Idris Elba) casado com Sharon (Beyoncé) tem sua vida destruída quando uma estagiária obcecada (Ali Larter) passa a persegui-lo. A batalha final entre Beyoncé e a loira é uma das cenas mais icônicas do filme. Dir. Steve Shill.", watchedDate: "21/05/2026" },
  { id: 125, title: "Enterramos os Mortos", year: 2026, genre: "Terror", rating: 7, platform: "", note: "Um desastre militar catastrófico traz os mortos de volta à vida transformados em caçadores. Ava (Daisy Ridley) entra numa zona de quarentena em busca do marido desaparecido e descobre que os mortos-vivos estão se tornando cada vez mais perigosos. Dir. Zak Hilditch.", watchedDate: "23/05/2026" },
  { id: 126, title: "Shelter", year: 2026, genre: "Ação", rating: 9, platform: "", note: "Mason (Jason Statham), ex-assassino do MI6 vivendo em isolamento numa ilha escocesa, salva uma jovem de uma tempestade mortal. O ato desencadeia uma caçada implacável ao seu passado sombrio. Com Bill Nighy e Naomi Ackie. Dir. Ric Roman Waugh.", watchedDate: "24/05/2026" },
  { id: 130, title: "Eu e Você na Toscana", year: 2026, genre: "Romance", rating: 10, platform: "Cinema", note: "Depois de perder o emprego e o apartamento no mesmo dia, Anna (Halle Bailey) toma a decisão mais impulsiva da sua vida: se instalar na vila de um homem que mal conhece, no coração da Toscana. Quando inventa ser a noiva dele, o primo charmoso Michael (Regé-Jean Page) chega e complica tudo. Dir. Kat Coiro.", watchedDate: "26/05/2026" },
  { id: 131, title: "Jack Ryan: Guerra Fantasma", year: 2026, genre: "Ação", rating: 8, platform: "Prime Video", note: "Jack Ryan (John Krasinski) é forçado a retornar ao campo quando uma missão secreta internacional revela uma conspiração mortal. Com o apoio da agente do MI6 Emma Marlowe (Sienna Miller), ele enfrenta uma teia de traições e um passado que acreditava ter ficado para trás. Dir. Andrew Bernstein.", watchedDate: "26/05/2026" },
  { id: 132, title: "Segredos de Guerra", year: 2021, genre: "Drama / LGBT", rating: 10, platform: "", note: "Estônia, década de 1970, auge da Guerra Fria. O jovem soldado Sergey (Tom Prior) e sua namorada Luisa servem numa base aérea soviética. O amor proibido que nasce entre Sergey e o ousado piloto Roman (Oleg Zagorodnii) precisa ser mantido em segredo a todo custo — Roman está na mira da KGB. Baseado em fatos reais. Dir. Peeter Rebane.", watchedDate: "04/06/2026" },
  { id: 134, title: "Golpe Explosivo", year: 2026, genre: "Ação / Thriller", rating: 10, platform: "Cinema", note: "Uma bomba não detonada da Segunda Guerra Mundial é descoberta num canteiro de obras em Londres, forçando a evacuação do centro da cidade. Enquanto o especialista Will (Aaron Taylor-Johnson) tenta desarmá-la, uma quadrilha liderada por Karalis (Theo James) aproveita o caos para executar um audacioso assalto. 81% no Rotten Tomatoes. Dir. David Mackenzie.", watchedDate: "07/06/2026" },
  { id: 108, title: "Obsessão", year: 2026, genre: "Terror", rating: 7, platform: "Cinema", note: "O filme de terror mais bem avaliado de 2026. Dir. Curry Barker.", watchedDate: "07/06/2026" },
  { id: 136, title: "Michael", year: 2026, genre: "Drama / Musical", rating: 10, platform: "Cinema", note: "Cinebiografia do Rei do Pop Michael Jackson, interpretado pelo sobrinho Jaafar Jackson. Retrata sua jornada desde o talento extraordinário como líder do Jackson Five até se tornar o maior entertainer do mundo. Com Nia Long, Kat Graham, Miles Teller e Colman Domingo. Segunda maior bilheteria mundial de 2026. Dir. Antoine Fuqua.", watchedDate: "09/06/2026" },
  { id: 137, title: "Viagem Sem Retorno", year: 2026, genre: "Comédia / Suspense", rating: 8, platform: "Prime Video", note: "Dan (Jason Segel) e Lisa (Samara Weaving) viajam para uma cabana isolada com a desculpa de salvar o casamento. Mas cada um esconde o mesmo plano: matar o outro. O caos aumenta quando criminosos fugitivos invadem a cabana e a briga conjugal vira luta pela sobrevivência. Dir. Jorma Taccone.", watchedDate: "10/06/2026" },
  { id: 139, title: "Águas Mortais", year: 2026, genre: "Ação / Terror", rating: 8, platform: "Cinema", note: "Voo de Los Angeles para Xangai cai no Oceano Pacífico. Os sobreviventes precisam lutar pela vida em águas infestadas de tubarões enquanto o avião afunda. Com Aaron Eckhart e Ben Kingsley. Dir. Renny Harlin.", watchedDate: "23/06/2026" },
  { id: 140, title: "Baby", year: 2024, genre: "Drama / LGBT", rating: 8, platform: "", note: "Wellington (João Pedro Mariano), apelidado de Baby, é liberado de um centro de detenção juvenil e se vê perdido nas ruas de São Paulo. Ao conhecer Ronaldo (Ricardo Teodoro), um garoto de programa, os dois desenvolvem uma paixão conflituosa. Premiado na Semana da Crítica de Cannes 2024. Dir. Marcelo Caetano.", watchedDate: "28/06/2026" },
  { id: 124, title: "O Silêncio dos Inocentes", year: 1991, genre: "Suspense", rating: 7, platform: "", note: "A agente novata do FBI Clarice Starling (Jodie Foster) busca a ajuda do psiquiatra canibal Dr. Hannibal Lecter (Anthony Hopkins) para traçar o perfil de um serial killer que esfola suas vítimas, o Buffalo Bill. Vencedor de 5 Oscars. Dir. Jonathan Demme.", watchedDate: "25/05/2026" },
];

const SEED_TOWATCH = [
  { id: 141, title: "Confia em Mim", year: 2014, genre: "Suspense", platform: "Netflix", note: "Mari (Fernanda Machado), chef de cozinha que sonha em ter seu restaurante, se envolve com Caio (Mateus Solano), um charmoso investidor. Mas as coisas não são o que parecem. Thriller brasileiro disponível na Netflix. Dir. Michel Tikhomiroff." },
  { id: 138, title: "Marfil", year: 2026, genre: "Romance / Suspense", platform: "Prime Video", note: "Marfil Cortés (Ester Expósito), filha de um magnata espanhol, é sequestrada em Nova York e libertada misteriosamente. Seu pai contrata o enigmático Sebastian Moore (Hugo Diego García) como guarda-costas. Uma atração irresistível surge entre os dois. Da autora de Minha Culpa. Estreia setembro de 2026." },
  { id: 135, title: "A Odisseia", year: 2026, genre: "Épico / Ação", platform: "Cinema", note: "Dez anos após a queda de Troia, o rei Odisseu (Matt Damon) tenta voltar para Ítaca enfrentando o Ciclope Polifemo, as Sereias e deuses caprichosos. Sua esposa Penélope (Anne Hathaway) resiste aos pretendentes enquanto aguarda seu retorno. Com Tom Holland, Zendaya, Robert Pattinson e Charlize Theron. Dir. Christopher Nolan. Estreia 16/07/2026." },
  { id: 133, title: "God's Own Country", year: 2017, genre: "Drama / LGBT", platform: "", note: "Considerado por muitos o melhor filme gay de todos os tempos. Johnny, um jovem fazendeiro de Yorkshire sobrecarregado e amargurado, afoga suas frustrações em álcool. Quando contrata Gheorghe, um imigrante experiente no campo, uma relação conflituosa vai se transformando em amor profundo. Dir. Francis Lee." },
  { id: 127, title: "Mestres do Universo", year: 2026, genre: "Ação / Fantasia", platform: "Cinema", note: "O Príncipe Adam retorna a Eternia após 15 anos na Terra para se tornar He-Man e enfrentar Esqueleto. Com Nicholas Galitzine, Jared Leto, Camila Mendes e Idris Elba. Participação especial de Dolph Lundgren. Dir. Travis Knight. Estreia 04/06/2026." },
  { id: 129, title: "Se Eu Fosse Você 3", year: 2026, genre: "Comédia", platform: "Cinema", note: "Duas décadas após a última troca de corpos, Cláudio (Tony Ramos) e Helena (Glória Pires) vivem nova fase ao lado da filha Bia (Cleo Pires), adulta e casada com Aquiles (Rafael Infante). O raio cai novamente e a família toda precisa se colocar no lugar do outro — literalmente. Dir. Anita Barbosa. Estreia 04/06/2026." },
  { id: 107, title: "Cangaço Novo 2", year: 2025, genre: "", platform: "", note: "" },
  { id: 106, title: "On the Sea", year: 2025, genre: "Drama", platform: "", note: "Drama britânico ambientado numa comunidade pesqueira do País de Gales que explora masculinidade, desejo e identidade. Com Barry Ward e Lorne MacFadyen. Dir. Helen Walsh." },
  { id: 103, title: "Jurado Nº 2", year: 2024, genre: "Suspense Psicológico", platform: "Max", note: "Um homem integra o júri de um julgamento por assassinato e se vê num dilema moral capaz de mudar o veredito. Última direção de Clint Eastwood." },
  { id: 104, title: "Código Preto", year: 2025, genre: "Espionagem", platform: "Cinema", note: "Um casal de espiões tem a relação colocada em risco quando um vazamento torna a mulher suspeita de trair a nação. Com Michael Fassbender e Cate Blanchett." },
  { id: 105, title: "Casa de Dinamite", year: 2025, genre: "Ação / Thriller", platform: "Netflix", note: "O caos se instaura nos EUA após um míssil nuclear atingir Chicago. Com Idris Elba e Rebecca Ferguson." },
];

const STARS = [1,2,3,4,5,6,7,8,9,10];
const EMPTY_FORM = { title:"", year: new Date().getFullYear(), genre:"", platform:"", note:"", userNote:"", rating:7, watchedDate:"", mediaType:"filme" };

const ratingColor = (r) => r >= 9 ? "#f5c518" : r >= 7 ? "#e8a838" : "#c0392b";
const ratingBg    = (r) => r >= 9 ? "#3a2a00" : r >= 7 ? "#2a1800" : "#2a1010";

const GENRE_COLORS = [
  ["#7c3aed","#4c1d95"],["#0891b2","#164e63"],["#059669","#064e3b"],
  ["#dc2626","#7f1d1d"],["#d97706","#78350f"],["#db2777","#831843"],
  ["#65a30d","#365314"],["#6366f1","#312e81"],["#0e7490","#164e63"],
  ["#9333ea","#581c87"],
];

const parseDate = (str) => {
  if (!str) return 0;
  const p = str.split("/");
  if (p.length < 3) return 0;
  return new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime();
};

const sortByDateDesc = (arr) => [...arr].sort((a,b) => parseDate(b.watchedDate) - parseDate(a.watchedDate));

const inputStyle = {
  width:"100%", background:"#0e0c16", border:"1px solid #3a2a40",
  borderRadius:6, padding:"8px 10px", color:"#e8e0cc",
  fontSize:13, fontFamily:"Georgia, serif", boxSizing:"border-box", outline:"none",
};

const FieldLabel = ({ label }) => (
  <div style={{ fontSize:10, color:"#7a6a80", fontFamily:"monospace", marginBottom:3, letterSpacing:1 }}>{label}</div>
);

const FilmStrip = () => (
  <div style={{ display:"flex", opacity:0.15 }}>
    {Array(20).fill(0).map((_,i) => (
      <div key={i} style={{ width:20, height:13, border:"1.5px solid #f5c518", marginRight:3, borderRadius:2, background:i%3===0?"#f5c51822":"transparent" }} />
    ))}
  </div>
);

function Poster({ itemId, title, year, size=70 }) {
  const url = usePoster(itemId, title, year);
  const [ok, setOk] = useState(true);

  return url && ok ? (
    <img
      src={url} alt={title}
      onError={() => setOk(false)}
      style={{ width:size, minWidth:size, height:size*1.5, objectFit:"cover", borderRadius:7, border:"1px solid #2a1a30", flexShrink:0 }}
    />
  ) : (
    <div style={{ width:size, minWidth:size, height:size*1.5, background:"#1a1020", borderRadius:7, border:"1px solid #2a1a30", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🎬</div>
  );
}

function GenreCards({ films, type }) {
  const counts = {};
  films.forEach(f => { const g = f.genre||"Sem gênero"; counts[g]=(counts[g]||0)+1; });
  const genres = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if (!genres.length) return null;
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:10, letterSpacing:4, color:"#6a5a70", fontFamily:"monospace", marginBottom:10, textTransform:"uppercase" }}>
        {type==="watched" ? "📊 Gêneros assistidos" : "🎯 Gêneros na fila"}
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {genres.map(([genre, count], i) => {
          const [c1, c2] = GENRE_COLORS[i % GENRE_COLORS.length];
          return (
            <div key={genre} style={{ background:`linear-gradient(135deg,${c1}22,${c2}33)`, border:`1px solid ${c1}55`, borderRadius:10, padding:"7px 12px", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:"#d0c8e0" }}>{genre}</span>
              <span style={{ background:c1+"44", color:c1, borderRadius:20, padding:"1px 8px", fontSize:11, fontWeight:"bold", fontFamily:"monospace" }}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilmModal({ title, film, isWatched, addTypeSelector, onSave, onClose }) {
  const [f, setF] = useState({ ...EMPTY_FORM, ...film });
  const set = (k,v) => setF(prev=>({...prev,[k]:v}));
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#14121c", border:"1px solid #3a2a50", borderRadius:"16px 16px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:500, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ fontSize:11, letterSpacing:4, color:"#f5c518", fontFamily:"monospace", marginBottom:14 }}>{title}</div>
        {addTypeSelector}

        {/* Tipo: Filme ou Série */}
        <div style={{ marginBottom:12 }}>
          <FieldLabel label="TIPO" />
          <div style={{ display:"flex", gap:8 }}>
            {[{k:"filme",l:"🎬 Filme"},{k:"serie",l:"📺 Série"}].map(t=>(
              <button key={t.k} onClick={()=>set("mediaType",t.k)} style={{
                flex:1, padding:"8px", borderRadius:6, cursor:"pointer", fontFamily:"monospace", fontSize:12,
                background:f.mediaType===t.k?"#f5c51822":"none",
                border:f.mediaType===t.k?"1px solid #f5c518":"1px solid #3a2a40",
                color:f.mediaType===t.k?"#f5c518":"#6a5a70",
              }}>{t.l}</button>
            ))}
          </div>
        </div>

        {[
          {label:"TÍTULO *",key:"title",placeholder:"Título do filme ou série"},
          {label:"ANO",key:"year",placeholder:"2025"},
          {label:"GÊNERO",key:"genre",placeholder:"Ex: Suspense / Ação"},
          {label:"PLATAFORMA",key:"platform",placeholder:"Ex: Netflix, Prime, Cinema..."},
          {label:"SINOPSE",key:"note",placeholder:"Descrição do enredo..."},
        ].map(fi=>(
          <div key={fi.key} style={{ marginBottom:10 }}>
            <FieldLabel label={fi.label} />
            <input value={f[fi.key]||""} onChange={e=>set(fi.key,e.target.value)} placeholder={fi.placeholder} style={inputStyle} />
          </div>
        ))}

        {isWatched && <>
          <div style={{ marginBottom:10 }}>
            <FieldLabel label="DATA QUE ASSISTIU (dd/mm/aaaa)" />
            <input value={f.watchedDate||""} onChange={e=>set("watchedDate",e.target.value)} placeholder="ex: 22/07/2026" style={{...inputStyle,fontFamily:"monospace"}} />
          </div>
          <div style={{ marginBottom:10 }}>
            <FieldLabel label="MINHA OPINIÃO" />
            <textarea value={f.userNote||""} onChange={e=>set("userNote",e.target.value)} placeholder="O que você achou? Pontos fortes, fracos, momentos marcantes..." style={{...inputStyle, minHeight:80, resize:"vertical"}} />
          </div>
          <div style={{ marginBottom:14 }}>
            <FieldLabel label="NOTA (1–10)" />
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {STARS.map(n=>(
                <button key={n} onClick={()=>set("rating",n)} style={{
                  width:34,height:34,borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontWeight:"bold",fontSize:13,
                  background:f.rating===n?ratingBg(n):"#1a1020",
                  border:`1px solid ${f.rating===n?ratingColor(n):"#3a2a40"}`,
                  color:f.rating===n?ratingColor(n):"#6a5a70",
                }}>{n}</button>
              ))}
            </div>
          </div>
        </>}
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <button onClick={onClose} style={{ flex:1,padding:"11px",background:"none",border:"1px solid #3a2a40",color:"#6a5a70",borderRadius:8,cursor:"pointer",fontFamily:"monospace",fontSize:13 }}>Cancelar</button>
          <button onClick={()=>{ if(!f.title.trim()) return; onSave(f); }} style={{ flex:2,padding:"11px",background:"#f5c518",border:"none",color:"#0a0a0f",borderRadius:8,cursor:"pointer",fontFamily:"monospace",fontSize:13,fontWeight:"bold",letterSpacing:1 }}>💾 SALVAR</button>
        </div>
      </div>
    </div>
  );
}

// ─── STATS TAB ────────────────────────────────────────────────────────────────
const MONTH_NAMES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function StatsTab({ watched, onEditFilm }) {
  const [viewMode, setViewMode] = useState("month");
  const [selectedYear, setSelectedYear] = useState(null);

  const byYearMonth = {};
  watched.forEach(f => {
    if (!f.watchedDate) return;
    const p = f.watchedDate.split("/");
    if (p.length < 3) return;
    const y = p[2], m = parseInt(p[1]) - 1;
    if (!byYearMonth[y]) byYearMonth[y] = Array(12).fill(0);
    byYearMonth[y][m]++;
  });

  const years = Object.keys(byYearMonth).sort();
  const yearCounts = years.map(y => byYearMonth[y].reduce((a,b)=>a+b,0));
  const maxYear = Math.max(...yearCounts, 1);
  const drillYear = selectedYear || years[years.length-1];
  const monthData = byYearMonth[drillYear] || Array(12).fill(0);
  const maxMonth = Math.max(...monthData, 1);

  // Type breakdown
  const filmes = watched.filter(f=>f.mediaType==="serie" ? false : true);
  const series = watched.filter(f=>f.mediaType==="serie");

  // Platform breakdown
  const platformCounts = {};
  watched.forEach(f => {
    const p = f.platform || "Sem plataforma";
    platformCounts[p] = (platformCounts[p]||0)+1;
  });
  const platforms = Object.entries(platformCounts).sort((a,b)=>b[1]-a[1]);
  const maxPlat = Math.max(...platforms.map(p=>p[1]), 1);

  // Genre stats
  const genreCounts = {};
  watched.forEach(f => { const g = f.genre||"Sem gênero"; genreCounts[g]=(genreCounts[g]||0)+1; });
  const topGenres = Object.entries(genreCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);

  // Avg rating
  const withRating = watched.filter(f=>f.rating);
  const avg = withRating.length ? (withRating.reduce((s,f)=>s+f.rating,0)/withRating.length).toFixed(1) : "—";
  const top = [...watched].filter(f=>f.rating).sort((a,b)=>b.rating-a.rating).slice(0,3);

  // Incomplete items
  const incomplete = watched.filter(f => !f.watchedDate || !f.genre || !f.rating || f.rating===7 && !f.userNote);

  const BAR_COLORS = ["#f5c518","#e8a838","#0891b2","#7c3aed","#059669","#dc2626","#db2777","#65a30d"];

  const statBox = (label, value, sub) => (
    <div style={{ background:"#14121c", border:"1px solid #2a2030", borderRadius:10, padding:"14px 16px", flex:1, minWidth:90, textAlign:"center" }}>
      <div style={{ fontSize:22, fontWeight:"bold", color:"#f5c518", fontFamily:"monospace" }}>{value}</div>
      <div style={{ fontSize:11, color:"#d0c0a0", marginTop:3 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:"#6a5a40", marginTop:2, fontFamily:"monospace" }}>{sub}</div>}
    </div>
  );

  const platColor = (p) => {
    if (p==="Cinema") return "#f5c518";
    if (p==="Netflix") return "#e50914";
    if (p==="Prime Video") return "#00a8e0";
    if (p==="Max") return "#0078ff";
    if (p==="Disney+") return "#113ccf";
    if (p==="Apple TV+") return "#888";
    if (p==="Streaming") return "#059669";
    return "#7c3aed";
  };

  return (
    <div>
      {/* Summary boxes */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
        {statBox("Total", watched.length, "assistidos")}
        {statBox("🎬 Filmes", filmes.length)}
        {statBox("📺 Séries", series.length)}
        {statBox("⭐ Média", avg, "/ 10")}
      </div>

      {/* Incomplete indicator */}
      {incomplete.length > 0 && (
        <div style={{ background:"#2a1a00", border:"1px solid #f5c51855", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
          <div style={{ fontSize:11, color:"#f5c518", fontFamily:"monospace", letterSpacing:2, marginBottom:10 }}>⚠️ {incomplete.length} ITEM(NS) COM CAMPOS INCOMPLETOS</div>
          {incomplete.map(f=>(
            <div key={f.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, padding:"8px 10px", background:"#1a1000", borderRadius:7 }}>
              <div>
                <div style={{ fontSize:13, color:"#e8e0cc", fontWeight:"bold" }}>{f.title}</div>
                <div style={{ fontSize:10, color:"#8a7040", marginTop:2 }}>
                  {!f.watchedDate && "• sem data  "}
                  {!f.genre && "• sem gênero  "}
                  {!f.userNote && "• sem opinião"}
                </div>
              </div>
              <button onClick={()=>onEditFilm(f)} style={{ background:"#f5c51822", border:"1px solid #f5c518", color:"#f5c518", borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:11, fontFamily:"monospace" }}>✏️ Editar</button>
            </div>
          ))}
        </div>
      )}

      {/* Year/Month toggle */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[{k:"year",l:"📅 Por Ano"},{k:"month",l:"🗓️ Por Mês"},{k:"platform",l:"📡 Por Plataforma"}].map(m=>(
          <button key={m.k} onClick={()=>setViewMode(m.k)} style={{
            flex:1, padding:"7px 6px", borderRadius:6, cursor:"pointer", fontFamily:"monospace", fontSize:11,
            background:viewMode===m.k?"#f5c51822":"none",
            border:viewMode===m.k?"1px solid #f5c518":"1px solid #3a2a40",
            color:viewMode===m.k?"#f5c518":"#6a5a70",
          }}>{m.l}</button>
        ))}
      </div>

      {/* YEAR BAR CHART */}
      {viewMode==="year" && (
        <div style={{ background:"#14121c", border:"1px solid #2a2030", borderRadius:10, padding:"18px 16px", marginBottom:16 }}>
          <div style={{ fontSize:10, color:"#6a5a70", fontFamily:"monospace", letterSpacing:3, marginBottom:14, textTransform:"uppercase" }}>Assistidos por ano</div>
          {years.map((y,i) => (
            <div key={y} style={{ marginBottom:10, cursor:"pointer" }} onClick={()=>{ setSelectedYear(y); setViewMode("month"); }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:"#d0c0a0", fontFamily:"monospace" }}>{y}</span>
                <span style={{ fontSize:12, fontWeight:"bold", color:"#f5c518", fontFamily:"monospace" }}>{yearCounts[i]}</span>
              </div>
              <div style={{ background:"#1a1020", borderRadius:4, height:20 }}>
                <div style={{ height:"100%", borderRadius:4, width:`${(yearCounts[i]/maxYear)*100}%`, background:"linear-gradient(90deg,#f5c518,#e8a838)", transition:"width 0.5s" }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize:10, color:"#4a4040", marginTop:8, fontFamily:"monospace" }}>Toque em um ano para ver por mês →</div>
        </div>
      )}

      {/* MONTH BAR CHART */}
      {viewMode==="month" && (
        <div style={{ background:"#14121c", border:"1px solid #2a2030", borderRadius:10, padding:"18px 16px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#6a5a70", fontFamily:"monospace", letterSpacing:3, textTransform:"uppercase" }}>Mês a mês — {drillYear}</div>
            <div style={{ display:"flex", gap:6 }}>
              {years.map(y=>(
                <button key={y} onClick={()=>setSelectedYear(y)} style={{
                  padding:"3px 8px", borderRadius:4, cursor:"pointer", fontFamily:"monospace", fontSize:11,
                  background:drillYear===y?"#f5c51833":"none",
                  border:drillYear===y?"1px solid #f5c518":"1px solid #3a2a40",
                  color:drillYear===y?"#f5c518":"#6a5060",
                }}>{y}</button>
              ))}
            </div>
          </div>
          {MONTH_NAMES.map((m,i) => (
            <div key={m} style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:11, color:"#8a7a60", fontFamily:"monospace", width:28 }}>{m}</span>
                <span style={{ fontSize:11, fontWeight:"bold", color:monthData[i]>0?"#f5c518":"#3a3030", fontFamily:"monospace" }}>{monthData[i]||"—"}</span>
              </div>
              <div style={{ background:"#1a1020", borderRadius:3, height:14 }}>
                {monthData[i]>0 && <div style={{ height:"100%", borderRadius:3, width:`${(monthData[i]/maxMonth)*100}%`, background:"linear-gradient(90deg,#7c3aed,#0891b2)", transition:"width 0.5s" }} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PLATFORM CHART */}
      {viewMode==="platform" && (
        <div style={{ background:"#14121c", border:"1px solid #2a2030", borderRadius:10, padding:"18px 16px", marginBottom:16 }}>
          <div style={{ fontSize:10, color:"#6a5a70", fontFamily:"monospace", letterSpacing:3, marginBottom:14, textTransform:"uppercase" }}>📡 Por plataforma / onde assistiu</div>
          {platforms.map(([plat, count]) => (
            <div key={plat} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:"#d0c0a0" }}>{plat}</span>
                <span style={{ fontSize:12, fontWeight:"bold", color:platColor(plat), fontFamily:"monospace" }}>{count}</span>
              </div>
              <div style={{ background:"#1a1020", borderRadius:4, height:18 }}>
                <div style={{ height:"100%", borderRadius:4, width:`${(count/maxPlat)*100}%`, background:platColor(plat)+"99", transition:"width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top rated */}
      <div style={{ background:"#14121c", border:"1px solid #2a2030", borderRadius:10, padding:"16px", marginBottom:16 }}>
        <div style={{ fontSize:10, color:"#6a5a70", fontFamily:"monospace", letterSpacing:3, marginBottom:12, textTransform:"uppercase" }}>🏆 Mais bem avaliados</div>
        {top.map((f,i)=>(
          <div key={f.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <span style={{ fontSize:16, width:24, textAlign:"center" }}>{["🥇","🥈","🥉"][i]}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:"#e8e0cc", fontWeight:"bold" }}>{f.title} {f.mediaType==="serie"?"📺":""}</div>
              <div style={{ fontSize:10, color:"#6a5a40", fontFamily:"monospace" }}>{f.watchedDate}</div>
            </div>
            <div style={{ background:ratingBg(f.rating), border:`1.5px solid ${ratingColor(f.rating)}`, borderRadius:6, padding:"2px 8px", fontSize:15, fontWeight:"bold", color:ratingColor(f.rating), fontFamily:"monospace" }}>{f.rating}</div>
          </div>
        ))}
      </div>

      {/* Genre breakdown */}
      <div style={{ background:"#14121c", border:"1px solid #2a2030", borderRadius:10, padding:"16px" }}>
        <div style={{ fontSize:10, color:"#6a5a70", fontFamily:"monospace", letterSpacing:3, marginBottom:12, textTransform:"uppercase" }}>🎭 Gêneros favoritos</div>
        {topGenres.map(([genre, count],i)=>(
          <div key={genre} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontSize:12, color:"#d0c0a0" }}>{genre}</span>
              <span style={{ fontSize:12, fontWeight:"bold", color:BAR_COLORS[i%BAR_COLORS.length], fontFamily:"monospace" }}>{count}</span>
            </div>
            <div style={{ background:"#1a1020", borderRadius:3, height:12 }}>
              <div style={{ height:"100%", borderRadius:3, width:`${(count/watched.length)*100}%`, background:BAR_COLORS[i%BAR_COLORS.length]+"99", transition:"width 0.5s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function loadShared(key, fallback) {
  try {
    const snap = await getDoc(doc(db, "filmes", key));
    if (snap.exists()) return snap.data().value;
    return fallback;
  } catch { return fallback; }
}
async function saveShared(key, value) {
  try {
    await setDoc(doc(db, "filmes", key), { value });
  } catch(e) { console.error(e); }
}

export default function App() {
  const [watched, setWatchedRaw] = useState([]);
  const [toWatch, setToWatchRaw] = useState([]);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("watched");
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState("towatch");
  const [ratingPick, setRatingPick] = useState(null);
  const [datePick, setDatePick] = useState({});
  const [editData, setEditData] = useState(null);

  const setWatched = (fn) => {
    setWatchedRaw(prev => {
      const next = typeof fn==="function" ? fn(prev) : fn;
      saveShared("watched_v40", next);
      return next;
    });
  };
  const setToWatch = (fn) => {
    setToWatchRaw(prev => {
      const next = typeof fn==="function" ? fn(prev) : fn;
      saveShared("towatch_v40", next);
      return next;
    });
  };

  useEffect(() => {
    (async () => {
      const w = await loadShared("watched_v40", null);
      const t = await loadShared("towatch_v40", null);

      // Se Firebase está vazio, inicializa com SEED
      // Se Firebase tem dados, usa APENAS Firebase (source of truth)
      // Garante que filmes do SEED que ainda não estão no Firebase sejam adicionados uma vez
      if (w === null) {
        setWatchedRaw(SEED_WATCHED);
        saveShared("watched_v40", SEED_WATCHED);
      } else {
        // Adiciona apenas filmes do SEED que ainda não existem no Firebase (por ID)
        const firebaseIds = new Set(w.map(f=>f.id));
        const newFromSeed = SEED_WATCHED.filter(f=>!firebaseIds.has(f.id));
        const merged = newFromSeed.length > 0 ? [...w, ...newFromSeed] : w;
        if (newFromSeed.length > 0) saveShared("watched_v40", merged);
        setWatchedRaw(merged);
      }

      if (t === null) {
        setToWatchRaw(SEED_TOWATCH);
        saveShared("towatch_v40", SEED_TOWATCH);
      } else {
        const firebaseTIds = new Set(t.map(f=>f.id));
        const newFromSeedT = SEED_TOWATCH.filter(f=>!firebaseTIds.has(f.id));
        const mergedT = newFromSeedT.length > 0 ? [...t, ...newFromSeedT] : t;
        if (newFromSeedT.length > 0) saveShared("towatch_v40", mergedT);
        setToWatchRaw(mergedT);
      }

      setReady(true);
    })();
  }, []);

  const moveToWatched = (id, rating) => {
    const film = toWatch.find(f=>f.id===id);
    if (!film) return;
    const date = datePick[id]||"";
    const newFilm = {...film, rating, watchedDate: date};
    setToWatch(prev=>prev.filter(f=>f.id!==id));
    setWatched(prev=>sortByDateDesc([...prev, newFilm]));
    setRatingPick(null);
    setDatePick(prev=>{ const n={...prev}; delete n[id]; return n; });
  };

  const removeFilm = (id, from) => {
    if (from==="watched") setWatched(prev=>prev.filter(f=>f.id!==id));
    else setToWatch(prev=>prev.filter(f=>f.id!==id));
  };

  const saveNew = (form) => {
    const newFilm = {...form, id:Date.now(), year:Number(form.year)};
    if (addType==="watched") setWatched(prev=>[...prev, newFilm]);
    else setToWatch(prev=>[newFilm,...prev]);
    setShowAdd(false);
  };

  const saveEdit = (updated) => {
    const upd = {...updated, year:Number(updated.year)};
    if (editData.from==="watched") setWatched(prev=>prev.map(f=>f.id===upd.id?upd:f));
    else setToWatch(prev=>prev.map(f=>f.id===upd.id?upd:f));
    setEditData(null);
  };

  const sortedWatched = sortByDateDesc(watched);
  const avgRating = watched.length
    ? (watched.reduce((s,f)=>s+(f.rating||0),0)/watched.length).toFixed(1) : "—";

  const WatchedCard = ({ film }) => (
    <div style={{ background:"linear-gradient(135deg,#12100a,#0e0d08)", border:"1px solid #2a2030", borderLeft:`3px solid ${ratingColor(film.rating||0)}`, borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        <Poster title={film.title} size={70} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:15, fontWeight:"bold", color:"#fff" }}>{film.title}</span>
                {film.mediaType==="serie" && <span style={{ fontSize:10, background:"#0891b222", color:"#38bdf8", padding:"2px 7px", borderRadius:20, fontFamily:"monospace", border:"1px solid #0891b244" }}>📺 SÉRIE</span>}
                <span style={{ fontSize:10, color:"#6a5a40", fontFamily:"monospace" }}>{film.year}</span>
              </div>
              <div style={{ display:"flex", gap:5, marginTop:4, flexWrap:"wrap" }}>
                {film.genre && <span style={{ fontSize:10, background:"#1a1200", color:"#b09040", padding:"2px 7px", borderRadius:20, fontFamily:"monospace" }}>{film.genre}</span>}
                {film.platform && <span style={{ fontSize:10, background:"#0a0a1a", color:"#6080b0", padding:"2px 7px", borderRadius:20, fontFamily:"monospace" }}>{film.platform}</span>}
              </div>
              {film.note && <div style={{ marginTop:5, fontSize:11, color:"#7a6a50", fontStyle:"italic", lineHeight:1.4 }}>{film.note}</div>}
              {film.userNote && <div style={{ marginTop:5, fontSize:11, color:"#a09070", lineHeight:1.4, background:"#1a1500", padding:"6px 8px", borderRadius:6, borderLeft:"2px solid #f5c51855" }}>💬 {film.userNote}</div>}
              {film.watchedDate && <div style={{ marginTop:4, fontSize:10, color:"#5a5040", fontFamily:"monospace" }}>📅 {film.watchedDate}</div>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, minWidth:44 }}>
              <div style={{ background:ratingBg(film.rating||0), border:`1.5px solid ${ratingColor(film.rating||0)}`, borderRadius:8, padding:"3px 8px", fontSize:18, fontWeight:"bold", color:ratingColor(film.rating||0), fontFamily:"monospace", minWidth:36, textAlign:"center" }}>
                {film.rating||"—"}
              </div>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={()=>setEditData({film,from:"watched"})} style={{ background:"none", border:"1px solid #3a2a20", color:"#8a7a50", borderRadius:6, padding:"3px 7px", cursor:"pointer", fontSize:11 }}>✏️</button>
                <button onClick={()=>removeFilm(film.id,"watched")} style={{ background:"none", border:"none", color:"#4a3a2a", cursor:"pointer", fontSize:14, padding:2 }}>✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ToWatchCard = ({ film }) => (
    <div style={{ background:"linear-gradient(135deg,#14121a,#100e18)", border:"1px solid #2a2030", borderLeft:"3px solid #7c3aed", borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        <Poster itemId={film.id} title={film.title} year={film.year} size={70} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:15, fontWeight:"bold", color:"#fff" }}>{film.title}</span>
                <span style={{ fontSize:10, color:"#6a5a80", fontFamily:"monospace" }}>{film.year}</span>
              </div>
              <div style={{ display:"flex", gap:5, marginTop:4, flexWrap:"wrap" }}>
                {film.genre && <span style={{ fontSize:10, background:"#2a1a40", color:"#b09ad0", padding:"2px 7px", borderRadius:20, fontFamily:"monospace" }}>{film.genre}</span>}
                {film.platform && <span style={{ fontSize:10, background:"#1a1a30", color:"#7090d0", padding:"2px 7px", borderRadius:20, fontFamily:"monospace" }}>{film.platform}</span>}
              </div>
              {film.note && <div style={{ marginTop:5, fontSize:11, color:"#7a6a60", fontStyle:"italic", lineHeight:1.4 }}>{film.note}</div>}
            </div>
            <div style={{ display:"flex", gap:4, alignItems:"flex-start" }}>
              <button onClick={()=>setEditData({film,from:"towatch"})} style={{ background:"none", border:"1px solid #3a2a50", color:"#9a7aba", borderRadius:6, padding:"3px 7px", cursor:"pointer", fontSize:11 }}>✏️</button>
              <button onClick={()=>removeFilm(film.id,"towatch")} style={{ background:"none", border:"none", color:"#4a3a3a", cursor:"pointer", fontSize:14, padding:2 }}>✕</button>
            </div>
          </div>

          {ratingPick===film.id ? (
            <div style={{ marginTop:10, borderTop:"1px solid #2a2030", paddingTop:10 }}>
              {/* PASSO 1: Data */}
              {!datePick[film.id+"_confirmed"] ? (
                <>
                  <FieldLabel label="📅 PASSO 1 — QUANDO ASSISTIU? (dd/mm/aaaa)" />
                  <input
                    value={datePick[film.id]||""}
                    onChange={e=>setDatePick(prev=>({...prev,[film.id]:e.target.value}))}
                    placeholder="ex: 22/07/2026"
                    style={{...inputStyle, fontFamily:"monospace", marginBottom:8}}
                  />
                  <div style={{ display:"flex", gap:8, marginTop:4 }}>
                    <button onClick={()=>setDatePick(prev=>({...prev,[film.id+"_confirmed"]:true}))} style={{
                      flex:2, padding:"8px", background:"#7c3aed22", border:"1px solid #7c3aed", color:"#b09ad0",
                      borderRadius:6, cursor:"pointer", fontFamily:"monospace", fontSize:12,
                    }}>Confirmar data →</button>
                    <button onClick={()=>setRatingPick(null)} style={{
                      flex:1, background:"none", border:"1px solid #3a3030", color:"#6a5a50",
                      borderRadius:6, padding:"8px", cursor:"pointer", fontSize:11,
                    }}>cancelar</button>
                  </div>
                </>
              ) : (
                /* PASSO 2: Nota */
                <>
                  <div style={{ fontSize:11, color:"#5a9a5a", fontFamily:"monospace", marginBottom:8 }}>
                    📅 {datePick[film.id]||"sem data"} ✓
                  </div>
                  <FieldLabel label="⭐ PASSO 2 — QUAL A NOTA? (1–10)" />
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:4 }}>
                    {STARS.map(n=>(
                      <button key={n} onClick={()=>moveToWatched(film.id,n)} style={{
                        width:36, height:36, borderRadius:6, cursor:"pointer", fontFamily:"monospace", fontWeight:"bold", fontSize:13,
                        background:ratingBg(n), border:`1px solid ${ratingColor(n)}`, color:ratingColor(n),
                      }}>{n}</button>
                    ))}
                  </div>
                  <button onClick={()=>setDatePick(prev=>{ const n={...prev}; delete n[film.id+"_confirmed"]; return n; })}
                    style={{ marginTop:8, background:"none", border:"none", color:"#6a5a50", cursor:"pointer", fontSize:11, fontFamily:"monospace" }}>
                    ← voltar à data
                  </button>
                </>
              )}
            </div>
          ) : (
            <button onClick={()=>setRatingPick(film.id)} style={{
              marginTop:8, background:"none", border:"1px solid #3a2a50", color:"#9a7aba",
              borderRadius:6, padding:"4px 10px", fontSize:10, cursor:"pointer", fontFamily:"monospace",
            }}>✅ Marcar como assistido</button>
          )}
        </div>
      </div>
    </div>
  );

  if (!ready) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center", color:"#f5c518", fontFamily:"monospace", fontSize:14, letterSpacing:3 }}>
      🎬 CARREGANDO...
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"Georgia, serif", color:"#e8e0cc", paddingBottom:60 }}>
      <div style={{ background:"linear-gradient(180deg,#0d0d14,#0a0a0f)", borderBottom:"1px solid #f5c51830", padding:"28px 20px 0", overflow:"hidden" }}>
        <FilmStrip />
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginTop:8 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:6, color:"#f5c518", textTransform:"uppercase", marginBottom:4, fontFamily:"monospace" }}>🎬 Videolocadora do Claude</div>
            <h1 style={{ margin:0, fontSize:26, fontWeight:"bold", color:"#fff", lineHeight:1.1 }}>Minha Lista de Filmes e Séries</h1>
            <div style={{ marginTop:6, display:"flex", gap:14, fontSize:12, color:"#8a8070", flexWrap:"wrap", alignItems:"center" }}>
              <span>✅ {watched.length} assistidos</span>
              <span>🎯 {toWatch.length} na fila</span>
              <span>⭐ Média: <strong style={{ color:"#f5c518" }}>{avgRating}</strong></span>
              <span style={{ color:"#3a8a3a", fontSize:10 }}>🌐 lista compartilhada</span>
            </div>
          </div>
          <button onClick={()=>{ setShowAdd(true); setAddType(tab==="watched"?"watched":"towatch"); }} style={{
            background:"#f5c518", color:"#0a0a0f", border:"none", borderRadius:6,
            padding:"10px 16px", fontWeight:"bold", fontSize:13, cursor:"pointer", fontFamily:"monospace", letterSpacing:1,
          }}>+ ADICIONAR</button>
        </div>
        <div style={{ display:"flex", marginTop:18, borderBottom:"1px solid #2a2520", overflowX:"auto" }}>
          {[{key:"watched",label:`✅ Assistidos (${watched.length})`},{key:"towatch",label:`🎯 A Assistir (${toWatch.length})`},{key:"stats",label:"📊 Estatísticas"}].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{
              background:"none", border:"none",
              borderBottom:tab===t.key?"2px solid #f5c518":"2px solid transparent",
              color:tab===t.key?"#f5c518":"#8a8070",
              padding:"10px 16px", fontSize:13, cursor:"pointer",
              fontWeight:tab===t.key?"bold":"normal",
              fontFamily:"monospace", letterSpacing:0.5, transition:"all 0.2s", whiteSpace:"nowrap",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 16px", maxWidth:720, margin:"0 auto" }}>
        {tab==="towatch" && <GenreCards films={toWatch} type="towatch" />}
        {tab==="watched" && <GenreCards films={sortedWatched} type="watched" />}
        {tab==="watched" && (sortedWatched.length===0
          ? <div style={{ textAlign:"center",color:"#4a4040",padding:48 }}>Nenhum filme assistido ainda. 🍿</div>
          : sortedWatched.map(f => <WatchedCard key={f.id} film={f} />)
        )}
        {tab==="towatch" && (toWatch.length===0
          ? <div style={{ textAlign:"center",color:"#4a4040",padding:48 }}>Nenhum filme na fila! 🎬</div>
          : toWatch.map(f => <ToWatchCard key={f.id} film={f} />)
        )}

        {/* STATS TAB */}
        {tab==="stats" && <StatsTab watched={watched} onEditFilm={(film)=>{ setEditData({film,from:"watched"}); setTab("watched"); }} />}
      </div>

      {showAdd && (
        <FilmModal
          title="+ ADICIONAR FILME"
          film={EMPTY_FORM}
          isWatched={addType==="watched"}
          addTypeSelector={
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[{k:"towatch",l:"🎯 A Assistir"},{k:"watched",l:"✅ Assistido"}].map(t=>(
                <button key={t.k} onClick={()=>setAddType(t.k)} style={{
                  flex:1, padding:"8px", borderRadius:6, cursor:"pointer", fontFamily:"monospace", fontSize:12,
                  background:addType===t.k?"#7c3aed22":"none",
                  border:addType===t.k?"1px solid #7c3aed":"1px solid #3a2a40",
                  color:addType===t.k?"#b09ad0":"#6a5a70",
                }}>{t.l}</button>
              ))}
            </div>
          }
          onSave={saveNew}
          onClose={()=>setShowAdd(false)}
        />
      )}

      {editData && (
        <FilmModal
          title="✏️ EDITAR FILME"
          film={editData.film}
          isWatched={editData.from==="watched"}
          onSave={saveEdit}
          onClose={()=>setEditData(null)}
        />
      )}
    </div>
  );
}
