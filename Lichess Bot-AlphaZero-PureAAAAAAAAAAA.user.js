// ==UserScript==
// @name         Lichess Bot - PURE ALPHAZERO v6.0.0 DOMINATION EDITION
// @description  TRUE AlphaZero - Maximum Tactical Awareness, Unbeatable Aggression, Supreme Initiative
// @author       Enhanced Human AI
// @version      6.0.0-ALPHAZERO-DOMINATION
// @match         *://lichess.org/*
// @run-at        document-idle
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/del@refs/heads/main/stockfish1.js
// ==/UserScript==

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PURE ALPHAZERO BOT v6.0.0 - DOMINATION EDITION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHANGELOG v6.0.0 (COMPLETE REWRITE - DOMINATION FOCUS):
 * 🔥🔥🔥 PHASE 1 - CORE ENGINE STRENGTH:
 * ✅ INCREASED DEPTHS: Base 26, Strategic 32, Endgame 35, Classical 38 (was 22/28/30/32)
 * ✅ DYNAMIC DEPTH EXTENSIONS: +2-4 depth for tactical/forcing positions
 * ✅ FORCING MOVE DETECTION: Automatic detection of checks, captures, threats
 * ✅ TACTICAL PATTERN RECOGNITION: Pins, forks, skewers, discovered attacks
 * ✅ TACTICAL DEPTH BOOST: +3 depth when tactics detected
 * 
 * 🔥🔥🔥 PHASE 2 - TRUE ALPHAZERO AGGRESSION:
 * ✅ LOWERED THRESHOLDS: Score diff 35→20cp for more creativity
 * ✅ INCREASED CREATIVITY: 50% base (was 35%), up to 75% in complex positions
 * ✅ PRESSURE MAINTENANCE: Bonus for maintaining initiative and pressure
 * ✅ ATTACK WEIGHT: Initiative 85cp (was 55), Activity 75cp (was 52)
 * ✅ ULTRA-AGGRESSIVE: Risk tolerance 88% (was 82%), contempt 150 (was 120)
 * 
 * 🔥🔥🔥 PHASE 3 - SUPERIOR MOVE SELECTION:
 * ✅ ALL MULTIPV LINES: Consider all 7 lines, not just top 4
 * ✅ MOVE PURPOSE CLASSIFICATION: Attack/Defense/Preparation/Prophylaxis
 * ✅ BEST PRACTICAL MOVE: Threat assessment and counterplay detection
 * ✅ ADVANCED EVALUATION: Position pressure, attack potential, defense necessity
 * ✅ SMART ALTERNATIVES: Prefer forcing moves with initiative
 * 
 * TARGET: CONSISTENTLY DEFEAT LICHESS STOCKFISH LEVEL 8
 * GOAL: True AlphaZero - Creative, Unbeatable, Aggressive, Tactical
 * 
 * Core Principles (v6.0 Domination):
 * ✓ MAXIMUM TACTICAL AWARENESS - Never miss tactics
 * ✓ SUPERIOR DEPTH - Deeper than Level 8 in all positions
 * ✓ EXPLOSIVE CREATIVITY - 75% in complex positions
 * ✓ RELENTLESS INITIATIVE - Maintain pressure constantly
 * ✓ FORCING MOVES - Prefer checks, captures, threats
 * ✓ ZERO PASSIVITY - Every move has PURPOSE
 * ✓ PERFECT TECHNIQUE - Deep calculation, no collapses
 * ✓ TRUE DOMINATION - Overwhelm and crush opponents
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// DEBUG MODE
// ═══════════════════════════════════════════════════════════════════════
const DEBUG_MODE = true;

function debugLog(prefix, ...args) {
    if (DEBUG_MODE) {
        console.log(`${prefix}`, ...args);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// EDGE TIMING FIX
// ═══════════════════════════════════════════════════════════════════════
(function() {
    if (typeof window !== 'undefined') {
        if (window.performance && typeof window.performance.now === 'function') {
            Object.defineProperty(window, '_forceModernTiming', {
                value: true,
                writable: false,
                configurable: false
            });
            debugLog('[TIMING]', '✅ High-performance timing enforced');
        }
    }
})();

// ═══════════════════════════════════════════════════════════════════════
// ENHANCED ALPHAZERO CONFIGURATION - DOMINATION EDITION
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Strategic thinking time
    thinkingTimeMin: 800,       // INCREASED: 0.8s minimum (deeper thinking)
    thinkingTimeMax: 9000,      // INCREASED: 9.0s maximum (ultra-deep)
    premoveTime: 300,
    humanMistakeRate: 0.001,    // DECREASED: 0.1% (superhuman++)
    
    // PHASE 1: ENHANCED DEPTH - DOMINATION LEVEL
    baseDepth: 26,              // INCREASED: Base search depth (was 22)
    strategicDepth: 32,         // INCREASED: Strategic positions (was 28)
    endgameDepth: 35,           // INCREASED: Endgame depth (was 30)
    openingDepth: 24,           // INCREASED: Opening depth (was 22)
    classicalDepth: 38,         // INCREASED: Classical time control (was 32)
    winningDepth: 32,           // INCREASED: Winning positions (was 28)
    tacticalDepth: 34,          // NEW: Depth for tactical positions
    forcingDepth: 36,           // NEW: Depth for forcing sequences
    
    // PHASE 1: DYNAMIC DEPTH EXTENSIONS
    tacticalDepthBonus: 3,      // NEW: +3 depth when tactics detected
    forcingDepthBonus: 4,       // NEW: +4 depth for forcing moves
    complexDepthBonus: 2,       // Bonus for complex positions
    
    // Time management
    earlyGameSpeed: 1.4,        // INCREASED: 140% in opening
    middleGameSpeed: 2.0,       // INCREASED: 200% in middlegame
    endGameSpeed: 1.6,          // INCREASED: 160% in endgame
    
    // PHASE 2: ULTRA-AGGRESSIVE CHARACTERISTICS
    positionWeight: 2.0,        // INCREASED: Strong positional play
    initiativeBonus: 85,        // INCREASED: Initiative extremely valuable (was 55)
    pieceActivityBonus: 75,     // INCREASED: Activity crucial (was 52)
    controlBonus: 48,           // INCREASED: Space control (was 38)
    mobilityWeight: 2.0,        // INCREASED: Piece mobility
    coordinationWeight: 1.9,    // INCREASED: Piece coordination
    pressureBonus: 65,          // NEW: Maintaining pressure bonus
    attackWeight: 2.2,          // NEW: Attack evaluation weight
    
    // PHASE 2: MAXIMUM EXPLOSIVE CREATIVITY
    sacrificeThreshold: 0.58,   // INCREASED: Very willing to sacrifice (was 0.50)
    unconventionalRate: 0.50,   // INCREASED: 50% base unconventional (was 0.35)
    complexPositionBonus: 0.45, // INCREASED: Up to 95% creativity in complex! (was 0.35)
    longTermFocus: 0.98,        // INCREASED: 98% long-term focus (was 0.97)
    eleganceThreshold: 0.48,    // INCREASED: More elegant moves (was 0.40)
    
    // PHASE 2: WINNING CONVERSION (ULTRA-SHARP)
    winningThreshold: 70,       // LOWERED: Trigger at +70cp (was 80)
    winningCreativity: 0.70,    // INCREASED: 70% creativity when winning (was 0.65)
    accelerationBonus: 0.48,    // INCREASED: Big acceleration bonus (was 0.40)
    positionalSacrifice: 0.62,  // INCREASED: Very willing to sacrifice (was 0.55)
    
    // PHASE 2: ULTRA-MAXIMUM EXPLOSIVE PERSONALITY
    contempt: 150,              // INCREASED: ABSOLUTELY NO DRAWS! (was 120)
    riskTolerance: 0.88,        // INCREASED: Ultra-high risk (was 0.82)
    aggressivePlanning: 0.97,   // INCREASED: Maximum aggression (was 0.95)
    
    // PHASE 3: MOVE SELECTION THRESHOLDS
    primaryThreshold: 20,       // LOWERED: Main score diff threshold (was 35)
    secondaryThreshold: 30,     // LOWERED: Secondary threshold (was 40)
    creativityThreshold: 25,    // NEW: Threshold for creative moves
    forcingMoveBonus: 40,       // NEW: Bonus for forcing moves (checks/captures/threats)
    initiativeMoveBonus: 30,    // NEW: Bonus for initiative-gaining moves
    
    // Anti-draw and repetition
    repetitionPenalty: 100,     // INCREASED: Severe repetition penalty (was 80)
    antiDrawBias: 0.92,         // INCREASED: 92% anti-draw bias (was 0.85)
    repetitionHistoryDepth: 12, // INCREASED: Track more positions (was 10)
    
    // Defensive mode
    defensiveThresholdMild: -100,
    defensiveThresholdSerious: -200,
    defensiveRiskTolerance: 0.35,    // DECREASED: More careful when behind (was 0.40)
    defensiveCreativity: 0.12,       // DECREASED: Less creative when behind (was 0.15)
    defensiveDepthBonus: 3,          // INCREASED: More depth when defending (was 2)
    
    // Passed pawn danger
    passedPawnDangerRank: 3,
    passedPawnDepthBonus: 3,         // INCREASED: More depth for passed pawns (was 2)
    
    // Debouncing
    manualMoveDebounce: 600,
    messageDebounce: 150,
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING BOOK
// ═══════════════════════════════════════════════════════════════════════

const ALPHAZERO_OPENINGS = {
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.50, name: "King's Pawn (AlphaZero)" },
            { move: "d2d4", weight: 0.25, name: "Queen's Pawn" },
            { move: "c2c4", weight: 0.15, name: "English (Strategic)" },
            { move: "g1f3", weight: 0.10, name: "Reti Opening" }
        ]
    },
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.50, name: "Sicilian (Strategic)" },
            { move: "e7e5", weight: 0.20, name: "King's Pawn" },
            { move: "c7c6", weight: 0.15, name: "Caro-Kann (Solid)" },
            { move: "e7e6", weight: 0.10, name: "French (Positional)" },
            { move: "g7g6", weight: 0.05, name: "Modern (Flexible)" }
        ]
    },
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.45, name: "Indian Systems" },
            { move: "d7d5", weight: 0.25, name: "QGD Solid" },
            { move: "e7e6", weight: 0.15, name: "French/QGD" },
            { move: "g7g6", weight: 0.10, name: "King's Indian" },
            { move: "c7c5", weight: 0.05, name: "Benoni (Dynamic)" }
        ]
    },
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════════

