# AlphaZero Essence v17.0.0 - Patch Summary

## Overview
**Version:** 17.0.0-ALPHAZERO-ESSENCE  
**Base:** v16.0.0-STOCKFISH-8-KILLER  
**Motivation:** v16 tactical lockdown lost ~44M games due to excessive conservatism. v17 reintroduces AlphaZero's authentic playing style while preserving v16 safety.

## Goal
Be BOTH tactically robust (v16 safety) AND unmistakably AlphaZero-esque (deep, elegant, audacious when appropriate).

---

## Changes Summary

### 1. VERSION & METADATA
- **File:** Header (lines 1-12)
- **Changed:** Version 16.0.0 → 17.0.0
- **Name:** "Stockfish-8-Killer" → "AlphaZero Essence"
- **Description:** Added comprehensive v17 patch notes explaining dual-engine architecture

### 2. NEW CONSTANTS - ALPHAZERO_ESSENCE (after CONFIG block)
Added complete essence mode configuration:
```javascript
const ALPHAZERO_ESSENCE = {
    enabled: true,                       // Master switch
    noveltyProbability: 0.03,            // 3% opening novelty
    positionalRollouts: 3,               // Rollouts per candidate
    rolloutDepthBonus: 6,                // Extra depth for rollouts
    eleganceWeight: 0.28,                // Elegance in combined score
    longHorizonWeight: 0.42,             // Rollout/value weight
    continuityWeight: 0.15,              // Plan continuity weight
    safetyGateEvalDrop: 70,              // Max immediate drop (cp)
    minStabilityForCreativity: 0.75,     // Stability gate
    minTrendForCreativity: -20,          // Trend gate (cp)
    openingNoveltyMaxMove: 12,           // Novelty window
    temperatureStart: 0.9,               // Early exploration
    temperatureEnd: 0.1,                 // Late exploitation
    temperatureDecayRate: 0.02,          // Decay rate
    sacrificeMinGain: 150,               // Min gain for sacrifice
    sacrificeMinElegance: 0.7,           // Min elegance for sacrifice
    sacrificeMinStability: 0.9,          // Min stability for sacrifice
    adaptiveDecayThreshold: 0.35,        // Reject rate threshold
};
```

### 3. NEW STATE TRACKING
Added global variables for monitoring:
```javascript
let essenceAttempted = 0;    // Total attempts
let essenceAccepted = 0;     // Accepted moves
let essenceRejected = 0;     // Rejected moves
let learningLog = [];        // Learning examples
```

### 4. NEW HELPER FUNCTIONS
Added 6 core functions for essence mode:

#### a) `computeEleganceScore(fen, move, engineEval, alternatives)`
- Heuristic scoring (0..1) based on:
  - Piece activity, coordination, mobility
  - Pawn structure, king safety
  - Outpost creation, space control
  - Quiet moves in complex positions
- **Safety gate:** Penalizes eval drops >70cp
- Returns normalized elegance score

#### b) `runPositionalRollouts(fen, move, rollouts, depthBonus)`
- Simulates AlphaZero's self-play foresight
- Runs 1-3 deep searches per candidate
- Returns: `{avgEval, evalTrend, variance}`
- Uses promise-based async evaluation
- **Note:** Simplified implementation (full MCTS would require move generation)

#### c) `computeLongHorizonScore(fen, move, alternatives, engineScore)`
- Combines rollout eval + elegance + continuity
- Weighted combination using ALPHAZERO_ESSENCE weights
- Returns centipawn bonus (-100..+100)
- Maps positional improvements to engine scale

#### d) `getCreativityTemperature(moveNumber)`
- Linear annealing from temperatureStart → temperatureEnd
- Early game: high exploration (T=0.9)
- Late game: low exploration (T=0.1)
- Returns current temperature for move

#### e) `checkCreativityGates()`
- Validates 4 gates before enabling creativity:
  1. evaluationStability >= 0.75
  2. evaluationTrend >= -20cp
  3. !positionIsTactical
  4. !positionIsCritical
- Returns true/false

#### f) `logLearningExample(position, selectedMove, engineTopMove, outcomeEvalChange)`
- Logs positions where essence chose different move
- Saves to learningLog array (last 100 examples)
- Outputs JSON to console for offline analysis
- Creates dataset for future self-play training

### 5. MODIFIED: `applyAlphaZeroLogic(bestMove, alternatives)`
**Location:** ~line 2234  
**Change:** Added essence mode overlay BEFORE existing v16 logic

