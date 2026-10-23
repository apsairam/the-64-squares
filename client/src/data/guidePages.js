const FIDE_SOURCE = {
  title: 'FIDE Laws of Chess (2023)',
  publisher: 'FIDE',
  url: 'https://handbook.fide.com/chapter/E012023',
  note: 'The official rules for over-the-board play, including castling, promotion, en passant, and the drawing rules.',
};

const REVIEWED = 'October 2026';

export const guidePages = [
  {
    slug: 'learn-chess',
    order: 1,
    navLabel: 'Learn chess',
    kicker: 'Beginner path · 1 of 6',
    title: 'Learn Chess: A Beginner’s Path | The 64 Squares',
    description:
      'Learn chess from the board up: the pieces, the rules, notation, and a first checkmate. A clear, source-backed beginner path with no memorization required.',
    h1: 'Learn chess from the board up.',
    lede:
      'Chess looks like a language you missed the first lesson of. It is not. Start with the board, the pieces, and one clear goal — then build outward from there.',
    readingTime: '9 min read',
    published: '2026-10-23',
    updated: '2026-10-23',
    reviewed: REVIEWED,
    keywords: ['learn chess', 'chess for beginners', 'how to play chess'],
    keyFacts: [
      { label: 'The board', value: '8 × 8 squares' },
      { label: 'The armies', value: '16 pieces each' },
      { label: 'The first move', value: 'White' },
    ],
    sections: [
      {
        id: 'the-board',
        title: 'The board is the first rule',
        paragraphs: [
          'Chess is played on an eight-by-eight grid of alternating light and dark squares. The vertical columns are called files and are lettered a to h from White’s left. The horizontal rows are ranks and are numbered 1 to 8 from White’s side. Every square has one address: e4, f7, h8.',
          'Set the board so that each player has a light square in the near-right corner. White’s pieces occupy ranks 1 and 2; Black’s occupy ranks 7 and 8. The queens begin on their own colour — white queen on d1, black queen on d8 — and the kings stand beside them on e1 and e8.',
        ],
        note:
          'The phrase “queen on her colour” is the quickest way to avoid swapping the queen and king. The white king stands on e1; the black king stands on e8, directly opposite.',
      },
      {
        id: 'checkmate',
        title: 'The goal is checkmate',
        paragraphs: [
          'The king is never captured. Instead, the game ends when the king is attacked and has no legal way to escape. That is checkmate. If the king is attacked but can move, block the attack, or capture the attacker, the game continues.',
          'This is why beginners should learn to see the whole board rather than chase material. A player can be ahead by a queen and still lose if the king is trapped. Checkmate ends the game at once; a player who sees mate coming may resign, but the goal remains the same.',
        ],
      },
      {
        id: 'the-pieces',
        title: 'Six pieces, six ways of moving',
        paragraphs: [
          'Each piece moves by its own geometry. Pawns step forward and capture diagonally; knights make an L-shape and jump; bishops travel on diagonals; rooks travel on ranks and files; queens combine rook and bishop power; kings move one square in any direction but may not step into check.',
          'You do not need to memorise every opening to begin. You do need to know how each piece moves, what it is roughly worth, and which pieces are still on the board. The full movement guide is the next stop on this path.',
        ],
        list: [
          'Pawn — one square forward, two on its first move, captures diagonally.',
          'Knight — two squares one way and one square across; the only jumping piece.',
          'Bishop — any distance on a diagonal; it never changes square colour.',
          'Rook — any distance on a rank or file; it powers the endgame.',
          'Queen — any distance on a rank, file, or diagonal.',
          'King — one square in any direction; the piece the whole game protects.',
        ],
        links: [
          {
            slug: 'how-chess-pieces-move',
            label: 'See every piece move',
          },
        ],
      },
      {
        id: 'first-moves',
        title: 'Your first three moves',
        paragraphs: [
          'A reliable beginner plan is simple: put a pawn in the centre, develop a knight or bishop, and castle before the position becomes sharp. Moves such as 1.e4 or 1.d4 claim central space. Knights and bishops then come out toward the centre, and castling tucks the king behind a pawn wall.',
          'Avoid bringing the queen out too early. A queen can be chased by cheaper pieces, and every retreat costs time. Also avoid moving the same piece twice without a reason. The opening is a race to mobilise, not a race to attack.',
        ],
        list: [
          'Claim the centre with a pawn.',
          'Develop a knight and a bishop.',
          'Castle early, usually on the kingside.',
          'Connect the rooks by clearing the back rank.',
          'Look for checks, captures, and threats before every move.',
        ],
      },
      {
        id: 'study-plan',
        title: 'A simple way to practise',
        paragraphs: [
          'Twenty focused minutes is enough for a first session: five minutes on how the pieces move, five minutes playing a slow game, five minutes reviewing one mistake, and five minutes solving two simple puzzles. The review matters more than the result.',
          'Play longer games rather than bullet. Speed hides the thinking you are trying to build. After each game, ask one question: what was the first move where I stopped looking at my opponent’s threats? That single habit will improve your play faster than a page of opening theory.',
        ],
        note:
          'You can learn the rules in an afternoon. You will spend years learning how to use them. That is the normal shape of chess, not a sign that you are behind.',
      },
      {
        id: 'next',
        title: 'What to learn next',
        paragraphs: [
          'Work through the beginner path in order: the complete rules, the movement of every piece, the three special moves, a first mating pattern, and finally notation. Each page links back to the one before it, so you can move at your own pace.',
          'When you are ready to play, use the interactive Scholar’s Mate lesson on the home page. It shows how a four-move attack works — and why the same attack fails when Black sees it coming.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is chess hard to learn?',
        answer:
          'The rules are learnable in an afternoon. The difficulty is in applying them under pressure. Start with movement, checkmate, and a few principles; add openings later.',
      },
      {
        question: 'How long does it take to become good at chess?',
        answer:
          'There is no fixed timeline. Regular slow games and review improve most beginners faster than memorising openings. Expect steady progress over months, not days.',
      },
      {
        question: 'Do I need to memorise openings?',
        answer:
          'No. Put a pawn in the centre, develop your knights and bishops, and castle early. Openings become useful once you understand the ideas behind them.',
      },
      {
        question: 'Can I learn chess without a physical board?',
        answer:
          'Yes. Online boards and puzzles are enough to learn the rules. A physical board is still useful for slowing down and seeing the whole position.',
      },
    ],
    sources: [FIDE_SOURCE],
    related: ['chess-rules', 'how-chess-pieces-move', 'chess-notation'],
  },
  {
    slug: 'chess-rules',
    order: 2,
    navLabel: 'Rules',
    kicker: 'Beginner path · 2 of 6',
    title: 'Chess Rules for Beginners: The Complete Basics',
    description:
      'The complete beginner’s guide to chess rules: setup, turns, check, checkmate, draws, castling, en passant, promotion, and the mistakes new players make most.',
    h1: 'The rules of chess, without the mystery.',
    lede:
      'The whole game rests on a small set of rules. Learn them once, in the right order, and the board stops looking like a secret code.',
    readingTime: '8 min read',
    published: '2026-10-23',
    updated: '2026-10-23',
    reviewed: REVIEWED,
    keywords: ['chess rules', 'how to play chess', 'chess rules for beginners'],
    keyFacts: [
      { label: 'Players', value: 'Two' },
      { label: 'Pieces each', value: '16' },
      { label: 'Aim', value: 'Checkmate' },
    ],
    sections: [
      {
        id: 'setup',
        title: 'Setting up the board',
        paragraphs: [
          'Place the board with a light square in each player’s near-right corner. White’s two rooks sit on a1 and h1; the knights, bishops, queen, and king fill the back rank in that order. The white queen starts on d1, the white king on e1. Black mirrors this on rank 8.',
          'The second rank holds eight white pawns; the seventh rank holds eight black pawns. White moves first. In a standard game, White is the player with the lighter pieces, regardless of who is sitting where.',
        ],
      },
      {
        id: 'turns',
        title: 'How a turn works',
        paragraphs: [
          'Players alternate moves, one piece per turn. A piece may move to an empty square or capture an enemy piece on its destination. You may not skip a turn, move an opponent’s piece, or make a move that leaves your own king in check.',
          'In tournament chess, the touch-move rule applies: if you deliberately touch a piece, you must move it if a legal move exists. Online chess enforces its own move rules. Casual games often ignore touch-move, so agree before you start.',
        ],
        note:
          '“Check” is not a separate turn. If your king is attacked, your next move must answer the attack. You can move the king, block the line, or capture the attacking piece.',
      },
      {
        id: 'checkmate',
        title: 'Check, checkmate, and stalemate',
        paragraphs: [
          'Check means the king is under attack. Checkmate means the king is in check and no legal move can remove the attack. The game ends immediately; the king is never captured. A player who cannot move but whose king is not in check is stalemated, which is a draw.',
          'A common beginner error is to announce “check” with a move that actually leaves the king safe, or to miss that a blocking piece is itself pinned. Before every move, ask three questions: is my king safe, is my opponent’s king safe, and what is my opponent threatening?',
        ],
      },
      {
        id: 'piece-moves',
        title: 'The movement rules in one table',
        paragraphs: [
          'Learn these six patterns before anything else. The value column is a rough guide to trading, not a scoreboard. Position and king safety can matter more than material.',
        ],
        table: {
          caption: 'How each piece moves and what it is roughly worth',
          head: ['Piece', 'Movement', 'Value'],
          rows: [
            ['Pawn', 'One square forward; two on its first move; captures diagonally forward.', '1'],
            ['Knight', 'Two squares one way, then one square across; jumps over pieces.', '3'],
            ['Bishop', 'Any distance on a diagonal; stays on its starting colour.', '3'],
            ['Rook', 'Any distance on a rank or file.', '5'],
            ['Queen', 'Any distance on a rank, file, or diagonal.', '9'],
            ['King', 'One square in any direction; may not move into check.', '∞'],
          ],
        },
        links: [
          {
            slug: 'how-chess-pieces-move',
            label: 'Full piece movement guide',
          },
          {
            slug: 'special-moves',
            label: 'Castling, en passant, promotion',
          },
        ],
      },
      {
        id: 'special-moves',
        title: 'Three rules beginners often miss',
        paragraphs: [
          'Castling, en passant, and promotion are part of the normal rules, not optional extras. Castling moves the king and rook together. En passant lets a pawn capture an enemy pawn that has just advanced two squares. Promotion turns a pawn into a queen, rook, bishop, or knight when it reaches the far rank.',
          'Each has conditions that must be met exactly. The dedicated guide covers the details, common mistakes, and the notation you will see in games.',
        ],
      },
      {
        id: 'draws',
        title: 'How a game can end without a winner',
        paragraphs: [
          'Not every game ends in checkmate. A game is drawn by stalemate, agreement between the players, threefold repetition of the same position, the fifty-move rule, or a dead position where neither side can possibly deliver mate. Insufficient material is the usual example of a dead position: king versus king, or king and bishop versus king.',
          'In tournament chess, a player may also lose on time if the opponent has enough material to mate. Online platforms handle this automatically. Resignation is a voluntary loss, not a rule about the position.',
        ],
      },
      {
        id: 'remember',
        title: 'Rules that are easy to misremember',
        paragraphs: [
          'A king may not castle out of check, through check, or into check. A pinned piece still attacks the squares it could otherwise attack for the purpose of the king’s safety. A pawn may not move forward into an occupied square. A bishop never changes colour, and a knight always does when it moves.',
          'When a rule feels ambiguous, check the official FIDE Laws rather than a comment thread. The complete laws are linked below.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can a king capture a protected piece?',
        answer:
          'No. A king may capture any enemy piece that is not protected and may not move to a square attacked by an enemy piece. The king can never move into check.',
      },
      {
        question: 'Can a pawn move backwards?',
        answer:
          'No. Pawns move forward only. This is why pawn structure is permanent: every pawn move changes the terrain for the rest of the game.',
      },
      {
        question: 'Is stalemate a win?',
        answer:
          'No. Stalemate is a draw. It happens when the player to move has no legal move but their king is not in check.',
      },
      {
        question: 'Do you have to say check?',
        answer:
          'In casual play, players often announce it. FIDE rules do not require a verbal warning in standard tournament play, but the opponent is responsible for noticing an illegal move.',
      },
    ],
    sources: [FIDE_SOURCE],
    related: ['how-chess-pieces-move', 'special-moves', 'scholars-mate'],
  },
  {
    slug: 'how-chess-pieces-move',
    order: 3,
    navLabel: 'Pieces',
    kicker: 'Beginner path · 3 of 6',
    title: 'How Chess Pieces Move: A Beginner’s Guide',
    description:
      'How every chess piece moves, captures, and is valued. A clear guide to pawns, knights, bishops, rooks, queens, and kings — with the mistakes to avoid.',
    h1: 'Six pieces. Six ways to move.',
    lede:
      'Every chess piece obeys a different geometry. Learn the shape first, then the value, then the kind of position where each one feels at home.',
    readingTime: '8 min read',
    published: '2026-10-23',
    updated: '2026-10-23',
    reviewed: REVIEWED,
    keywords: ['how chess pieces move', 'chess pieces', 'chess piece movement'],
    keyFacts: [
      { label: 'Pieces per side', value: '6 types' },
      { label: 'Total pieces', value: '32' },
      { label: 'Jumping piece', value: 'Knight' },
    ],
    sections: [
      {
        id: 'coordinates',
        title: 'First, the squares have names',
        paragraphs: [
          'Files are lettered a to h from White’s left. Ranks are numbered 1 to 8 from White’s side. The square e4 is the intersection of the e-file and the fourth rank. This coordinate system is how every move is recorded and how you will read notation.',
          'When a piece moves, its destination is usually enough to describe the move: Nf3 means a knight goes to f3. Captures add an x: Bxe5 means a bishop captures on e5.',
        ],
        links: [
          {
            slug: 'chess-notation',
            label: 'Read chess notation',
          },
        ],
      },
      {
        id: 'pawn',
        title: 'The pawn: small, permanent, transformative',
        paragraphs: [
          'A pawn moves one square forward. On its first move, it may advance two squares. It captures one square diagonally forward, never straight ahead. Pawns cannot move backwards, and they cannot capture the piece directly in front of them.',
          'A pawn that reaches the far rank is promoted to a queen, rook, bishop, or knight. Promotion is part of the move. Because pawns cannot retreat, every pawn move permanently changes the shape of the position.',
        ],
      },
      {
        id: 'knight',
        title: 'The knight: the only jumper',
        paragraphs: [
          'The knight moves in an L-shape: two squares in one direction, then one square perpendicular. It is the only piece that can jump over friendly and enemy pieces. A knight on the edge controls fewer squares; a knight near the centre controls up to eight.',
          'Knights are especially useful in closed positions, where pawns block the long-range pieces. Their forks — attacking two valuable pieces at once — are one of the first tactical patterns a beginner should learn.',
        ],
      },
      {
        id: 'bishop',
        title: 'The bishop: a lifetime on one colour',
        paragraphs: [
          'A bishop moves any number of squares along a diagonal. It cannot jump over pieces. Each bishop is permanently bound to the colour of square it started on: one bishop controls light squares, the other dark squares.',
          'Bishops are strongest on open diagonals. A bishop blocked by its own pawns is often called a “bad bishop”; the solution is usually to move the pawns or find a better diagonal, not to abandon the bishop.',
        ],
      },
      {
        id: 'rook',
        title: 'The rook: the endgame engine',
        paragraphs: [
          'A rook moves any number of squares along a rank or file. It cannot jump. Rooks start in the corners and become more powerful as the pawns leave the board.',
          'Rooks belong on open files and on the seventh rank, where they can attack pawns from behind. Castling is the one time a rook moves without being chosen directly: it jumps to the square the king crossed.',
        ],
      },
      {
        id: 'queen',
        title: 'The queen: power with a target',
        paragraphs: [
          'The queen combines the rook and bishop: any distance along a rank, file, or diagonal. She is the most mobile piece on the board and usually the most valuable after the king.',
          'That power is also a liability. Bringing the queen out early invites attacks from knights and bishops, and every retreat loses time. A queen is strongest when the board is open and the king is exposed.',
        ],
      },
      {
        id: 'king',
        title: 'The king: one square, one rule',
        paragraphs: [
          'The king moves one square in any direction. It may not move into check, and it may not castle through a square attacked by an enemy piece. In the opening and middlegame, the king usually stays behind a pawn wall.',
          'In the endgame, the king becomes an active fighter. With few pieces left, centralising the king is often the difference between a win and a draw. The king is never captured; checkmate ends the game first.',
        ],
      },
      {
        id: 'values',
        title: 'Values are a guide, not a scoreboard',
        paragraphs: [
          'The usual beginner values are pawn 1, knight 3, bishop 3, rook 5, and queen 9. The king has no trading value because the game ends when it is checkmated. These numbers help you decide whether a trade is reasonable.',
          'They do not override the position. A rook on an open file can be worth more than a queen trapped behind its own pawns. A knight on a dominant outpost can outplay a bishop with no squares. Use the values as a first check, then ask what the piece can actually do.',
        ],
        table: {
          caption: 'A rough material guide for beginners',
          head: ['Piece', 'Value', 'Best when'],
          rows: [
            ['Pawn', '1', 'It creates space or prepares a promotion.'],
            ['Knight', '3', 'The centre is closed and it can reach an outpost.'],
            ['Bishop', '3', 'The diagonals are open.'],
            ['Rook', '5', 'A file or rank is open.'],
            ['Queen', '9', 'The king is exposed and the board is open.'],
            ['King', '∞', 'The endgame has begun and the king can advance safely.'],
          ],
        },
        links: [
          {
            slug: 'chess-rules',
            label: 'Read the complete rules',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Which chess piece is the most powerful?',
        answer:
          'The queen is the most powerful piece in normal play. The king is more important, but it cannot be traded and moves only one square at a time.',
      },
      {
        question: 'Can a knight jump over other pieces?',
        answer:
          'Yes. The knight is the only piece that can jump over friendly or enemy pieces. It still cannot land on a square occupied by a friendly piece.',
      },
      {
        question: 'Can a bishop change the colour of its square?',
        answer:
          'No. A bishop stays on the colour it started on for the whole game. That is why a pair of bishops covering both colours is valuable.',
      },
      {
        question: 'Can the king capture pieces?',
        answer:
          'Yes, if the piece is unprotected and the destination square is not attacked. A king may never move into check.',
      },
    ],
    sources: [FIDE_SOURCE],
    related: ['chess-rules', 'special-moves', 'chess-notation'],
  },
  {
    slug: 'special-moves',
    order: 4,
    navLabel: 'Special moves',
    kicker: 'Beginner path · 4 of 6',
    title: 'Chess Special Moves: Castling, En Passant & Promotion',
    description:
      'Castling, en passant, and promotion explained for beginners: the exact conditions, the notation, and the mistakes that make these special moves illegal.',
    h1: 'The three moves that surprise beginners.',
    lede:
      'Castling, en passant, and promotion look like exceptions. They are ordinary rules with precise conditions — and once you know those conditions, they stop being surprising.',
    readingTime: '7 min read',
    published: '2026-10-23',
    updated: '2026-10-23',
    reviewed: REVIEWED,
    keywords: ['castling', 'en passant', 'pawn promotion', 'chess special moves'],
    keyFacts: [
      { label: 'Castling', value: 'King + rook' },
      { label: 'En passant', value: 'Immediate only' },
      { label: 'Promotion', value: 'Far rank' },
    ],
    sections: [
      {
        id: 'castling',
        title: 'Castling: two pieces, one move',
        paragraphs: [
          'Castling is the only move that moves two pieces at once. The king moves two squares toward a rook, and the rook jumps to the square the king crossed. Kingside castling is written O-O; queenside castling is O-O-O.',
          'The conditions are strict. The king and the chosen rook must not have moved earlier in the game. The squares between them must be empty. The king may not be in check, pass through a square attacked by the enemy, or finish on an attacked square. The rook may be attacked; only the king’s path matters.',
        ],
        list: [
          'Kingside: the king goes from e1 to g1; the rook goes from h1 to f1.',
          'Queenside: the king goes from e1 to c1; the rook goes from a1 to d1.',
          'Black castles on the same files from the eighth rank.',
          'You may not castle if the king or rook has already moved, even if it moved back.',
        ],
        note:
          'A common mistake is thinking that an attacked rook prevents castling. It does not. What matters is whether the king starts in check, crosses an attacked square, or lands in check.',
      },
      {
        id: 'en-passant',
        title: 'En passant: one chance, immediately',
        paragraphs: [
          'En passant is a pawn capture that happens as if an enemy pawn had advanced only one square. It is available only when an enemy pawn moves two squares from its starting rank and lands beside your pawn on the same rank.',
          'On your very next move, your pawn may capture diagonally onto the square the enemy pawn skipped. The captured pawn is removed. If you do not take it immediately, the right disappears. You cannot save it for a later turn.',
        ],
        note:
          'The notation is sometimes written “e.p.” or shown with the capture square. In practice, most scores simply record the capture, such as 3.exd6, and the context makes the en passant clear.',
      },
      {
        id: 'promotion',
        title: 'Promotion: a pawn becomes something else',
        paragraphs: [
          'When a pawn reaches the far rank, it must be promoted to a queen, rook, bishop, or knight. The pawn does not stay a pawn, and promotion is part of the move. A player may have more than one queen; there is no limit on promoted pieces beyond the board.',
          'A queen is the usual choice because it is the most powerful piece. A knight is occasionally better because it moves differently and can create an immediate fork. A rook or bishop is rarely the best choice, but both are legal. You may not promote to a king.',
        ],
        list: [
          'Promotion happens on the eighth rank for White and the first rank for Black.',
          'Choose the piece as part of the move; you cannot defer the choice.',
          'A captured promoted piece is simply removed like any other piece.',
          'Underpromotion is legal and sometimes the strongest move.',
        ],
      },
      {
        id: 'check',
        title: 'Check is not a special move',
        paragraphs: [
          'Check is simply an attack on the king. When the king is in check, the next move must remove the attack: move the king, block the line, or capture the attacking piece. You may not ignore check, and you may not make a move that leaves your own king in check.',
          'Checkmate is check with no legal escape. Stalemate is no legal move with no check. The difference matters: checkmate wins; stalemate draws.',
        ],
      },
      {
        id: 'practice',
        title: 'How to remember them',
        paragraphs: [
          'For castling, check the king first: has it moved, is it in check, does it cross an attacked square, does it land on one? Then check the rook and the empty squares. For en passant, ask whether the enemy pawn just moved two squares. For promotion, remember that the choice is part of the move.',
          'Set up each position on a board and play the move once. A rule you have physically moved is easier to remember than a rule you have only read.',
        ],
        links: [
          {
            slug: 'chess-rules',
            label: 'The complete rules',
          },
          {
            slug: 'chess-notation',
            label: 'How these moves are written',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can you castle after the king has moved?',
        answer:
          'No. If the king has moved at any point, castling is no longer legal, even if it returns to e1. The same applies to the rook on the side you want to castle with.',
      },
      {
        question: 'Can you castle out of check?',
        answer:
          'No. You may not castle while the king is in check, through check, or into check. An attacked rook does not prevent castling by itself.',
      },
      {
        question: 'How long do you have to capture en passant?',
        answer:
          'Only for the immediately following move. If you make another move, the en passant right is gone.',
      },
      {
        question: 'Can a pawn become a king?',
        answer:
          'No. A pawn may be promoted only to a queen, rook, bishop, or knight. There is no promotion to king.',
      },
    ],
    sources: [FIDE_SOURCE],
    related: ['chess-rules', 'scholars-mate', 'chess-notation'],
  },
  {
    slug: 'scholars-mate',
    order: 5,
    navLabel: 'Scholar’s Mate',
    kicker: 'Beginner path · 5 of 6',
    title: 'Scholar’s Mate: The 4-Move Checkmate',
    description:
      'Scholar’s Mate explained move by move: the four-move checkmate, why f7 is vulnerable, the defensive replies that stop it, and what the trap teaches beginners.',
    h1: 'Scholar’s Mate, move by move.',
    lede:
      'Scholar’s Mate is the first checkmate many players learn. It is also the first trap many players fall for. Here is how it works, how to stop it, and what it can teach you.',
    readingTime: '7 min read',
    published: '2026-10-23',
    updated: '2026-10-23',
    reviewed: REVIEWED,
    keywords: ['scholars mate', 'four move checkmate', 'chess checkmate for beginners'],
    keyFacts: [
      { label: 'Moves', value: 'Four for White' },
      { label: 'Target', value: 'f7' },
      { label: 'Result', value: 'Checkmate' },
    ],
    sections: [
      {
        id: 'what-it-is',
        title: 'What Scholar’s Mate is',
        paragraphs: [
          'Scholar’s Mate is a four-move checkmate played by White: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#. The exact move order can vary, but the idea is always the same: the bishop aims at f7, the queen joins the attack, and Black fails to defend the square.',
          'It is not a forced win. If Black sees the threat, the attack can be stopped. That is why it is a useful first lesson: it teaches you to look for the opponent’s threats before making a natural-looking move.',
        ],
      },
      {
        id: 'the-moves',
        title: 'The four moves',
        paragraphs: [
          'White starts by claiming the centre with 1.e4. Black replies 1...e5. White develops the bishop to c4, where it points at f7. Black develops the knight to c6, which is reasonable but does not address the bishop’s aim.',
          'White brings the queen to h5. The queen and bishop both target f7. Black plays 3...Nf6, attacking the queen but leaving f7 undefended. White captures on f7 with the queen. The bishop on c4 protects the queen, and the black king has no escape. Checkmate.',
        ],
        table: {
          caption: 'The standard Scholar’s Mate sequence',
          head: ['Move', 'White', 'Black', 'What it does'],
          rows: [
            ['1', 'e4', 'e5', 'Both sides claim central space.'],
            ['2', 'Bc4', 'Nc6', 'The bishop targets f7; Black develops.'],
            ['3', 'Qh5', 'Nf6??', 'The queen joins the attack; Black ignores it.'],
            ['4', 'Qxf7#', '—', 'The bishop protects the queen; mate.'],
          ],
        },
      },
      {
        id: 'why-f7',
        title: 'Why f7 is the target',
        paragraphs: [
          'At the start of the game, f7 is defended only by the black king. It sits next to the king and is often the weakest point in Black’s camp. A bishop on c4 and a queen on h5 can both attack it, which is why the pattern appears so often in beginner games.',
          'The same logic applies to f2 for White. Black can use a mirror-image attack, though White moves first and can usually defend. The lesson is not “always attack f7”; it is “notice which squares around the king are defended by only one piece.”',
        ],
      },
      {
        id: 'how-to-stop-it',
        title: 'How to stop Scholar’s Mate',
        paragraphs: [
          'After 3.Qh5, Black must respect the threat to f7. The simplest defences are 3...Qe7, 3...g6, or 3...Qf6. Each adds a defender, blocks the attack, or creates an escape square. The exact choice depends on the position, but the principle is constant: answer the threat instead of making a routine developing move.',
          'If you are playing White and Black defends correctly, do not force the mate. Retreat the queen, finish development, and play the position. The trap is a bonus, not a plan.',
        ],
        list: [
          '3...Qe7 defends f7 and keeps the queen central.',
          '3...g6 attacks the queen and blocks the h5–f7 diagonal.',
          '3...Qf6 challenges the queen and defends the weak square.',
          'After the queen retreats, develop normally and castle.',
        ],
      },
      {
        id: 'what-it-teaches',
        title: 'What the trap teaches',
        paragraphs: [
          'Scholar’s Mate is a lesson in tempo and king safety. Every move that ignores a direct threat gives the opponent a free move. The trap also shows why “developing” is not the same as “safe”: 3...Nf6 develops a piece and loses the game.',
          'The best response is not to memorise a long refutation. It is to build the habit of asking, before every move, what the opponent’s last move threatened. That habit will save you in far more games than this one pattern.',
        ],
      },
      {
        id: 'play-it',
        title: 'Play the interactive lesson',
        paragraphs: [
          'The home page contains a scroll-driven Scholar’s Mate lesson. It starts from the initial position, moves one piece at a time, and shows the final mate on f7. On a phone or with reduced motion, the same lesson becomes a static step-through with Previous and Next controls.',
        ],
        links: [
          {
            slug: 'chess-notation',
            label: 'Decode the moves',
          },
          {
            slug: 'learn-chess',
            label: 'Back to the beginner path',
          },
        ],
      },
    ],
    howTo: {
      name: 'How to play Scholar’s Mate',
      description:
        'A four-move checkmate pattern for White, with the standard replies and the defensive idea Black needs to know.',
      steps: [
        { name: '1. e4', text: 'White claims the centre and opens lines for the bishop and queen.' },
        { name: '1... e5', text: 'Black mirrors the central claim.' },
        { name: '2. Bc4', text: 'The bishop develops and points at f7.' },
        { name: '2... Nc6', text: 'Black develops a knight but does not defend f7.' },
        { name: '3. Qh5', text: 'The queen joins the attack on f7.' },
        { name: '3... Nf6??', text: 'Black attacks the queen but ignores the mate threat.' },
        { name: '4. Qxf7#', text: 'The queen captures on f7, protected by the bishop. Checkmate.' },
      ],
    },
    faqs: [
      {
        question: 'Is Scholar’s Mate a good opening?',
        answer:
          'No. It is a trap, not a sound opening plan. If Black defends correctly, White has spent time moving the queen early. Learn it to recognise the pattern, not to rely on it.',
      },
      {
        question: 'How do you defend against Scholar’s Mate?',
        answer:
          'After 3.Qh5, defend f7 or make room for the king. Moves such as 3...Qe7, 3...g6, or 3...Qf6 are common. The key is to answer the threat instead of developing automatically.',
      },
      {
        question: 'Can Black play Scholar’s Mate?',
        answer:
          'Black can try a mirror-image attack on f2, but White moves first and can usually defend. The pattern is less common and easier to stop.',
      },
      {
        question: 'Why is it called Scholar’s Mate?',
        answer:
          'The name suggests a superficially clever mate that beginners learn early. It is sometimes called the four-move checkmate. The exact origin of the name is not essential to the pattern.',
      },
    ],
    sources: [FIDE_SOURCE],
    related: ['chess-notation', 'special-moves', 'learn-chess'],
  },
  {
    slug: 'chess-notation',
    order: 6,
    navLabel: 'Notation',
    kicker: 'Beginner path · 6 of 6',
    title: 'Chess Notation for Beginners: How to Read Moves',
    description:
      'Learn to read and write chess notation: squares, piece letters, captures, check, checkmate, castling, promotion, and the annotations you see in game scores.',
    h1: 'How to read a chess game.',
    lede:
      'Chess notation is a compact address book. Once you know the piece letters and the destination squares, a game score becomes a sequence you can replay move by move.',
    readingTime: '7 min read',
    published: '2026-10-23',
    updated: '2026-10-23',
    reviewed: REVIEWED,
    keywords: ['chess notation', 'how to read chess notation', 'chess moves notation'],
    keyFacts: [
      { label: 'Files', value: 'a–h' },
      { label: 'Ranks', value: '1–8' },
      { label: 'Capture', value: 'x' },
    ],
    sections: [
      {
        id: 'squares',
        title: 'Start with the square',
        paragraphs: [
          'Every square has a two-character address: a file letter and a rank number. Files run a to h from White’s left; ranks run 1 to 8 from White’s side. The white king starts on e1, the black king on e8, and the central pawns begin on e2 and e7.',
          'A move is usually written as the piece letter followed by the destination square. If no piece letter appears, the move is a pawn move. So e4 means a pawn moves to e4, while Nf3 means a knight moves to f3.',
        ],
      },
      {
        id: 'pieces',
        title: 'The piece letters',
        paragraphs: [
          'Each piece has a single uppercase letter in English notation: K for king, Q for queen, R for rook, B for bishop, and N for knight. The knight uses N because K is already taken by the king. Pawns have no letter.',
          'In algebraic notation, the destination square is the important part. The starting square is usually omitted. If two identical pieces can reach the same square, a file or rank is added to make the move unambiguous, such as Nbd2 or R1e2.',
        ],
        table: {
          caption: 'The notation alphabet',
          head: ['Symbol', 'Meaning', 'Example'],
          rows: [
            ['K', 'King', 'Ke2'],
            ['Q', 'Queen', 'Qh5'],
            ['R', 'Rook', 'Rd1'],
            ['B', 'Bishop', 'Bc4'],
            ['N', 'Knight', 'Nf3'],
            ['(none)', 'Pawn', 'e4'],
            ['x', 'Capture', 'Bxe5'],
            ['+', 'Check', 'Qh5+'],
            ['#', 'Checkmate', 'Qxf7#'],
            ['O-O', 'Kingside castling', 'O-O'],
            ['O-O-O', 'Queenside castling', 'O-O-O'],
            ['=Q', 'Promotion to queen', 'e8=Q'],
          ],
        },
      },
      {
        id: 'captures',
        title: 'Captures, checks, and mate',
        paragraphs: [
          'An x marks a capture. Bxe5 means a bishop captures on e5. The captured piece is not named; the destination and the position make it clear. A plus sign means check, and a hash means checkmate. Some older or informal scores use “++” for checkmate; modern algebraic notation uses #.',
          'A move that puts the opponent in check is not automatically good. The notation only records what happened, not whether it was a blunder. That is why you still need to read the position, not just the score.',
        ],
      },
      {
        id: 'special',
        title: 'Castling, promotion, and en passant',
        paragraphs: [
          'Castling is written O-O for kingside and O-O-O for queenside. It is the only move written with letters that do not name a destination square. Promotion is written with an equals sign and the new piece: e8=Q, e8=R, e8=B, or e8=N.',
          'En passant is usually recorded as a normal pawn capture. If the pawn on e5 captures a black pawn that has just moved to d5, the score may show exd6. Some publications add “e.p.” for clarity, but it is not required in modern algebraic notation.',
        ],
      },
      {
        id: 'annotations',
        title: 'Annotations: the commentary layer',
        paragraphs: [
          'You will often see punctuation after a move. A single exclamation mark (!) marks a strong move; a question mark (?) marks a mistake; !? is interesting, and ?! is dubious. Two exclamation marks (!!) mark a brilliant move, and two question marks (??) mark a blunder.',
          'These marks are commentary, not part of the official move. Different annotators may disagree about whether a move deserves one. Treat them as a prompt to look closer, not as a final judgment.',
        ],
      },
      {
        id: 'sample',
        title: 'A short game score',
        paragraphs: [
          'Here is the Scholar’s Mate sequence in algebraic notation: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#. Read it as a conversation: White moves, Black replies, and the move number usually appears before White’s move. When a score begins with Black, the first move is written 1...e5.',
          'Once you can read that line, you can replay any game score. Start with short games and say each move out loud as you play it. The notation becomes automatic faster than you expect.',
        ],
        links: [
          {
            slug: 'scholars-mate',
            label: 'See the full Scholar’s Mate guide',
          },
        ],
      },
      {
        id: 'next',
        title: 'Where to go from here',
        paragraphs: [
          'Return to the beginner path and play through the interactive Scholar’s Mate lesson. Then read a short annotated game and follow the score on a board. Notation is a tool for seeing patterns, not an end in itself.',
        ],
        links: [
          {
            slug: 'learn-chess',
            label: 'Return to the beginner path',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Why is the knight written as N instead of K?',
        answer:
          'K is already used for the king. English notation uses N for knight, from the word “knight.” Other languages use different letters, but algebraic notation is otherwise similar.',
      },
      {
        question: 'What does x mean in chess notation?',
        answer:
          'An x means a capture. Bxe5 means a bishop captures the piece on e5. The captured piece is not named in the notation.',
      },
      {
        question: 'What does # mean in chess notation?',
        answer:
          'A hash means checkmate. A plus sign means check. Some older scores use other symbols, but # is standard in modern algebraic notation.',
      },
      {
        question: 'How is en passant written?',
        answer:
          'Usually as a normal pawn capture, with the destination square the capturing pawn moves to. Some sources add “e.p.” for clarity, but it is optional.',
      },
    ],
    sources: [FIDE_SOURCE],
    related: ['scholars-mate', 'special-moves', 'learn-chess'],
  },
];

export const guideBySlug = new Map(guidePages.map((page) => [page.slug, page]));

export function normalizePath(pathname = '/') {
  const clean = String(pathname).split('?')[0].split('#')[0] || '/';
  if (clean === '/') return '/';
  return `${clean.replace(/\/+$/, '')}/`;
}

export function getGuidePage(pathname = '/') {
  const path = normalizePath(pathname);
  const slug = path.replace(/^\/|\/$/g, '');
  return guideBySlug.get(slug) ?? null;
}

export function guidePath(slug) {
  return `/${slug}/`;
}