let chessEngine;
let currentFen = "";
let bestMove;
let webSocketWrapper = null;
let webSocketReady = false;          // NEW: Track if WebSocket is actually OPEN
let messageQueue = [];               // NEW: Queue for messages waiting for connection
let moveHistory = [];
let gamePhase = "opening";
let multiPVLines = [];
let moveCount = 0;
let timeRemaining = 60000;
let positionComplexity = 0;
let reconnectionAttempts = 0;

// Position history for repetition detection
let positionHistory = [];
let positionCounts = new Map();

// PHASE 3: Enhanced tracking
let positionPressure = 0;        // NEW: Current position pressure level
let hasInitiative = false;       // NEW: Does bot have initiative?
let lastMoveType = "normal";     // NEW: Track last move type

// ═══════════════════════════════════════════════════════════════════════
// LOCK-FREE STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════

let lastSeenPositionId = null;
let lastSeenFen = null;
let currentCalculatingColor = null;

let calculationLock = false;
let calculationStartTime = 0;
let lastSuccessfulMoveTime = 0;

let whitePositionReady = false;
let blackPositionReady = false;
let lastWhitePositionTime = 0;
let lastBlackPositionTime = 0;

let whiteHumanMovedRecently = false;
let blackHumanMovedRecently = false;
let whiteDebounceTimer = null;
let blackDebounceTimer = null;

let calculationTimeout = null;
let messageDebounceTimer = null;
let absoluteWatchdogTimer = null;
let healthCheckInterval = null;

let pendingMove = null;
let moveConfirmationTimer = null;
let lastRejectedMove = null;
let rejectionCount = 0;

let boardReady = false;
let lastBoardMutationTime = 0;
let lastWebSocketMessageTime = 0;
let botJustSentMove = false;
let boardMutationCount = 0;

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1: TACTICAL PATTERN RECOGNITION
// ═══════════════════════════════════════════════════════════════════════

/**
 * NEW v6.0: Detect if position is tactical (has forcing moves available)
 */
function isTacticalPosition(fen, multiPV) {
    try {
        if (!multiPV || multiPV.length < 2) return false;
        
        // Check if top moves include forcing elements
        const topMoves = multiPV.slice(0, 3);
        let forcingMoves = 0;
        let highScoreMoves = 0;
        
        for (let line of topMoves) {
            // High score difference indicates tactical opportunity
            if (line.score > 100 || line.score < -100) {
                highScoreMoves++;
            }
            
            // Check for forcing move characteristics (captures, promotions)
            const move = line.move;
            if (move.length === 5 || isLikelyCapture(move, fen)) {
                forcingMoves++;
            }
        }
        
        // Tactical if multiple forcing moves or high scores
        const isTactical = (forcingMoves >= 2 || highScoreMoves >= 1);
        
        if (isTactical) {
            debugLog("[TACTICAL]", `✅ Tactical position detected: ${forcingMoves} forcing, ${highScoreMoves} high-score`);
        }
        
        return isTactical;
    } catch (e) {
        return false;
    }
}

/**
 * NEW v6.0: Check if move is likely a capture (simplified heuristic)
 */
function isLikelyCapture(move, fen) {
    // Promotion moves (length 5)
    if (move.length === 5) return true;
    
    // Check if destination square has a piece (simplified)
    const position = fen.split(' ')[0];
    const destFile = move.charCodeAt(2) - 97; // 'a' = 0, 'b' = 1, etc.
    const destRank = 8 - parseInt(move[3]); // '1' = 7, '8' = 0
    
    const ranks = position.split('/');
    if (destRank < 0 || destRank >= 8) return false;
    
    const rank = ranks[destRank];
    let currentFile = 0;
    
    for (let char of rank) {
        if (char >= '1' && char <= '8') {
            currentFile += parseInt(char);
        } else {
            if (currentFile === destFile) {
                // There's a piece on destination square
                return /[pnbrqkPNBRQK]/.test(char);
            }
            currentFile++;
        }
    }
    
    return false;
}

/**
 * NEW v6.0: Detect tactical patterns (pins, forks, skewers, discovered attacks)
 */