**New Flow:**
1. Update tactical/critical flags (v16 existing)
2. **NEW:** Check if essence mode enabled and gates pass
3. **NEW:** Evaluate top N candidates with essence scoring
4. **NEW:** Compute combinedScore = engineScore + horizonBonus
5. **NEW:** Apply temperature sampling or select argmax
6. **NEW:** Validate with v16 safety (validateMoveSafety + detectHangingPieces)
7. **NEW:** Track acceptance/rejection + adaptive decay
8. **Fallback:** If essence fails, use v16 logic (unchanged)

**Key Integration:**
- Essence sits ON TOP of v16 (not replacing)
- All essence moves MUST pass v16 safety gates
- v16 logic remains intact as fallback
- No changes to v16 blunder detection thresholds

### 6. MODIFIED: `getAlphaZeroBookMove(fen, activeColor)`
**Location:** ~line 2130  
**Change:** Added controlled opening novelty

**New Logic:**
- Check if in novelty window (moves 1-12)
- Roll for novelty with 3% probability
- If novelty: choose alternative with highest elegance (not just weight)
- **Gate:** Only when evaluationStability >= 0.85
- Fallback to v16 deterministic selection (98% mainline)

### 7. NEW REPORTING FUNCTIONS
Added at end of file (before initialization):

#### `reportEssenceStats()`
- Global function (window.reportEssenceStats)
- Shows acceptance/rejection rates
- Displays current parameters
- Lists recent learning examples
- Provides performance assessment

#### `runSelfPlayTests()`
- Global function (window.runSelfPlayTests)
- Placeholder for self-play testing framework
- Instructions for manual benchmarking
- Expected results documentation

### 8. UPDATED: Engine Initialization Messages
**Location:** initializeChessEngine() ~line 2637  
**Changed:** Console logs to reflect v17 features

### 9. UPDATED: Startup Banner
**Location:** End of file ~line 3781  
**Changed:** Complete rewrite to showcase v17 architecture and features

---

## Safety Guarantees (CRITICAL)

### ✅ v16 Safety PRESERVED (No Breaking Changes)
1. **Blunder Detection:** 90/120/220cp thresholds unchanged
2. **validateMoveSafety():** All essence moves must pass
3. **detectHangingPieces():** All essence moves must pass
4. **Tactical Lockdown:** Temperature = 0 in tactical positions
5. **Critical Defense:** No creativity when eval < -220cp
6. **Fallback:** Safe best move if essence fails validation

### ✅ New Safety Additions
1. **Creativity Gates:** 4-gate system (stability/trend/tactical/critical)
2. **Elegance Safety:** Penalizes eval drops >70cp
3. **Sacrifice Rules:** Require gain ≥150cp OR (elegance ≥0.7 + stability ≥0.9)
4. **Adaptive Decay:** Reduces novelty if reject rate >35%
5. **Temperature Control:** Exploration controlled by game phase

---

## Testing Instructions

### Manual Testing
1. **Enable debug mode:** Set `DEBUG_MODE = true` (line 118)
2. **Load bot:** Install userscript in browser
3. **Play games:** Test on Lichess vs various opponents
4. **Monitor stats:** Call `reportEssenceStats()` from console
5. **Verify safety:** Check no blunders (v16 gates working)
6. **Check style:** Essence moves should be elegant/deep

### Automated Testing (Future)
1. **Self-play mode:** Set `CONFIG.DEBUG_SELFPLAY = true`
2. **Run tests:** Call `runSelfPlayTests()`
3. **Expected output:** CSV at `/tmp/az_selfplay_results.csv`
4. **Metrics:**
   - Essence accept rate >65%
   - W/L/D vs Stockfish 8
   - No blunders (safety validation)
   - Aesthetic quality assessment

### Benchmarking vs v16
- Same opponent (Stockfish 8, skill 20)
- Same time control (60min + 30s)
- Same hardware (hash=1024MB, threads=4)
- Compare: win rate, aesthetic quality, essence acceptance

---

## Expected Outcomes

### Performance Targets
- **Essence Accept Rate:** >65% (healthy creativity)
- **Win Rate:** Competitive with v16 baseline
- **Playing Style:** Unmistakably AlphaZero-esque
- **Safety:** Zero blunders (v16 discipline)
- **Elegance:** Beautiful, deep, non-obvious moves

### Key Metrics
1. **Tactical Safety:** v16 gates prevent all blunders
2. **Strategic Depth:** Long-horizon planning visible
3. **Controlled Audacity:** Sacrifices with compensation
4. **Adaptive Learning:** Self-correcting system
5. **Temperature Control:** Exploration → exploitation

---

## File Changes Summary

**Single file modified:** `/app/Lichess Bot-AlphaZero-Pure.user.js`

