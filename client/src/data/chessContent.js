export const chessContent = {
  brand: {
    name: 'The 64 Squares',
    archive: 'Archive Nº 64',
    tagline: 'A field guide to the art, history and geometry of chess.',
  },
  hero: {
    kicker: 'Archive Nº 64',
    title: 'The 64 Squares',
    subtitle: 'The Art, History & Geometry of Chess',
    lede: 'From 6th-century India to the engine age, chess has kept the same sixty-four squares. This archive is for anyone who wants to understand the game — or simply to look at it.',
    meta: ['Interactive study', '8 movements', 'London 1851'],
    hint: true,
  },
  lesson: [
    {
      kicker: 'Archive Nº 64',
      title: 'The 64 Squares',
      subtitle: 'A short lesson in how the game ends.',
      lede: 'Follow the Scholar’s Mate, one move at a time. Then follow the game from Gupta India to the engine age.',
      meta: ['Interactive study', '8 movements', 'White to move'],
      actions: [
        { label: 'Start with the rules', href: '#learn' },
        { label: 'Read the archive', href: '#chaturanga' },
      ],
    },
    {
      kicker: 'Scholar’s Mate · Move 1',
      title: 'Claim the center.',
      subtitle: '1. e4',
      lede: 'White advances the king’s pawn two squares. It stakes a claim in the center and opens lines for the queen and bishop.',
      meta: ['1. e4', 'White to move'],
      note: 'The center is the four squares e4, d4, e5 and d5.',
    },
    {
      kicker: 'Scholar’s Mate · Move 2',
      title: 'Challenge the center.',
      subtitle: '1... e5',
      lede: 'Black mirrors White, putting a pawn beside the e4-pawn and contesting the central squares immediately.',
      meta: ['1... e5', 'Black to move'],
    },
    {
      kicker: 'Scholar’s Mate · Move 3',
      title: 'Aim at f7.',
      subtitle: '2. Bc4',
      lede: 'The bishop develops to c4 and points at f7 — the weakest square in Black’s camp. Only the king defends it.',
      meta: ['2. Bc4', 'White to move'],
      note: 'f7 is a natural target because it sits next to the king and is guarded only by the king at the start.',
    },
    {
      kicker: 'Scholar’s Mate · Move 4',
      title: 'Develop, but miss the threat.',
      subtitle: '2... Nc6',
      lede: 'Black develops a knight and defends e5. The move is reasonable — but it does nothing about the bishop’s aim at f7.',
      meta: ['2... Nc6', 'Black to move'],
    },
    {
      kicker: 'Scholar’s Mate · Move 5',
      title: 'Bring the queen into the attack.',
      subtitle: '3. Qh5',
      lede: 'The queen joins the attack. It eyes e5 and f7, and the threat is already Qxf7#. Black must respond to the mating idea.',
      meta: ['3. Qh5', 'White to move'],
    },
    {
      kicker: 'Scholar’s Mate · Move 6',
      title: 'The fatal oversight.',
      subtitle: '3... Nf6??',
      lede: 'Black attacks the queen but leaves f7 undefended. The bishop on c4 is still guarding the square the queen is about to capture.',
      meta: ['3... Nf6??', 'Black to move'],
      note: 'A developing move can still be a blunder when it ignores a direct mate threat.',
    },
    {
      kicker: 'Scholar’s Mate · Move 7',
      title: 'Checkmate.',
      subtitle: '4. Qxf7#',
      lede: 'The queen captures on f7, protected by the bishop on c4. The king cannot capture the queen, block the attack, or escape. Scholar’s Mate.',
      meta: ['4. Qxf7#', 'Checkmate'],
      note: 'This trap only works if Black allows it. After 3.Qh5, Black can play 3...Qe7 or 3...g6 and stay safe.',
    },
  ],
  chapters: [
    {
      id: 'chaturanga',
      piece: 'pawn',
      kicker: 'I — Chaturanga & Origins',
      title: 'Born in the Gupta Empire.',
      lede: 'Sixth-century India arrays four divisions of an army on an eight-by-eight grid — and invents the game that never died.',
      body: [
        'Chess begins in 6th-century India, in the Gupta Empire, as chaturanga: “four divisions” of infantry, cavalry, elephants and chariotry. Two armies of thirty-two pieces meet on an eight-by-eight board — the same geometry the game still uses today.',
        'The dice of older board games fall away. What remains is calculation, and the first record of a dialogue that would outlive every empire that played it.',
      ],
      facts: [
        { label: 'First played', value: 'India, 6th century' },
        { label: 'Chaturanga', value: 'Four divisions' },
        { label: 'The grid', value: 'Eight by eight' },
      ],
      note: 'The exact origins are debated. The Gupta-era account is the strongest tradition, but the earliest surviving descriptions were written later than the game itself.',
    },
    {
      id: 'shatranj',
      piece: 'knight',
      kicker: 'II — Chatrang & the Journey West',
      title: 'Persia gave it a new name.',
      lede: 'Along the Silk Road, chaturanga becomes chatrang, then shatranj. Poets praise it, caliphs play it, and Europe rewrites it.',
      body: [
        'By the 6th century the game had reached Persia as chatrang. After the Islamic conquests it traveled in Arabic as shatranj. Poets praised it, caliphs played it, and from the 9th century masters such as al-Adli and as-Suli composed problems and recorded games.',
        'From the Islamic world it crossed into Spain and Italy. Europe rewrote it: by the 15th century the queen and bishop had gained their modern powers, and the slow, patient game of shatranj became the violent, beautiful game we know.',
      ],
      facts: [
        { label: 'Persia', value: '6th century' },
        { label: 'Early masters', value: '9th–10th century' },
        { label: 'Modern queen', value: 'c. 1475' },
      ],
      note: 'The game’s spread is wider and messier than a single road: it moved with merchants, monks, armies and courts across Asia, North Africa and Europe.',
      quote: {
        text: 'The game traveled with merchants, monks and armies — and every language gave it a new name.',
      },
    },
    {
      id: 'immortal',
      piece: 'queen',
      kicker: 'III — The Immortal Game (1851)',
      title: 'Anderssen vs Kieseritzky.',
      lede: 'London, 1851. A casual King’s Gambit becomes the most famous attacking game ever played.',
      body: [
        'In London in 1851, around the first international chess tournament, Adolf Anderssen sat down with Lionel Kieseritzky and played the King’s Gambit. The exact date and venue are disputed; the game may have been played at St George’s Chess Club.',
        'Anderssen flung pawns and pieces forward, gave away both rooks, offered his queen at point-blank range, and mated with a bishop and two knights. The game was not called “immortal” at the table. The name appears in print later — Falkbeer used it in 1855 — and the gold-coin and applause story is a later embellishment, not a contemporary account.',
      ],
      facts: [
        { label: 'Played', value: 'London, 1851' },
        { label: 'Result', value: 'Anderssen, 1–0' },
        { label: 'Moves', value: '23' },
      ],
      note: 'This archive follows the game score published by Kieseritzky in La Régence in July 1851. Some later collections give a different finish.',
      quote: {
        text: 'The Queen is sacrificed so the three remaining minor pieces can weave an unbreakable geometric noose.',
      },
    },
    {
      id: 'laws',
      piece: 'rook',
      kicker: 'IV — The Old Laws',
      title: 'What four centuries of masters knew.',
      lede: 'Control the center. Develop before you attack. Guard the king.',
      body: [
        'Every generation states them differently, but the principles endure. The Romantics broke the second law on purpose, with spectacular results — and even Anderssen castled when he could.',
      ],
      note: 'These are principles, not the official rules. The complete laws of the game are maintained by FIDE.',
      link: {
        label: 'Read the FIDE Laws',
        href: 'https://handbook.fide.com/chapter/E012023',
      },
    },
    {
      id: 'pieces',
      piece: 'bishop',
      kicker: 'V — The Anatomy of Every Piece',
      title: 'Six characters. One language.',
      lede: 'Victory asks you to master each warrior’s kinetic rules, point value and positional temperament.',
      body: [
        'Each piece moves by its own geometry, and each has a temperament to match. Learn what they are worth, where they belong, and what they will never do.',
      ],
    },
    {
      id: 'phases',
      piece: 'king',
      kicker: 'VI — The Three Phases of Play',
      title: 'Opening. Middlegame. Endgame.',
      lede: 'A game of chess is three games in one, each with its own currency.',
      body: [
        'Forces gather, collide, and then dissolve. The player who understands which phase they are standing in usually wins it.',
      ],
    },
    {
      id: 'legacy',
      piece: 'pawn',
      kicker: 'VII — The Modern Game',
      title: 'The board is still waiting.',
      lede: 'From the first world championship to the engine age, chess has kept the same sixty-four squares.',
      body: [
        'The game did not stop in 1851. It became a sport with world champions, a Cold War stage, a laboratory for computer science, and a global online pastime.',
        'The pieces have changed names, the queen has grown stronger, the analysis has moved from café tables to silicon — but the board is still sixty-four squares, and it is still waiting for your first move.',
      ],
      timeline: [
        {
          year: '1851',
          title: 'The first international tournament',
          text: 'London hosts the first international chess tournament. Adolf Anderssen wins.',
        },
        {
          year: '1886',
          title: 'A world champion',
          text: 'Wilhelm Steinitz defeats Johannes Zukertort in the first official world championship match.',
        },
        {
          year: '1972',
          title: 'Fischer vs Spassky',
          text: 'Bobby Fischer defeats Boris Spassky in Reykjavík in one of the most watched matches of the Cold War.',
        },
        {
          year: '1997',
          title: 'Deep Blue',
          text: 'IBM’s Deep Blue defeats Garry Kasparov in a six-game match, the first defeat of a reigning world champion by a computer under standard match conditions.',
        },
        {
          year: '2017',
          title: 'AlphaZero',
          text: 'AlphaZero learns chess from self-play and defeats Stockfish in a 100-game match.',
        },
        {
          year: '2023',
          title: 'The current laws',
          text: 'FIDE’s Laws of Chess take effect on 1 January, anchoring over-the-board play worldwide.',
        },
      ],
    },
  ],
  learn: {
    kicker: 'Start here',
    title: 'The rules, without the mystery.',
    lede: 'Chess is a small set of clear rules played on an infinite set of positions. Here is the whole game in one page.',
    boardTitle: 'The board',
    boardText: 'Sixty-four squares, eight files (a–h) and eight ranks (1–8). White starts on ranks 1 and 2; Black on ranks 7 and 8. The near-right corner is always a light square.',
    rules: [
      {
        title: 'The board',
        tag: '8 × 8',
        text: 'The board is an 8×8 grid of alternating light and dark squares. Files are lettered a–h; ranks are numbered 1–8. White always moves first.',
      },
      {
        title: 'The object',
        tag: 'Checkmate',
        text: 'Put the enemy king under attack and leave it with no legal escape. That is checkmate. Capturing the king is never allowed.',
      },
      {
        title: 'The turn',
        tag: 'One move',
        text: 'Players alternate. White moves, then Black. You may not skip a turn, and you may not leave your own king in check.',
      },
      {
        title: 'The draw',
        tag: 'No forced win',
        text: 'A game is drawn by stalemate, agreement, threefold repetition, the fifty-move rule, or a dead position where neither side can possibly mate.',
      },
    ],
    specialMoves: [
      {
        title: 'Castling',
        notation: 'O-O / O-O-O',
        text: 'The king moves two squares toward a rook, and the rook jumps to the square the king crossed. Neither piece may have moved, the path must be clear, and the king may not start in, pass through, or land on check.',
      },
      {
        title: 'En passant',
        notation: 'e.p.',
        text: 'If an enemy pawn advances two squares and lands beside your pawn, you may capture it as if it had moved only one square. The capture must be made immediately.',
      },
      {
        title: 'Promotion',
        notation: '=Q',
        text: 'A pawn that reaches the far rank becomes a queen, rook, bishop or knight. You may have more than one queen. The choice is part of the move.',
      },
      {
        title: 'Check',
        notation: '+',
        text: 'The king is attacked. You must answer by moving the king, blocking the attack, or capturing the attacking piece. If none is possible, it is checkmate.',
      },
    ],
    notation: [
      { code: 'e4', meaning: 'Pawn to e4.' },
      { code: 'Nf3', meaning: 'Knight to f3.' },
      { code: 'Bxe5', meaning: 'Bishop captures on e5.' },
      { code: 'O-O', meaning: 'Kingside castling.' },
      { code: 'O-O-O', meaning: 'Queenside castling.' },
      { code: 'Qxf7#', meaning: 'Queen captures on f7; checkmate.' },
      { code: '+', meaning: 'Check.' },
      { code: '1-0 / 0-1 / ½-½', meaning: 'White wins / Black wins / draw.' },
    ],
    sourceNote: 'This summary follows the FIDE Laws of Chess (2023). It is a beginner’s overview, not a substitute for the official rules.',
    sourceUrl: 'https://handbook.fide.com/chapter/E012023',
  },
  faq: {
    kicker: 'Quick answers',
    title: 'Before your first move.',
    lede: 'Short, sourced answers to the questions beginners ask most.',
    items: [
      {
        question: 'Do I need to memorize openings to start playing?',
        answer:
          'No. Begin with the principles: put pawns in the center, develop your knights and bishops, and castle early. The Scholar’s Mate lesson above shows why ignoring a direct threat loses games even when every individual move looks reasonable.',
      },
      {
        question: 'How do I read chess notation such as Nf3?',
        answer:
          'The piece letter comes first — N for knight, B for bishop, R for rook, Q for queen, K for king. A pawn move has no letter, so e4 means a pawn moves to e4. An x marks a capture, + means check, and # means checkmate. Castling is written O-O or O-O-O.',
      },
      {
        question: 'Why is the Immortal Game famous?',
        answer:
          'Anderssen sacrificed both rooks and then his queen before mating with a bishop and two knights. The score was published by Kieseritzky in 1851. The gold-coin and applause stories are later embellishments, not contemporary records.',
      },
      {
        question: 'Can a pawn become a queen?',
        answer:
          'Yes. A pawn that reaches the far rank must be promoted to a queen, rook, bishop or knight. Promotion is part of the move, and a player may have more than one queen.',
      },
      {
        question: 'Is chess solved?',
        answer:
          'No. Standard 8×8 chess has not been solved. Computers are stronger than the best humans and can play perfect endgames with few pieces, but the full game remains too large to solve exhaustively.',
      },
    ],
  },
  laws: [
    {
      title: 'Control the Center',
      tag: 'Center Dominance',
      text: 'The four central squares (e4, d4, e5, d5) are high ground. Pieces deployed toward the hub radiate influence across both wings like artillery on a ridge.',
    },
    {
      title: 'Develop Before Attack',
      tag: 'Tempo & Mobilization',
      text: 'Knights before bishops. Mobilize minor pieces before launching reckless queen incursions. An army attacking with two units against four defenders is doomed to stall.',
    },
    {
      title: 'Guard King Sanctity',
      tag: 'Monarch Survival',
      text: 'Castle early, keep your protective pawn fortress unprovoked, and never leave your monarch in an open center file where heavy pieces can converge.',
    },
  ],
  pieces: [
    {
      id: 'pawn',
      name: 'Pawn',
      label: 'Infantry',
      value: '1',
      abilityLabel: 'Special ability',
      ability: 'Promotion on the far rank',
      body: 'Moves one square forward; on its first move it may advance two. Captures one square diagonally forward. A pawn that reaches the far rank must become a queen, rook, bishop or knight. Pawns cannot move backward — they dictate the permanent terrain of the board.',
      moveType: 'pawn',
    },
    {
      id: 'knight',
      name: 'Knight',
      label: 'Cavalry',
      value: '3',
      abilityLabel: 'Tactical power',
      ability: 'The multi-fork attack',
      body: 'The only piece able to leap over friendly or enemy units. Moves in an L-shape: two squares orthogonally, then one square perpendicular. Supreme in closed, crowded positions.',
      moveType: 'jump',
      offsets: [
        [1, 2], [2, 1], [2, -1], [1, -2],
        [-1, -2], [-2, -1], [-2, 1], [-1, 2],
      ],
    },
    {
      id: 'bishop',
      name: 'Bishop',
      label: 'Sniper',
      value: '3',
      abilityLabel: 'Tactical power',
      ability: 'Long-range skewers & pins',
      body: 'Moves any distance along open diagonals, permanently bound to the color square on which it began life. A pair of bishops working in tandem can dominate open vistas of the board.',
      moveType: 'slide',
      directions: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
    },
    {
      id: 'rook',
      name: 'Rook',
      label: 'Siege Tower',
      value: '5',
      abilityLabel: 'Special ability',
      ability: 'Castling with the King',
      body: 'Moves any distance along horizontal ranks and vertical files. Heavy artillery that comes alive once the files are cleared of pawns. Deadly when invading the enemy’s seventh rank.',
      moveType: 'slide',
      directions: [[1, 0], [-1, 0], [0, 1], [0, -1]],
    },
    {
      id: 'queen',
      name: 'Queen',
      label: 'Imperator',
      value: '9',
      abilityLabel: 'Golden rule',
      ability: 'Never deploy too early',
      body: 'The lethal fusion of rook and bishop. Moves any number of squares in any direction — rank, file or diagonal. The most destructive attacking weapon on the sixty-four squares.',
      moveType: 'slide',
      directions: [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1],
      ],
    },
    {
      id: 'king',
      name: 'King',
      label: 'Sovereign',
      value: '∞',
      abilityLabel: 'Supreme law',
      ability: 'Checkmate ends the world',
      body: 'Moves one square in any direction and cannot step into attack. If trapped with no legal escape while attacked, the game ends in checkmate. In the endgame, the king transforms into an active fighter.',
      moveType: 'step',
      offsets: [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1],
      ],
    },
  ],
  phases: [
    {
      phase: 'The Opening',
      text: 'The first 10–15 moves. Focus purely on occupation of central squares, rapid mobilization of knights and bishops, and castling the king to safety before initiating combat.',
    },
    {
      phase: 'The Middlegame',
      text: 'Forces collide. Formulation of grand plans, pawn breaks, tactical combinations — pins, forks, skewers, sacrifices — and fighting for open files for your rooks.',
    },
    {
      phase: 'The Endgame',
      text: 'Queens and major armies are traded off. The remaining pawns march toward promotion, and the once-sheltered king emerges from hiding to command the center.',
    },
  ],
  challenge: {
    kicker: 'VIII — Challenge Me',
    title: 'Your move.',
    body: 'The board is still waiting. Find me on Chess.com and send a challenge.',
    label: 'Chess.com · Player',
    username: 'SairamAP',
    url: 'https://www.chess.com/member/SairamAP',
  },
  sources: {
    kicker: 'Sources & method',
    title: 'Where this comes from.',
    lede: 'A short archive should be honest about what is documented and what is legend.',
    entries: [
      {
        title: 'FIDE Laws of Chess (2023)',
        publisher: 'FIDE',
        url: 'https://handbook.fide.com/chapter/E012023',
        note: 'The rules and notation reference for this site.',
      },
      {
        title: 'The Immortal Game (Anderssen v Kieseritzky)',
        publisher: 'Edward Winter, Chess Notes',
        url: 'https://www.chesshistory.com/winter/extra/immortal.html',
        note: 'The documentary record, disputed venue and date, and the later “Immortal” name.',
      },
      {
        title: 'A History of Chess',
        publisher: 'H. J. R. Murray (1913)',
        url: '',
        note: 'The standard scholarly history of chess before the modern era.',
      },
      {
        title: 'The Immortal Game: A History of Chess',
        publisher: 'David Shenk (2006)',
        url: '',
        note: 'A readable account of the 1851 game and its afterlife.',
      },
      {
        title: 'Adolf Anderssen vs Lionel Kieseritzky',
        publisher: 'Chessgames.com',
        url: 'https://www.chessgames.com/perl/chessgame?gid=1018910',
        note: 'A playable score and move archive of the Immortal Game.',
      },
    ],
    method: [
      'Historical copy was checked against primary or specialist sources. Where the record is uncertain, the copy says so.',
      'The Immortal Game PGN follows Kieseritzky’s 1851 publication. The gold-coin and applause story is labeled as tradition, not a contemporary account.',
      'The rules summary follows FIDE. It is a beginner’s overview, not a substitute for the official Laws.',
    ],
  },
  immortal: {
    moments: [
      {
        move: '2. f4',
        title: 'The King’s Gambit Unfurled',
        text: 'Anderssen flings his f-pawn into Black’s jaws, offering material purely to deflect the e5-pawn and crack open the f-file for the future rook.',
      },
      {
        move: '3... Qh4+',
        title: 'The Royal Interruption',
        text: 'Black’s queen strikes along the weakened e1–h4 diagonal and puts White in check, stripping Anderssen of the right to castle.',
      },
      {
        move: '18. Bd6!',
        title: 'The Bishop Guillotine',
        text: 'A bishop lands in the heart of Black’s camp, severing the queen from the defense of her back ranks. Anderssen consciously leaves both corner rooks unguarded — ten points of material offered for inescapable coordinate control.',
      },
      {
        move: '19... Qxa1+',
        title: 'Both Rooks Sacrificed',
        text: 'Kieseritzky has devoured both white rooks and stands +13 in material. But chess is decided by checkmate, not by ledger balance.',
      },
      {
        move: '22. Qf6+!',
        title: 'The Crown Thrown Into the Dust',
        text: 'The grand crescendo. Anderssen offers his own queen at point-blank range. Black’s knight is forced to capture, vacating its guard of the critical e7 square.',
      },
      {
        move: '23. Be7#',
        title: 'Pure Geometric Checkmate',
        text: 'The black king is hopelessly trapped: d7 sealed by a pawn, e8 and f8 attacked by the white bishop and knights. Mate with only a bishop and two knights.',
      },
    ],
    quote:
      'The Queen is sacrificed so the three remaining minor pieces can weave an unbreakable geometric noose.',
    legend:
      'The gold coins, the applause and the top-hatted messengers are later embellishments; no contemporary account records them. The name “Immortal Game” appears in print later, with Falkbeer using it in 1855. The exact date and venue remain disputed.',
    legacy:
      'In print, the game became a byword for romantic sacrifice. Its exact finish is given differently in some sources; this archive follows Kieseritzky’s own publication in La Régence (July 1851).',
    pgn: `[Event "London"]
[Site "London"]
[Date "1851.??.??"]
[Round "?"]
[White "Adolf Anderssen"]
[Black "Lionel Kieseritzky"]
[Result "1-0"]
[ECO "C33"]

1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
  },
};