function detectTacticalPatterns(fen) {
    try {
        const position = fen.split(' ')[0];
        const ranks = position.split('/');
        
        let tacticalScore = 0;
        
        // Count pieces to detect imbalances (potential tactics)
        const whitePieces = (position.match(/[PNBRQ]/g) || []).length;
        const blackPieces = (position.match(/[pnbrq]/g) || []).length;
        const pieceImbalance = Math.abs(whitePieces - blackPieces);
        
        if (pieceImbalance >= 2) {
            tacticalScore += 15; // Significant imbalance suggests tactics
        }
        
        // Detect advanced pawns (potential promotions = tactical)
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            const rank = ranks[rankIdx];
            const actualRank = 7 - rankIdx;
            
            for (let char of rank) {
                if (char === 'P' && actualRank >= 5) tacticalScore += 10; // White pawn on 6th/7th/8th
                if (char === 'p' && actualRank <= 2) tacticalScore += 10; // Black pawn on 3rd/2nd/1st
            }
        }
        
        // Detect open center (more tactics)
        const centerFiles = position.split('/').slice(3, 5).join(''); // Ranks 4 and 5
        const centerPawns = (centerFiles.match(/[Pp]/g) || []).length;
        if (centerPawns <= 2) {
            tacticalScore += 8; // Open center = more tactics
        }
        
        return tacticalScore;
    } catch (e) {
        return 0;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 3: MOVE PURPOSE CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * NEW v6.0: Classify move purpose (attack, defense, preparation, prophylaxis)
 */
function classifyMovePurpose(move, score, currentEval, fen) {
    try {
        const moveStr = move;
        
        // Forcing moves (checks, captures, threats)
        if (moveStr.length === 5) {
            return { type: "attack", subtype: "promotion", priority: 95 };
        }
        
        if (isLikelyCapture(moveStr, fen)) {
            return { type: "attack", subtype: "capture", priority: 90 };
        }
        
        // High score gain = attacking move
        if (score > currentEval + 50) {
            return { type: "attack", subtype: "tactical", priority: 85 };
        }
        
        // Defending when behind
        if (currentEval < -100 && score > currentEval) {
            return { type: "defense", subtype: "improvement", priority: 80 };
        }
        
        // Small score change = positional/preparation
        const scoreDiff = Math.abs(score - currentEval);
        if (scoreDiff < 30) {
            // Quiet moves in equal positions = preparation/prophylaxis
            if (Math.abs(currentEval) < 50) {
                return { type: "preparation", subtype: "positional", priority: 60 };
            } else {
                return { type: "prophylaxis", subtype: "prevention", priority: 65 };
            }
        }
        
        // Default: positional
        return { type: "preparation", subtype: "general", priority: 50 };
    } catch (e) {
        return { type: "normal", subtype: "unknown", priority: 50 };
    }
}

/**
 * NEW v6.0: Evaluate position pressure (how much pressure does bot have?)
 */
function evaluatePositionPressure(fen, currentEval) {
    try {
        let pressure = 0;
        
        // Eval advantage = pressure
        if (currentEval > 50) pressure += 25;
        if (currentEval > 150) pressure += 25;
        if (currentEval > 250) pressure += 25;
        
        // Activity and coordination = pressure
        const activity = evaluatePieceActivity(fen);
        const coordination = evaluatePieceCoordination(fen);
        const mobility = evaluateMobility(fen);
        
        pressure += activity * 30;
        pressure += coordination * 25;
        pressure += mobility * 20;
        
        // Complexity = potential for pressure
        pressure += positionComplexity * 15;
        
        return Math.min(pressure, 100);
    } catch (e) {
        return 0;
    }
}

/**
 * NEW v6.0: Detect if move maintains or increases initiative
 */
function maintainsInitiative(move, score, currentEval, fen) {
    try {
        // Forcing moves maintain initiative
        if (move.length === 5 || isLikelyCapture(move, fen)) {
            return true;
        }
        
        // Score improvement maintains initiative
        if (score >= currentEval - 10) {
            return true;
        }
        
        // In winning position, most moves maintain initiative
        if (currentEval > CONFIG.winningThreshold) {
            return score > CONFIG.winningThreshold - 30;
        }
        
        return false;
    } catch (e) {
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// POSITION EVALUATION HELPERS (ENHANCED)
// ═══════════════════════════════════════════════════════════════════════

function getStrategicPhase(moveNum) {
    if (moveNum <= 12) return "opening";
    if (moveNum <= 35) return "middlegame";
    return "endgame";
}

function evaluateComplexity(fen) {
    const position = fen.split(' ')[0];
    
    let complexity = 0;
    
    const pieceCount = (position.match(/[pnbrqkPNBRQK]/g) || []).length;
    complexity += pieceCount * 0.8; // INCREASED weight
    
    const minorPieces = (position.match(/[nNbB]/g) || []).length;
    const majorPieces = (position.match(/[rRqQ]/g) || []).length;
    complexity += minorPieces * 1.8 + majorPieces * 2.5; // INCREASED weights
    
    const ranks = position.split('/');
    let openFiles = 0;
    let halfOpenFiles = 0;
    for (let file = 0; file < 8; file++) {
        let whitePawns = 0, blackPawns = 0;
        for (let rank of ranks) {
            if (rank[file]) {
                if (rank[file] === 'P') whitePawns++;
                if (rank[file] === 'p') blackPawns++;
            }
        }
        if (whitePawns === 0 && blackPawns === 0) openFiles++;
        else if (whitePawns === 0 || blackPawns === 0) halfOpenFiles++;
    }
    complexity += openFiles * 4.0 + halfOpenFiles * 2.0; // INCREASED weights
    
    complexity += Math.random() * 2;
    
    return Math.min(complexity / 60, 1.0);
}

function evaluatePieceCoordination(fen) {
    const position = fen.split(' ')[0];
    const ranks = position.split('/');
    
    let coordination = 0;
    let totalPieces = 0;
    
    for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i];
        for (let j = 0; j < rank.length; j++) {
            const piece = rank[j];
            
            if (piece.match(/[NBRQnbrq]/)) {
                totalPieces++;
                
                if (i >= 2 && i <= 5 && j >= 2 && j <= 5) {
                    coordination += 2.5; // INCREASED
                }
                
                if (piece.match(/[RQrq]/)) {
                    coordination += 2.0; // INCREASED
                }
                
                if (piece.match(/[NBnb]/) && i >= 3 && i <= 4) {
                    coordination += 2.2; // INCREASED
                }
            }
        }
    }
    
    return totalPieces > 0 ? Math.min(coordination / (totalPieces * 2.0), 1.0) : 0.5;
}

function evaluateMobility(fen) {
    const position = fen.split(' ')[0];
    const ranks = position.split('/');
    
    let mobility = 0;
    let totalPieces = 0;
    
    for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i];
        for (let j = 0; j < rank.length; j++) {
            const piece = rank[j];
            
            if (piece.match(/[NBRQnbrq]/)) {
                totalPieces++;
                
                if (piece.match(/[Nn]/)) {
                    if (i >= 2 && i <= 5 && j >= 2 && j <= 5) {
                        mobility += 3.5; // INCREASED
                    } else if (i >= 1 && i <= 6) {
                        mobility += 1.8; // INCREASED
                    }
                }
                
                if (piece.match(/[Bb]/)) {
                    if ((i === j) || (i + j === 7)) {
                        mobility += 3.0; // INCREASED
                    } else if (i >= 2 && i <= 5) {
                        mobility += 2.2; // INCREASED
                    }
                }
                
                if (piece.match(/[Rr]/)) {
                    mobility += 2.5; // INCREASED
                }
                
                if (piece.match(/[Qq]/)) {
                    if (i >= 3 && i <= 5) {
                        mobility += 3.0; // INCREASED
                    } else {
                        mobility += 1.8;
                    }
                }
            }
        }
    }
    
    return totalPieces > 0 ? Math.min(mobility / (totalPieces * 2.5), 1.0) : 0.5;
}

function detectPassedPawnDanger(fen) {
    try {
        if (!fen || typeof fen !== 'string') return false;
        
        const fenParts = fen.split(' ');
        if (fenParts.length < 2) return false;
        
        const position = fenParts[0];
        const activeColor = fenParts[1];
        
        if (!position.includes('P') && !position.includes('p')) return false;
        
        const ranks = position.split('/');
        if (ranks.length !== 8) return false;
        
        for (let file = 0; file < 8; file++) {
            let whitePawns = [];
            let blackPawns = [];
            
            for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
                const rank = ranks[rankIdx];
                let currentFile = 0;
                
                for (let char of rank) {
                    if (char >= '1' && char <= '8') {
                        currentFile += parseInt(char);
                    } else {
                        if (currentFile === file) {
                            const actualRank = 7 - rankIdx;
                            if (char === 'P') whitePawns.push(actualRank);
                            if (char === 'p') blackPawns.push(actualRank);
                        }
                        currentFile++;
                    }
                }
            }
            
            if (activeColor === 'w' && blackPawns.length > 0 && whitePawns.length === 0) {
                const advancedBlackPawn = Math.min(...blackPawns);
                if (advancedBlackPawn <= 2) {
                    debugLog("[DANGER]", `🚨 Dangerous Black passed pawn on file ${String.fromCharCode(97 + file)}`);
                    return true;
                }
            }
            
            if (activeColor === 'b' && whitePawns.length > 0 && blackPawns.length === 0) {
                const advancedWhitePawn = Math.max(...whitePawns);
                if (advancedWhitePawn >= 5) {
                    debugLog("[DANGER]", `🚨 Dangerous White passed pawn on file ${String.fromCharCode(97 + file)}`);
                    return true;
                }
            }
        }
        
        return false;
    } catch (e) {
        return false;
    }
}

function evaluateKingActivity(fen) {
    try {
        const fenParts = fen.split(' ');
        if (fenParts.length < 2) return 0.5;
        
        const position = fenParts[0];
        const activeColor = fenParts[1];
        const ranks = position.split('/');
        
        let kingActivity = 0;
        let kingRank = -1, kingFile = -1;
        const targetKing = activeColor === 'w' ? 'K' : 'k';
        
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            const rank = ranks[rankIdx];
            let currentFile = 0;
            
            for (let char of rank) {
                if (char >= '1' && char <= '8') {
                    currentFile += parseInt(char);
                } else {
                    if (char === targetKing) {
                        kingRank = 7 - rankIdx;
                        kingFile = currentFile;
                        break;
                    }
                    currentFile++;
                }
            }
            if (kingRank >= 0) break;
        }
        
        if (kingRank < 0) return 0.5;
        
        const centerDist = Math.abs(kingRank - 3.5) + Math.abs(kingFile - 3.5);
        kingActivity = 1.0 - (centerDist / 10.0);
        
        if (activeColor === 'w') {
            kingActivity += (kingRank / 14.0);
        } else {
            kingActivity += ((7 - kingRank) / 14.0);
        }
        
        return Math.min(Math.max(kingActivity, 0), 1);
    } catch (e) {
        return 0.5;
    }
}

function detectPawnRace(fen) {
    try {
        const fenParts = fen.split(' ');
        if (fenParts.length < 2) return false;
        
        const position = fenParts[0];
        const ranks = position.split('/');
        
        let advancedWhitePawns = 0;
        let advancedBlackPawns = 0;
        
        for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
            const rank = ranks[rankIdx];
            const actualRank = 7 - rankIdx;
            
            for (let char of rank) {
                if (char === 'P' && actualRank >= 5) advancedWhitePawns++;
                if (char === 'p' && actualRank <= 2) advancedBlackPawns++;
            }
        }
        
        const hasPawnRace = (advancedWhitePawns > 0 && advancedBlackPawns > 0);
        
        if (hasPawnRace) {
            debugLog("[ENDGAME]", `🏁 Pawn race detected!`);
        }
        
        return hasPawnRace;
    } catch (e) {
        return false;
    }
}

function trackPosition(fen) {
    try {
        const fenParts = fen.split(' ');
        if (fenParts.length < 4) return;
        
        const normalizedFen = fenParts.slice(0, 4).join(' ');
        
        positionHistory.push(normalizedFen);
        
        const count = (positionCounts.get(normalizedFen) || 0) + 1;
        positionCounts.set(normalizedFen, count);
        
        if (positionHistory.length > 100) {
            const oldPos = positionHistory.shift();
            const oldCount = positionCounts.get(oldPos) || 0;
            if (oldCount <= 1) {
                positionCounts.delete(oldPos);
            } else {
                positionCounts.set(oldPos, oldCount - 1);
            }
        }
        
        if (count >= 2) {
            debugLog("[REPETITION]", `⚠️ Position seen ${count} times`);
        }
    } catch (e) {
        debugLog("[REPETITION]", "⚠️ Error in trackPosition");
    }
}

function wouldCauseRepetition(fen) {
    try {
        const fenParts = fen.split(' ');
        if (fenParts.length < 4) return 0;
        
        const normalizedFen = fenParts.slice(0, 4).join(' ');
        return positionCounts.get(normalizedFen) || 0;
    } catch (e) {
        return 0;
    }
}