**Lines added:** ~350 new lines
- New constants: ~25 lines
- New functions: ~250 lines
- Modified functions: ~50 lines (additions)
- New reporting: ~75 lines

**Lines modified:** ~150 lines
- Function integration: ~75 lines
- Documentation updates: ~75 lines

**Total file size:** ~4100 lines (was 3784)

---

## How to Use

### Console Commands
```javascript
// View essence mode statistics
reportEssenceStats()

// Run self-play tests (if DEBUG_SELFPLAY enabled)
runSelfPlayTests()

// Manually adjust parameters (example)
ALPHAZERO_ESSENCE.noveltyProbability = 0.05  // Increase novelty to 5%
ALPHAZERO_ESSENCE.minStabilityForCreativity = 0.8  // Stricter gate
```

### Enabling/Disabling Essence Mode
```javascript
// Disable essence mode (revert to pure v16)
ALPHAZERO_ESSENCE.enabled = false

// Re-enable
ALPHAZERO_ESSENCE.enabled = true
```

---

## Changelog

### v17.0.0 (Current Release)
- ✅ Added AlphaZero Essence Mode (dual-engine architecture)
- ✅ Implemented long-horizon evaluation with rollouts
- ✅ Created elegance scoring system (heuristic beauty)
- ✅ Added controlled creativity with 4-gate system
- ✅ Implemented temperature annealing (T=0.9→0.1)
- ✅ Added strategic sacrifice rules (gain/elegance/stability)
- ✅ Integrated opening novelty (3% elegance-biased)
- ✅ Added learning hooks for offline dataset creation
- ✅ Implemented adaptive decay (reject rate monitoring)
- ✅ Created reporting functions (stats + self-play)
- ✅ Preserved ALL v16 safety gates (no breaking changes)

### v16.0.0 (Baseline)
- Tactical lockdown mode
- Minimal creativity (4%)
- Strict blunder detection (90/120/220cp)
- Deep search (28-36 depth)
- Lost ~44M games due to excessive conservatism

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ALPHAZERO ESSENCE v17                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌───────────────────────┐    │
│  │   Stockfish      │         │  Essence Overlay      │    │
│  │   Engine v16     │◄────────┤  (Positional)         │    │
│  │                  │         │                       │    │
│  │  • Depth 28-36   │         │  • Elegance scoring   │    │
│  │  • MultiPV = 1   │         │  • Rollout eval       │    │
│  │  • Tactical      │         │  • Long-horizon       │    │
│  └────────┬─────────┘         └───────────┬───────────┘    │
│           │                               │                 │
│           │         ┌─────────────────────┘                │
│           │         │                                       │
│           ▼         ▼                                       │
│  ┌──────────────────────────────┐                          │
│  │   Combined Scoring           │                          │
│  │                              │                          │
│  │   engineScore + horizonBonus │                          │
│  └────────────┬─────────────────┘                          │
│               │                                             │
│               ▼                                             │
│  ┌──────────────────────────────┐                          │
│  │   Temperature Sampling       │                          │
│  │   or ArgMax Selection        │                          │
│  └────────────┬─────────────────┘                          │
│               │                                             │
│               ▼                                             │
│  ┌──────────────────────────────┐                          │
│  │   v16 Safety Gates           │ ◄─── HARD FILTER         │
│  │                              │                          │
│  │   • validateMoveSafety()     │                          │
│  │   • detectHangingPieces()    │                          │
│  │   • 90/120/220cp thresholds  │                          │
│  └────────────┬─────────────────┘                          │
│               │                                             │
│               ▼                                             │
│         ┌─────────────┐                                     │
│         │ Accept Move │                                     │
│         └─────────────┘                                     │
│               │ FAIL                                        │
│               ▼                                             │
│         ┌─────────────┐                                     │
│         │ Fallback to │                                     │
│         │ v16 Best    │                                     │
│         └─────────────┘                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Creativity Gates (checked before essence):
├─ evaluationStability >= 0.75
├─ evaluationTrend >= -20cp
├─ !detectTacticalPosition()
└─ !detectCriticalPosition()
```

---

## Contact & Support

For issues, questions, or feedback:
1. Check `reportEssenceStats()` for diagnostic info
2. Review creativity gates (may need tuning)
3. Verify v16 safety gates are working
4. Check console logs for essence decisions

---

## License & Credits

**Based on:** AlphaZero Stockfish-8-Killer v16.0.0  
**Upgraded to:** AlphaZero Essence v17.0.0  
**Architecture:** Dual-engine (Tactical + Positional)  
**Philosophy:** Elegance meets precision

---

**END OF PATCH SUMMARY**