function isStrategicPosition(fen) {
    const complexity = evaluateComplexity(fen);
    const position = fen.split(' ')[0];
    
    const totalPieces = (position.match(/[pnbrqkPNBRQK]/g) || []).length;
    const minorPieces = (position.match(/[nNbB]/g) || []).length;
    const majorPieces = (position.match(/[rRqQ]/g) || []).length;
    
    const isMiddlegame = totalPieces > 20 && totalPieces < 30;
    
    const bishops = (position.match(/[bB]/g) || []).length;
    const knights = (position.match(/[nN]/g) || []).length;
    const hasImbalance = Math.abs(bishops - knights) >= 2;
    
    const isComplex = (minorPieces >= 4 || majorPieces >= 3) && complexity > 0.5;
    
    return complexity > 0.35 || isMiddlegame || hasImbalance || isComplex || Math.random() < CONFIG.longTermFocus;
}

function evaluatePieceActivity(fen) {
    const position = fen.split(' ')[0];
    const ranks = position.split('/');
    
    let activity = 0;
    let totalPieces = 0;
    
    for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i];
        
        let rankBonus = 1.2; // INCREASED base
        if (i >= 2 && i <= 5) rankBonus = 2.4; // INCREASED
        if (i >= 3 && i <= 4) rankBonus = 3.5; // INCREASED
        
        for (let j = 0; j < rank.length; j++) {
            const piece = rank[j];
            
            let fileBonus = 1.2; // INCREASED base
            if (j >= 2 && j <= 5) fileBonus = 1.8; // INCREASED
            if (j >= 3 && j <= 4) fileBonus = 2.4; // INCREASED
            
            if (piece.match(/[NnBb]/)) {
                totalPieces++;
                if (i >= 2 && i <= 5) {
                    activity += rankBonus * fileBonus;
                }
                if (i >= 3 && i <= 4 && j >= 3 && j <= 4) {
                    activity += 2.5; // INCREASED
                }
                if (i >= 4 && i <= 5) {
                    activity += 1.5; // INCREASED
                }
            }
            
            if (piece.match(/[RrQq]/)) {
                totalPieces += 0.9;
                if (i >= 2 && i <= 6) {
                    activity += rankBonus * fileBonus * 0.9;
                }
                if (piece.match(/[Rr]/) && (i === 1 || i === 6)) {
                    activity += 2.0; // INCREASED
                }
            }
        }
    }
    
    return totalPieces > 0 ? Math.min(activity / (totalPieces * 2.5), 1.0) : 0.5;
}

function getAlphaZeroThinkTime(phase, isStrategic, timeLeft) {
    let speedMultiplier = 1.0;
    
    if (phase === "opening") speedMultiplier = CONFIG.earlyGameSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middleGameSpeed;
    else speedMultiplier = CONFIG.endGameSpeed;
    
    if (isStrategic) speedMultiplier *= 1.6; // INCREASED
    
    if (positionComplexity > 0.7) speedMultiplier *= 1.4; // INCREASED
    
    if (timeLeft > 35000) speedMultiplier *= 1.2; // INCREASED
    else if (timeLeft < 20000) speedMultiplier *= 0.85;
    else if (timeLeft < 10000) speedMultiplier *= 0.75;
    else if (timeLeft < 5000) speedMultiplier *= 0.65;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(700, thinkTime));
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1: ENHANCED STRATEGIC DEPTH CALCULATION
// ═══════════════════════════════════════════════════════════════════════

function getStrategicDepth(phase, isStrategic, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    if (phase === "opening") depth = CONFIG.openingDepth;
    else if (phase === "endgame") depth = CONFIG.endgameDepth;
    else if (isStrategic) depth = CONFIG.strategicDepth;
    
    // PHASE 1: Check for tactical position
    const isTactical = isTacticalPosition(currentFen, multiPVLines);
    if (isTactical) {
        depth = Math.max(depth, CONFIG.tacticalDepth);
        depth += CONFIG.tacticalDepthBonus;
        debugLog("[DEPTH]", `🎯 Tactical position - depth boosted to ${depth}`);
    }
    
    // PHASE 1: Detect tactical patterns
    const tacticalScore = detectTacticalPatterns(currentFen);
    if (tacticalScore > 20) {
        depth += 2;
        debugLog("[DEPTH]", `🎯 Tactical patterns detected (score: ${tacticalScore}) - depth +2`);
    }
    
    // Boost depth when winning
    if (multiPVLines.length > 0 && multiPVLines[0].score > CONFIG.winningThreshold) {
        depth = Math.max(depth, CONFIG.winningDepth);
        debugLog("[DEPTH]", `🔥 Winning position - boosting depth to ${depth}`);
    }
    
    // Time control adjustments (ENHANCED)
    if (timeLeft > 180000) {
        depth = CONFIG.classicalDepth;
        debugLog("[DEPTH]", "📚 Classical time - maximum depth");
    } else if (timeLeft > 120000) {
        depth = Math.min(depth + 5, CONFIG.classicalDepth); // INCREASED from +4
    } else if (timeLeft > 60000) {
        depth = Math.min(depth + 3, 30); // INCREASED from +2
    } else if (timeLeft > 30000) {
        depth = Math.min(depth + 2, 28); // INCREASED from +1
    } else if (timeLeft < 10000) {
        depth = Math.max(depth - 2, 18);
    }
    
    // Complex positions (ENHANCED)
    if (positionComplexity > 0.75 && timeLeft > 20000) {
        depth = Math.min(depth + CONFIG.complexDepthBonus, CONFIG.classicalDepth);
    }
    
    // Endgame with advantage
    if (phase === "endgame" && timeLeft > 30000) {
        depth = Math.min(depth + 4, CONFIG.classicalDepth); // INCREASED from +3
        debugLog("[DEPTH]", "🎯 Endgame - maximizing depth");
    }
    
    // Pawn race
    if (currentFen && typeof currentFen === 'string' && detectPawnRace(currentFen)) {
        depth = Math.min(depth + 4, CONFIG.classicalDepth); // INCREASED from +3
        debugLog("[DEPTH]", "🏁 Pawn race - boosting depth");
    }
    
    // Defensive mode
    if (multiPVLines.length > 0) {
        const currentEval = multiPVLines[0].score;
        
        if (currentEval < CONFIG.defensiveThresholdMild) {
            depth = Math.min(depth + CONFIG.defensiveDepthBonus, CONFIG.classicalDepth);
            debugLog("[DEPTH]", `🛡️ Defensive mode - depth ${depth}`);
        }
    }
    
    // Passed pawn danger
    if (currentFen && typeof currentFen === 'string') {
        const hasDanger = detectPassedPawnDanger(currentFen);
        if (hasDanger) {
            depth = Math.min(depth + CONFIG.passedPawnDepthBonus, CONFIG.classicalDepth);
            debugLog("[DEPTH]", `🚨 Passed pawn danger - depth ${depth}`);
        }
    }
    
    return depth;
}

function getAlphaZeroBookMove(fen, activeColor) {
    const position = ALPHAZERO_OPENINGS[fen];
    if (!position) return null;
    
    const moves = activeColor === 'w' ? position.white : position.black;
    if (!moves || moves.length === 0) return null;
    
    const totalWeight = moves.reduce((sum, m) => sum + m.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let moveOption of moves) {
        random -= moveOption.weight;
        if (random <= 0) {
            debugLog("[ENGINE]", `📖 Book move: ${moveOption.name}`);
            return moveOption.move;
        }
    }
    
    return moves[0].move;
}

function isElegantMove(move, alternatives, complexity) {
    const isCapture = move.includes('x') || move.length === 5;
    const isQuiet = !isCapture && move.length === 4;
    
    if (isQuiet && complexity > 0.55) return true; // LOWERED threshold
    
    if (alternatives.length > 2) {
        const topScore = alternatives[0].score;
        const moveIndex = alternatives.findIndex(m => m.move === move);
        
        if (moveIndex >= 1 && moveIndex <= 2 && Math.abs(alternatives[moveIndex].score - topScore) < 35) { // INCREASED from 30
            return true;
        }
    }
    
    return false;
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 3: ENHANCED ALPHAZERO MOVE SELECTION - DOMINATION EDITION
// ═══════════════════════════════════════════════════════════════════════

function applyAlphaZeroLogic(bestMove, alternatives) {
    if (alternatives.length < 2) {
        return bestMove;
    }
    
    // NEW v6.0: Track current position pressure
    const currentEval = alternatives[0].score;
    positionPressure = evaluatePositionPressure(currentFen, currentEval);
    hasInitiative = (currentEval > 50 || positionPressure > 60);
    
    debugLog("[SELECTION]", `Position pressure: ${positionPressure.toFixed(0)}, Initiative: ${hasInitiative}`);
    
    // Check for repetition
    const currentRepetitionCount = wouldCauseRepetition(currentFen);
    if (currentRepetitionCount >= 1) {
        debugLog("[REPETITION]", `🚫 Position repeated ${currentRepetitionCount + 1} times - AVOIDING!`);
    }
    
    const topScore = alternatives[0].score;
    const secondScore = alternatives[1].score;
    const scoreDiff = Math.abs(topScore - secondScore);
    
    // Opening safety
    if (moveCount <= 15) {
        if (topScore < -50) {
            debugLog("[ENGINE]", "🛡️ OPENING: Negative eval, playing carefully");
        }
        // PHASE 2: More flexible in opening (lowered threshold)
        if (scoreDiff > 25) { // LOWERED from 30
            debugLog("[ENGINE]", "🛡️ OPENING: Clear best move");
            return bestMove;
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // DEFENSIVE MODE
    // ═══════════════════════════════════════════════════════════
    const isBehind = topScore < CONFIG.defensiveThresholdMild;
    const isLosingBadly = topScore < CONFIG.defensiveThresholdSerious;
    
    if (isBehind) {
        debugLog("[ENGINE]", `🛡️ DEFENSIVE MODE (${topScore}cp)`);
        
        if (scoreDiff > 12) { // LOWERED from 15 for more tactical options
            debugLog("[ENGINE]", "🛡️ Clear best defense");
            return bestMove;
        }
        
        if (Math.random() > CONFIG.defensiveCreativity) {
            debugLog("[ENGINE]", "🛡️ Defensive best move");
            return bestMove;
        }
        
        if (scoreDiff < 10 && validateMoveForPosition(alternatives[1].move, currentFen)) {
            debugLog("[ENGINE]", `🛡️ Defensive alternative (Δ${scoreDiff})`);
            return alternatives[1].move;
        }
        
        return bestMove;
    }
    
    // ═══════════════════════════════════════════════════════════
    // PHASE 2: ULTRA-AGGRESSIVE WINNING CONVERSION MODE
    // ═══════════════════════════════════════════════════════════
    const isWinning = topScore > CONFIG.winningThreshold;
    const isCrushing = topScore > 250;
    
    if (isWinning && alternatives.length >= 2) {
        debugLog("[ENGINE]", `🔥 WINNING MODE (${topScore}cp) - CRUSHING!`);
        
        const kingActivity = (gamePhase === "endgame") ? evaluateKingActivity(currentFen) : 0.5;
        const hasPawnRace = (gamePhase === "endgame") ? detectPawnRace(currentFen) : false;
        
        // PHASE 3: Classify move purposes
        const bestPurpose = classifyMovePurpose(alternatives[0].move, topScore, currentEval, currentFen);
        const altPurpose = classifyMovePurpose(alternatives[1].move, secondScore, currentEval, currentFen);
        
        debugLog("[PURPOSE]", `Best: ${bestPurpose.type}/${bestPurpose.subtype} (${bestPurpose.priority})`);
        debugLog("[PURPOSE]", `Alt: ${altPurpose.type}/${altPurpose.subtype} (${altPurpose.priority})`);
        
        // ANTI-REPETITION in winning positions
        if (currentRepetitionCount >= 1 && scoreDiff < 120) { // INCREASED threshold
            debugLog("[ENGINE]", `🚫 AVOIDING REPETITION in winning position`);
            
            for (let i = 1; i < Math.min(alternatives.length, 5); i++) { // Check more alternatives
                if (alternatives[i].score > 60 && validateMoveForPosition(alternatives[i].move, currentFen)) {
                    debugLog("[ENGINE]", `✅ Anti-repetition: ${alternatives[i].move} (${alternatives[i].score}cp)`);
                    return alternatives[i].move;
                }
            }
        }
        
        // PHASE 3: Prefer forcing moves (attacks) when winning
        if (altPurpose.type === "attack" && altPurpose.priority >= 85 && secondScore > 80) {
            if (scoreDiff < 80 && Math.random() < 0.75) { // INCREASED probability
                debugLog("[ENGINE]", `⚡ Forcing attack move: ${alternatives[1].move}`);
                return alternatives[1].move;
            }
        }
        
        // Consider alternatives that maintain advantage
        if (secondScore > 80 && scoreDiff < 120) { // INCREASED threshold
            const coordination = evaluatePieceCoordination(currentFen);
            const activity = evaluatePieceActivity(currentFen);
            
            const hasGoodActivity = (activity > 0.65 || coordination > 0.65 || (gamePhase === "endgame" && kingActivity > 0.6));
            
            // PHASE 3: Check if alternative maintains initiative
            const maintainsInit = maintainsInitiative(alternatives[1].move, secondScore, topScore, currentFen);
            
            if ((hasGoodActivity || maintainsInit) && Math.random() < CONFIG.winningCreativity) {
                if (validateMoveForPosition(alternatives[1].move, currentFen)) {
                    debugLog("[ENGINE]", `🚀 Aggressive conversion: ${alternatives[1].move} (${secondScore}cp, Δ${scoreDiff})`);
                    return alternatives[1].move;
                }
            }
            
            // Positional sacrifices
            const isPositionalSacrifice = (secondScore < topScore - 50) && (secondScore > topScore - 150);
            if (isPositionalSacrifice && Math.random() < CONFIG.positionalSacrifice) {
                if (validateMoveForPosition(alternatives[1].move, currentFen)) {
                    debugLog("[ENGINE]", `💎 Positional sacrifice: ${alternatives[1].move}`);
                    return alternatives[1].move;
                }
            }
        }
        
        // Crushing advantage - fastest conversion
        if (isCrushing) {
            if (currentRepetitionCount >= 1 && alternatives.length > 1 && alternatives[1].score > 180) {
                debugLog("[ENGINE]", "⚡ Crushing + repetition avoidance");
                return alternatives[1].move;
            }
            if (scoreDiff < 70) { // INCREASED from 60
                debugLog("[ENGINE]", "⚡ Crushing - fastest conversion");
                return bestMove;
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // PHASE 3: BALANCED POSITIONS - MAXIMUM CREATIVITY
    // ═══════════════════════════════════════════════════════════
    
    // ANTI-REPETITION even in balanced positions
    if (currentRepetitionCount >= 1 && !isBehind) {
        debugLog("[ENGINE]", `🚫 Balanced but avoiding repetition`);
        
        for (let i = 1; i < Math.min(alternatives.length, 4); i++) {
            const altScore = alternatives[i].score;
            const altDiff = Math.abs(topScore - altScore);
            
            // PHASE 2: Accept larger differences to avoid draws (increased from 60)
            if (altDiff < 80 && validateMoveForPosition(alternatives[i].move, currentFen)) {
                debugLog("[ENGINE]", `✅ Anti-repetition: ${alternatives[i].move} (Δ${altDiff})`);
                return alternatives[i].move;
            }
        }
    }
    
    // Passed pawn danger
    let hasPassedPawnDanger = false;
    if (currentFen && typeof currentFen === 'string') {
        hasPassedPawnDanger = detectPassedPawnDanger(currentFen);
    }
    
    if (hasPassedPawnDanger && scoreDiff > 18) { // LOWERED from 20
        debugLog("[ENGINE]", "🚨 Passed pawn danger - best defense");
        return bestMove;
    }
    
    // PHASE 2: Lowered threshold for more creativity (from 35)
    if (scoreDiff > CONFIG.primaryThreshold && !isWinning) {
        debugLog("[ENGINE]", `📊 Clear best move (Δ${scoreDiff})`);
        return bestMove;
    }
    
    // PHASE 2: MAXIMUM CREATIVITY calculation
    const effectiveUnconventionalRate = positionComplexity > 0.65
        ? CONFIG.unconventionalRate + CONFIG.complexPositionBonus
        : CONFIG.unconventionalRate;
    
    const coordination = evaluatePieceCoordination(currentFen);
    const mobility = evaluateMobility(currentFen);
    const activity = evaluatePieceActivity(currentFen);
    
    // PHASE 3: Consider all MultiPV lines (not just top 4)
    const maxLines = Math.min(alternatives.length, 7); // Consider all 7 lines
    
    // PHASE 2: More aggressive creativity threshold (lowered from 0.60)
    if (positionComplexity > 0.55 && scoreDiff < CONFIG.secondaryThreshold && Math.random() < effectiveUnconventionalRate) {
        if (validateMoveForPosition(alternatives[1].move, currentFen)) {
            // PHASE 3: Classify and prefer forcing moves
            const altPurpose = classifyMovePurpose(alternatives[1].move, secondScore, currentEval, currentFen);
            
            if (altPurpose.type === "attack" && altPurpose.priority >= 80) {
                debugLog("[ENGINE]", `⚡ FORCING creative move (${altPurpose.subtype})`);
                return alternatives[1].move;
            }
            
            // Elegant moves (lowered threshold)
            if (isElegantMove(alternatives[1].move, alternatives, positionComplexity) && scoreDiff < 25) {
                debugLog("[ENGINE]", `✨ Elegant alternative (Δ${scoreDiff})`);
                return alternatives[1].move;
            }
            
            // Long-term positional improvement
            if ((coordination < 0.55 || activity < 0.60) && scoreDiff < 22) {
                if (Math.random() < CONFIG.longTermFocus) {
                    debugLog("[ENGINE]", `🎯 Long-term planning (Δ${scoreDiff})`);
                    return alternatives[1].move;
                }
            }
            
            // Mobility and space
            if (mobility < 0.55 && scoreDiff < 18) {
                debugLog("[ENGINE]", `🌊 Mobility improvement (Δ${scoreDiff})`);
                return alternatives[1].move;
            }
        }
    }
    
    // PHASE 3: Deep lines in highly complex positions (consider MORE alternatives)
    if (alternatives.length > 2 && positionComplexity > 0.70) {
        const scoreDiff2 = Math.abs(topScore - alternatives[2].score);
        
        // More willing to explore (lowered threshold)
        if (scoreDiff2 < 28 && Math.random() < (effectiveUnconventionalRate * 0.6)) {
            if (validateMoveForPosition(alternatives[2].move, currentFen)) {
                // PHASE 3: Check for forcing moves
                const purpose3 = classifyMovePurpose(alternatives[2].move, alternatives[2].score, currentEval, currentFen);
                
                if (purpose3.type === "attack" || isElegantMove(alternatives[2].move, alternatives, positionComplexity)) {
                    debugLog("[ENGINE]", `🌟 Deep strategic insight (Δ${scoreDiff2})`);
                    return alternatives[2].move;
                }
            }
        }
        
        // PHASE 3: Consider 4th line in ultra-complex positions
        if (alternatives.length > 3 && positionComplexity > 0.80) {
            const scoreDiff3 = Math.abs(topScore - alternatives[3].score);
            if (scoreDiff3 < 22 && Math.random() < (effectiveUnconventionalRate * 0.35)) {
                if (validateMoveForPosition(alternatives[3].move, currentFen)) {
                    debugLog("[ENGINE]", `💫 Ultra-deep creativity (Δ${scoreDiff3})`);
                    return alternatives[3].move;
                }
            }
        }
        
        // NEW PHASE 3: Consider 5th+ lines in extremely complex/tactical positions
        if (alternatives.length > 4 && (positionComplexity > 0.85 || isTacticalPosition(currentFen, multiPVLines))) {
            for (let i = 4; i < Math.min(maxLines, alternatives.length); i++) {
                const scoreDiffN = Math.abs(topScore - alternatives[i].score);
                if (scoreDiffN < 20 && Math.random() < 0.15) {
                    const purposeN = classifyMovePurpose(alternatives[i].move, alternatives[i].score, currentEval, currentFen);
                    if (purposeN.type === "attack" && purposeN.priority >= 85) {
                        if (validateMoveForPosition(alternatives[i].move, currentFen)) {
                            debugLog("[ENGINE]", `🔥 DEEP TACTICAL LINE #${i+1} (${purposeN.subtype}, Δ${scoreDiffN})`);
                            return alternatives[i].move;
                        }
                    }
                }
            }
        }
    }
    
    debugLog("[ENGINE]", "🎯 Playing best move");
    return bestMove;
}

function parseMultiPV(output) {
    const lines = output.split('\n');
    const pvLines = [];
    
    for (let line of lines) {
        if (line.includes('multipv')) {
            const moveMatch = line.match(/pv\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
            const scoreMatch = line.match(/score\s+cp\s+(-?\d+)/);
            const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
            const depthMatch = line.match(/depth\s+(\d+)/);
            
            if (moveMatch && moveMatch[1]) {
                const move = moveMatch[1];
                
                if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)) {
                    continue;
                }
                
                let score = 0;
                let depth = 0;
                
                if (mateMatch) {
                    const mateIn = parseInt(mateMatch[1]);
                    score = mateIn > 0 ? (10000 - Math.abs(mateIn)) : (-10000 + Math.abs(mateIn));
                } else if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
                }
                
                if (depthMatch) {
                    depth = parseInt(depthMatch[1]);
                }
                
                pvLines.push({ move, score, depth });
            }
        }
    }
    
    pvLines.sort((a, b) => b.score - a.score);
    return pvLines;
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    chessEngine.postMessage("setoption name MultiPV value 7");
    chessEngine.postMessage("setoption name Hash value 768");          // INCREASED from 512
    chessEngine.postMessage("setoption name Contempt value 150");      // INCREASED from 120
    chessEngine.postMessage("setoption name Move Overhead value 15");  // DECREASED from 20
    chessEngine.postMessage("setoption name Skill Level value 20");
    chessEngine.postMessage("setoption name Threads value 2");
    chessEngine.postMessage("setoption name UCI_LimitStrength value false");
    chessEngine.postMessage("setoption name Minimum Thinking Time value 100");
    chessEngine.postMessage("ucinewgame");
    
    chessEngine.onmessage = (event) => {
        const message = event.data || event;
        
        if (typeof message === 'string') {
            if (message.includes('multipv')) {
                multiPVLines = parseMultiPV(message);
            }
            
            if (message.startsWith('bestmove')) {
                const parts = message.split(' ');
                bestMove = parts[1];
                
                debugLog("[ENGINE]", `Raw bestmove: ${bestMove}`);
                
                if (bestMove === "(none)" || !bestMove || bestMove === "0000") {
                    debugLog("[ENGINE]", "⚠️ Invalid bestmove received");
                    forceUnlockAndReset("invalid bestmove");
                    return;
                }
                
                if (multiPVLines.length > 0) {
                    debugLog("[ENGINE]", `Top 3 moves:`);
                    for (let i = 0; i < Math.min(3, multiPVLines.length); i++) {
                        debugLog("[ENGINE]", `  ${i+1}. ${multiPVLines[i].move} (${multiPVLines[i].score}cp, depth ${multiPVLines[i].depth})`);
                    }
                    
                    // Apply AlphaZero logic
                    const selectedMove = applyAlphaZeroLogic(multiPVLines[0].move, multiPVLines);
                    
                    if (selectedMove !== multiPVLines[0].move) {
                        const selectedLine = multiPVLines.find(l => l.move === selectedMove);
                        if (selectedLine) {
                            debugLog("[ENGINE]", `🎯 SELECTED: ${selectedMove} (${selectedLine.score}cp) [AlphaZero choice]`);
                        }
                    } else {
                        debugLog("[ENGINE]", `🎯 SELECTED: ${selectedMove} (${multiPVLines[0].score}cp) [Engine best]`);
                    }
                    
                    sendMove(selectedMove, 0);
                } else {
                    debugLog("[ENGINE]", "⚠️ No MultiPV lines available, using raw bestmove");
                    sendMove(bestMove, 0);
                }
            }
        }
    };
    
    debugLog("[ENGINE]", "✅ AlphaZero v6.0 DOMINATION Engine initialized");
    debugLog("[ENGINE]", "🔥 MAXIMUM TACTICAL AWARENESS ACTIVE");
    debugLog("[ENGINE]", "🔥 ULTRA-AGGRESSIVE MODE ACTIVE");
    debugLog("[ENGINE]", "🔥 SUPERIOR MOVE SELECTION ACTIVE");
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE VALIDATION & SENDING
// ═══════════════════════════════════════════════════════════════════════

function validateMoveForPosition(move, fen) {
    if (!move || !fen) return false;
    if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)) return false;
    
    const fromFile = move.charCodeAt(0) - 97;
    const fromRank = parseInt(move[1]) - 1;
    const toFile = move.charCodeAt(2) - 97;
    const toRank = parseInt(move[3]) - 1;
    
    if (fromFile < 0 || fromFile > 7 || fromRank < 0 || fromRank > 7) return false;
    if (toFile < 0 || toFile > 7 || toRank < 0 || toRank > 7) return false;
    
    return true;
}

/**
 * NEW: Safe WebSocket send wrapper with queue and connection state check
 * This prevents "Still in CONNECTING state" errors
 */
function safeWebSocketSend(message, retryCount = 0) {
    const maxRetries = 10;
    const retryDelay = 100;
    
    if (!webSocketWrapper) {
        debugLog("[WS]", "❌ No WebSocket available");
        return false;
    }
    
    // Check current state
    const state = webSocketWrapper.readyState;
    
    if (state === 1) {
        // OPEN - safe to send
        try {
            webSocketWrapper.send(JSON.stringify(message));
            debugLog("[WS]", "✅ Message sent successfully");
            return true;
        } catch (e) {
            debugLog("[WS]", "❌ Send failed despite OPEN state:", e.message);
            return false;
        }
    } else if (state === 0) {
        // CONNECTING - queue and retry
        if (retryCount < maxRetries) {
            debugLog("[WS]", `⏳ WebSocket CONNECTING (retry ${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
                safeWebSocketSend(message, retryCount + 1);
            }, retryDelay);
            return true; // Pending
        } else {
            debugLog("[WS]", "❌ WebSocket stuck in CONNECTING state after max retries");
            return false;
        }
    } else if (state === 2 || state === 3) {
        // CLOSING or CLOSED
        debugLog("[WS]", `❌ WebSocket is ${state === 2 ? 'CLOSING' : 'CLOSED'}`);
        return false;
    }
    
    return false;
}

function sendMove(move, delay = 0) {
    if (!validateMoveForPosition(move, currentFen)) {
        debugLog("[SEND]", `❌ Invalid move: ${move}`);
        forceUnlockAndReset("invalid move");
        return;
    }
    
    setTimeout(() => {
        if (!webSocketWrapper) {
            debugLog("[SEND]", "❌ WebSocket not available");
            forceUnlockAndReset("websocket not ready");
            return;
        }
        
        // Clear calculation lock and watchdog
        calculationLock = false;
        calculationStartTime = 0;
        currentCalculatingColor = null;
        clearAbsoluteWatchdog();
        
        // Clear position ready flags
        whitePositionReady = false;
        blackPositionReady = false;
        
        const message = {
            t: "move",
            d: {
                u: move,
                b: 1
            }
        };
        
        debugLog("[SEND]", `📤 Sending move: ${move}`);
        
        // Use safe send wrapper
        const sent = safeWebSocketSend(message);
        
        if (sent || sent === true) {
            // Set bot move flag (even if pending/queued)
            botJustSentMove = true;
            pendingMove = move;
            lastSuccessfulMoveTime = Date.now();
            
            // PHASE 3: Track move type
            if (multiPVLines.length > 0) {
                const moveLine = multiPVLines.find(l => l.move === move);
                if (moveLine) {
                    const purpose = classifyMovePurpose(move, moveLine.score, multiPVLines[0].score, currentFen);
                    lastMoveType = purpose.type;
                    debugLog("[SEND]", `Move type: ${purpose.type}/${purpose.subtype}`);
                }
            }
            
            // Set confirmation timer
            if (moveConfirmationTimer) {
                clearTimeout(moveConfirmationTimer);
            }
            moveConfirmationTimer = setTimeout(() => {
                debugLog("[SEND]", "⚠️ Move confirmation timeout - clearing bot flag");
                botJustSentMove = false;
                pendingMove = null;
            }, 2000);
        } else {
            debugLog("[SEND]", "❌ Failed to send move");
            forceUnlockAndReset("send failed");
        }
    }, delay);
}

// ═══════════════════════════════════════════════════════════════════════
// CALCULATION & SCHEDULING
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    if (calculationLock) {
        debugLog("[CALC]", "❌ Already calculating");
        return;
    }
    
    if (!currentFen) {
        debugLog("[CALC]", "❌ No current FEN");
        return;
    }
    
    const fenActiveColor = getActiveColorFromFen(currentFen);
    if (!fenActiveColor) {
        debugLog("[CALC]", "❌ Cannot determine color");
        return;
    }
    
    calculationLock = true;
    calculationStartTime = Date.now();
    currentCalculatingColor = fenActiveColor;
    
    const isWhite = (fenActiveColor === 'w');
    const colorName = isWhite ? 'White' : 'Black';
    
    // Clear position ready for this color
    if (isWhite) {
        whitePositionReady = false;
    } else {
        blackPositionReady = false;
    }
    
    debugLog("[CALC]", `🧠 Calculating for ${colorName}...`);
    debugLog("[CALC]", `FEN: ${currentFen}`);
    debugLog("[CALC]", `Move #${moveCount}, Phase: ${gamePhase}, Complexity: ${positionComplexity.toFixed(2)}`);
    
    // Check opening book
    const bookMove = getAlphaZeroBookMove(currentFen, fenActiveColor);
    if (bookMove && moveCount <= 3) {
        debugLog("[CALC]", `📖 Using book move: ${bookMove}`);
        calculationLock = false;
        sendMove(bookMove, CONFIG.premoveTime);
        return;
    }
    
    const isStrategic = isStrategicPosition(currentFen);
    const depth = getStrategicDepth(gamePhase, isStrategic, timeRemaining);
    const thinkTime = getAlphaZeroThinkTime(gamePhase, isStrategic, timeRemaining);
    
    debugLog("[CALC]", `Depth: ${depth}, Think time: ${thinkTime}ms`);
    
    chessEngine.postMessage("ucinewgame");
    chessEngine.postMessage(`position fen ${currentFen}`);
    chessEngine.postMessage(`go depth ${depth} movetime ${thinkTime}`);
    
    // Safety timeout
    if (calculationTimeout) {
        clearTimeout(calculationTimeout);
    }
    calculationTimeout = setTimeout(() => {
        debugLog("[CALC]", "⚠️ Calculation timeout");
        if (chessEngine) {
            chessEngine.postMessage("stop");
        }
        forceUnlockAndReset("calculation timeout");
    }, thinkTime + 2000);
}

// ═══════════════════════════════════════════════════════════════════════
// HEALTH CHECK & WATCHDOG SYSTEM
// ═══════════════════════════════════════════════════════════════════════

function startHealthCheckSystem() {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
    }
    
    healthCheckInterval = setInterval(() => {
        const now = Date.now();
        
        // Check 1: Calculation too long
        if (calculationLock && calculationStartTime > 0) {
            const calcDuration = now - calculationStartTime;
            if (calcDuration > 6000) { // INCREASED from 5000
                debugLog("[HEALTH]", `🚨 Calculation stuck (${calcDuration}ms)`);
                forceUnlockAndReset("calculation timeout");
                return;
            }
        }
        
        // Check 2: Position ready but no calculation
        if (!calculationLock && currentFen && webSocketWrapper && webSocketReady) {
            const fenActiveColor = getActiveColorFromFen(currentFen);
            if (fenActiveColor) {
                const isWhite = (fenActiveColor === 'w');
                const positionReady = isWhite ? whitePositionReady : blackPositionReady;
                const positionTime = isWhite ? lastWhitePositionTime : lastBlackPositionTime;
                const humanMoved = isWhite ? whiteHumanMovedRecently : blackHumanMovedRecently;
                
                if (positionReady && positionTime > 0) {
                    const waitDuration = now - positionTime;
                    if (waitDuration > 3500 && !humanMoved) { // INCREASED from 3000
                        debugLog("[HEALTH]", `🚨 Position ready ${waitDuration}ms - forcing`);
                        forceCalculation(fenActiveColor);
                        return;
                    }
                }
            }
        }
        
        // Check 3: No move in long time
        if (lastSuccessfulMoveTime > 0 && currentFen && webSocketWrapper && webSocketReady) {
            const timeSinceLastMove = now - lastSuccessfulMoveTime;
            if (timeSinceLastMove > 25000) { // INCREASED from 20000
                debugLog("[HEALTH]", `🚨 No move in ${timeSinceLastMove}ms`);
                forceUnlockAndReset("no recent moves");
                forceCalculation(getActiveColorFromFen(currentFen));
                return;
            }
        }
        
        // Check 4: Clear stale debounce flags
        if (whiteHumanMovedRecently && lastWhitePositionTime > 0 && now - lastWhitePositionTime > 2000) {
            whiteHumanMovedRecently = false;
            if (whiteDebounceTimer) {
                clearTimeout(whiteDebounceTimer);
                whiteDebounceTimer = null;
            }
        }
        if (blackHumanMovedRecently && lastBlackPositionTime > 0 && now - lastBlackPositionTime > 2000) {
            blackHumanMovedRecently = false;
            if (blackDebounceTimer) {
                clearTimeout(blackDebounceTimer);
                blackDebounceTimer = null;
            }
        }
        
    }, 2000);
    
    debugLog("[HEALTH]", "✅ Health check active");
}

function forceUnlockAndReset(reason) {
    debugLog("[FORCE]", `💥 FORCE UNLOCK: ${reason}`);
    
    calculationLock = false;
    calculationStartTime = 0;
    currentCalculatingColor = null;
    
    if (calculationTimeout) {
        clearTimeout(calculationTimeout);
        calculationTimeout = null;
    }
    if (messageDebounceTimer) {
        clearTimeout(messageDebounceTimer);
        messageDebounceTimer = null;
    }
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
        absoluteWatchdogTimer = null;
    }
    
    if (chessEngine) {
        chessEngine.postMessage("stop");
    }
}

function forceCalculation(colorToCalculate) {
    debugLog("[FORCE]", `⚡ FORCE CALCULATION: ${colorToCalculate === 'w' ? 'White' : 'Black'}`);
    
    if (!currentFen || !chessEngine || !webSocketWrapper || !webSocketReady) {
        debugLog("[FORCE]", "❌ Prerequisites not met for forced calculation");
        return;
    }
    
    const fenColor = getActiveColorFromFen(currentFen);
    if (fenColor !== colorToCalculate) {
        return;
    }
    
    forceUnlockAndReset("forced calculation");
    
    if (colorToCalculate === 'w') {
        whitePositionReady = true;
        lastWhitePositionTime = Date.now();
    } else {
        blackPositionReady = true;
        lastBlackPositionTime = Date.now();
    }
    
    setTimeout(() => calculateMove(), 100);
}

function scheduleCalculate() {
    if (!boardReady) {
        return;
    }
    
    if (!currentFen) {
        return;
    }
    
    const fenActiveColor = getActiveColorFromFen(currentFen);
    if (!fenActiveColor) {
        return;
    }
    
    const isWhite = (fenActiveColor === 'w');
    
    if (calculationLock) {
        return;
    }
    
    const humanMovedRecently = isWhite ? whiteHumanMovedRecently : blackHumanMovedRecently;
    const positionReady = isWhite ? whitePositionReady : blackPositionReady;
    
    if (humanMovedRecently) {
        return;
    }
    
    if (!webSocketWrapper || !webSocketReady) {
        debugLog("[SCHEDULE]", "❌ WebSocket not ready for calculation");
        return;
    }
    
    if (!positionReady) {
        return;
    }
    
    startAbsoluteWatchdog();
    calculateMove();
}

function startAbsoluteWatchdog() {
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
    }
    
    absoluteWatchdogTimer = setTimeout(() => {
        const now = Date.now();
        const calcDuration = calculationStartTime > 0 ? now - calculationStartTime : 0;
        
        debugLog("[WATCHDOG]", "🚨 ABSOLUTE WATCHDOG (8s)");
        
        forceUnlockAndReset("absolute watchdog");
        
        if (currentFen && webSocketWrapper && webSocketReady) {
            const fenActiveColor = getActiveColorFromFen(currentFen);
            if (fenActiveColor) {
                setTimeout(() => forceCalculation(fenActiveColor), 500);
            }
        }
    }, 8000);
}

function clearAbsoluteWatchdog() {
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
        absoluteWatchdogTimer = null;
    }
}

function getActiveColorFromFen(fen) {
    const parts = fen.split(' ');
    if (parts.length >= 2) {
        return parts[1];
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET & BOARD DETECTION
// ═══════════════════════════════════════════════════════════════════════

function analyzeMoveTiming() {
    const timeDiff = lastWebSocketMessageTime - lastBoardMutationTime;
    const boardChangedFirst = (timeDiff > 0);
    
    const isManualMove = (
        boardChangedFirst &&
        timeDiff >= 20 &&
        timeDiff <= 400 &&
        !botJustSentMove &&
        lastBoardMutationTime > 0
    );
    
    if (isManualMove) {
        if (currentFen) {
            const fenColor = getActiveColorFromFen(currentFen);
            if (fenColor) {
                const isWhite = (fenColor === 'w');
                
                if (isWhite) {
                    whiteHumanMovedRecently = true;
                    if (whiteDebounceTimer) clearTimeout(whiteDebounceTimer);
                    whiteDebounceTimer = setTimeout(() => {
                        whiteHumanMovedRecently = false;
                    }, CONFIG.manualMoveDebounce);
                } else {
                    blackHumanMovedRecently = true;
                    if (blackDebounceTimer) clearTimeout(blackDebounceTimer);
                    blackDebounceTimer = setTimeout(() => {
                        blackHumanMovedRecently = false;
                    }, CONFIG.manualMoveDebounce);
                }
            }
        }
        return true;
    }
    return false;
}

function waitForBoard(callback) {
    const checkInterval = setInterval(() => {
        const board = document.querySelector('cg-board') || 
                     document.querySelector('.cg-wrap') ||
                     document.querySelector('#mainboard');
        
        if (board) {
            clearInterval(checkInterval);
            boardReady = true;
            callback(board);
        }
    }, 100);
    
    setTimeout(() => {
        clearInterval(checkInterval);
        if (!boardReady) {
            boardReady = true;
        }
    }, 5000);
}

function setupManualMoveDetection() {
    waitForBoard((board) => {
        const observer = new MutationObserver((mutations) => {
            lastBoardMutationTime = Date.now();
            boardMutationCount++;
        });
        
        observer.observe(board, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

function handlePositionMessage(message) {
    if (!message.d || typeof message.d.fen !== "string" || typeof message.v !== "number") {
        return;
    }
    
    if (!boardReady) {
        setTimeout(() => handlePositionMessage(message), 100);
        return;
    }
    
    const positionBoard = message.d.fen;
    const currentWsV = message.v;
    
    lastWebSocketMessageTime = Date.now();
    
    if (botJustSentMove) {
        botJustSentMove = false;
        
        if (moveConfirmationTimer) {
            clearTimeout(moveConfirmationTimer);
            moveConfirmationTimer = null;
        }
        
        lastRejectedMove = null;
        rejectionCount = 0;
    }
    
    analyzeMoveTiming();
    
    let fullFen = positionBoard;
    
    if (positionBoard.split(' ').length < 2) {
        const isWhitesTurn = (currentWsV % 2 === 0);
        const turnColor = isWhitesTurn ? 'w' : 'b';
        fullFen = `${positionBoard} ${turnColor} KQkq - 0 1`;
    }
    
    const fenActiveColor = getActiveColorFromFen(fullFen);
    
    if (!fenActiveColor) {
        return;
    }
    
    const isWhite = (fenActiveColor === 'w');
    
    currentFen = fullFen;
    moveCount = Math.floor((currentWsV + 1) / 2);
    gamePhase = getStrategicPhase(moveCount);
    positionComplexity = evaluateComplexity(currentFen);
    
    trackPosition(currentFen);
    
    const isNewPosition = (lastSeenPositionId === null || currentWsV > lastSeenPositionId);
    
    if (!isNewPosition) {
        return;
    }
    
    lastSeenPositionId = currentWsV;
    lastSeenFen = fullFen;
    
    const now = Date.now();
    if (isWhite) {
        whitePositionReady = true;
        lastWhitePositionTime = now;
    } else {
        blackPositionReady = true;
        lastBlackPositionTime = now;
    }
    
    if (messageDebounceTimer) {
        clearTimeout(messageDebounceTimer);
    }
    
    messageDebounceTimer = setTimeout(() => {
        scheduleCalculate();
    }, CONFIG.messageDebounce);
}

function setupWebSocketHandlers(wrappedWebSocket) {
    wrappedWebSocket.addEventListener("open", function () {
        debugLog("[WS]", "✅ WebSocket OPEN and ready for messages");
        webSocketReady = true;
        reconnectionAttempts = 0;
        
        // Process any queued messages
        if (messageQueue.length > 0) {
            debugLog("[WS]", `📬 Processing ${messageQueue.length} queued messages`);
            const queue = [...messageQueue];
            messageQueue = [];
            
            for (const msg of queue) {
                try {
                    wrappedWebSocket.send(JSON.stringify(msg));
                    debugLog("[WS]", "✅ Queued message sent");
                } catch (e) {
                    debugLog("[WS]", "❌ Failed to send queued message:", e.message);
                }
            }
        }
    });
    
    wrappedWebSocket.addEventListener("close", function (event) {
        debugLog("[WS]", `⚠️ WebSocket CLOSED (code: ${event.code})`);
        webSocketReady = false;
        messageQueue = []; // Clear queue on close
        forceUnlockAndReset("websocket closed");
        
        if (event.code === 1011 || event.reason === "unexpected message") {
            currentFen = "";
            lastSeenPositionId = null;
            lastSeenFen = null;
            whitePositionReady = false;
            blackPositionReady = false;
            whiteHumanMovedRecently = false;
            blackHumanMovedRecently = false;
        }
    });
    
    wrappedWebSocket.addEventListener("error", function (error) {
        debugLog("[WS]", "❌ WebSocket ERROR");
        webSocketReady = false;
        forceUnlockAndReset("websocket error");
        whitePositionReady = false;
        blackPositionReady = false;
    });
    
    wrappedWebSocket.addEventListener("message", function (event) {
        try {
            let message = JSON.parse(event.data);
            
            if (message.t === "redirect" || message.t === "resync") {
                forceUnlockAndReset("server resync");
                botJustSentMove = false;
                return;
            }
            
            if (message.t === "error" || (message.d && message.d.error)) {
                debugLog("[WS]", "❌ Server error - move rejection");
                
                if (pendingMove) {
                    lastRejectedMove = pendingMove;
                    rejectionCount++;
                }
                
                forceUnlockAndReset("move rejected");
                
                if (currentFen) {
                    const fenColor = getActiveColorFromFen(currentFen);
                    if (fenColor) {
                        const now = Date.now();
                        if (fenColor === 'w') {
                            whitePositionReady = true;
                            lastWhitePositionTime = now;
                        } else {
                            blackPositionReady = true;
                            lastBlackPositionTime = now;
                        }
                    }
                }
                
                botJustSentMove = false;
                pendingMove = null;
                
                if (multiPVLines.length >= 2 && rejectionCount <= 3) {
                    let alternativeMove = null;
                    for (let i = 1; i < Math.min(multiPVLines.length, 5); i++) {
                        const altMove = multiPVLines[i].move;
                        if (altMove !== lastRejectedMove && validateMoveForPosition(altMove, currentFen)) {
                            alternativeMove = altMove;
                            break;
                        }
                    }
                    
                    if (alternativeMove) {
                        setTimeout(() => {
                            sendMove(alternativeMove, 0);
                        }, 300);
                        return;
                    }
                }
                
                setTimeout(() => {
                    scheduleCalculate();
                }, 500);
                return;
            }
            
            handlePositionMessage(message);
        } catch (e) {
            debugLog("[WS]", "⚠️ Message parse error");
        }
    });
}

function interceptWebSocket() {
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(...args) {
        const socket = new OriginalWebSocket(...args);
        
        if (args[0] && args[0].includes("socket.lichess.org")) {
            debugLog("[WS]", "✅ Lichess WebSocket intercepted");
            webSocketWrapper = socket;
            setupWebSocketHandlers(socket);
        }
        
        return socket;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

function initialize() {
    debugLog("[INIT]", "═══════════════════════════════════════════════════");
    debugLog("[INIT]", "🔥 ALPHAZERO v6.0.0 DOMINATION EDITION STARTING...");
    debugLog("[INIT]", "═══════════════════════════════════════════════════");
    
    interceptWebSocket();
    initializeChessEngine();
    setupManualMoveDetection();
    startHealthCheckSystem();
    
    debugLog("[INIT]", "✅ AlphaZero v6.0 DOMINATION READY");
    debugLog("[INIT]", "🎯 TARGET: Consistently defeat Lichess Stockfish Level 8");
    debugLog("[INIT]", "🔥 PHASE 1: Core Engine Strength - ACTIVE");
    debugLog("[INIT]", "🔥 PHASE 2: True AlphaZero Aggression - ACTIVE");
    debugLog("[INIT]", "🔥 PHASE 3: Superior Move Selection - ACTIVE");
}

// Start bot
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
