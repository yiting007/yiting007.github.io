/**
 * FILE: src/components/Game2048.tsx
 * PURPOSE: Implements the 2048 game logic and UI.
 * OPTIMIZATION:
 *  - Use `useCallback` for event listeners to avoid re-binding.
 *  - Memoize tile components to prevent unnecessary re-renders.
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Helper to get unique IDs for tiles to help Framer Motion track them
let tileIdCounter = 0;
const getUniqueId = () => {
    return tileIdCounter++;
};

interface Tile {
    id: number;
    val: number;
    merged?: boolean;
    isNew?: boolean;
}

export default function Game2048() {
    const [grid, setGrid] = useState<number[][]>(Array(4).fill(Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [history, setHistory] = useState<{ grid: number[][], score: number }[]>([]);

    // Auto Play State
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [autoPlaySpeed, setAutoPlaySpeed] = useState(500); // ms
    const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize game
    useEffect(() => {
        // Load high score
        const savedHighScore = localStorage.getItem('2048-highscore');
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore, 10));
        }
        startNewGame();
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('2048-highscore', score.toString());
        }
    }, [score, highScore]);

    // Auto Play Effect
    useEffect(() => {
        if (isAutoPlaying && !gameOver && !gameWon) {
            // Clear existing interval to restart with potentially new speed
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }

            autoPlayIntervalRef.current = setInterval(() => {
                const bestMove = getBestMove(grid);
                if (bestMove) {
                    move(bestMove);
                } else {
                    // No moves possible or AI gave up
                    setIsAutoPlaying(false);
                }
            }, autoPlaySpeed);
        } else {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
                autoPlayIntervalRef.current = null;
            }
        }

        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
        };
    }, [isAutoPlaying, gameOver, gameWon, grid, autoPlaySpeed]); // Added autoPlaySpeed dependency

    const startNewGame = () => {
        let newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
        newGrid = addRandomTile(newGrid);
        newGrid = addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        setHistory([]);
        setIsAutoPlaying(false);
    };

    const addRandomTile = (currentGrid: number[][]) => {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length === 0) return currentGrid;

        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newGrid = currentGrid.map(row => [...row]);
        newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
        return newGrid;
    };

    // --- AI Logic (Expectimax) ---

    const getBestMove = (currentGrid: number[][]): Direction | null => {
        const depth = 3; // Search depth
        let bestScore = -Infinity;
        let bestMove: Direction | null = null;
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

        for (const dir of directions) {
            const { newGrid, moved, scoreToAdd } = simulateMove(currentGrid, dir);
            if (moved) {
                const score = expectimax(newGrid, depth - 1, false) + scoreToAdd;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = dir;
                }
            }
        }
        return bestMove;
    };

    const expectimax = (grid: number[][], depth: number, isPlayerTurn: boolean): number => {
        if (depth === 0) {
            return evaluateGrid(grid);
        }

        if (isPlayerTurn) {
            let bestScore = -Infinity;
            const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
            let canMove = false;

            for (const dir of directions) {
                const { newGrid, moved, scoreToAdd } = simulateMove(grid, dir);
                if (moved) {
                    canMove = true;
                    const score = expectimax(newGrid, depth - 1, false) + scoreToAdd;
                    bestScore = Math.max(bestScore, score);
                }
            }
            return canMove ? bestScore : evaluateGrid(grid); // If no moves, game over-ish
        } else {
            // Chance node (random tile spawn)
            const emptyCells = [];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (grid[r][c] === 0) emptyCells.push({ r, c });
                }
            }

            if (emptyCells.length === 0) return evaluateGrid(grid);

            let totalScore = 0;
            // Optimization: Only sample a few empty cells if there are too many to keep performance up
            // But for 4x4, iterating all is usually okay for low depth.
            // Let's just average over all empty cells.

            for (const { r, c } of emptyCells) {
                // 90% chance of 2
                const grid2 = grid.map(row => [...row]);
                grid2[r][c] = 2;
                totalScore += 0.9 * expectimax(grid2, depth - 1, true);

                // 10% chance of 4
                const grid4 = grid.map(row => [...row]);
                grid4[r][c] = 4;
                totalScore += 0.1 * expectimax(grid4, depth - 1, true);
            }

            return totalScore / emptyCells.length;
        }
    };

    const simulateMove = (grid: number[][], direction: Direction) => {
        let newGrid = grid.map(row => [...row]);
        let moved = false;
        let scoreToAdd = 0;

        const rotate = (matrix: number[][]) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
        const rotateLeft = (matrix: number[][]) => matrix[0].map((_, i) => matrix.map(row => row[row.length - 1 - i]));

        if (direction === 'RIGHT') newGrid = newGrid.map(row => [...row].reverse());
        if (direction === 'UP') newGrid = rotateLeft(newGrid);
        if (direction === 'DOWN') newGrid = rotate(newGrid);

        for (let r = 0; r < 4; r++) {
            let row = newGrid[r].filter(val => val !== 0);
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    scoreToAdd += row[c];
                    row.splice(c + 1, 1);
                }
            }
            while (row.length < 4) row.push(0);
            if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
            newGrid[r] = row;
        }

        if (direction === 'RIGHT') newGrid = newGrid.map(row => [...row].reverse());
        if (direction === 'UP') newGrid = rotate(newGrid);
        if (direction === 'DOWN') newGrid = rotateLeft(newGrid);

        return { newGrid, moved, scoreToAdd };
    };

    const evaluateGrid = (grid: number[][]) => {
        let score = 0;
        const emptyCells = grid.flat().filter(val => val === 0).length;

        // Heuristic 1: Empty cells (very important)
        score += emptyCells * 100;

        // Heuristic 2: Monotonicity & Smoothness & Max Tile Corner
        // Simplified: Gradient map to encourage max tile in top-left
        const gradient = [
            [6, 5, 4, 3],
            [5, 4, 3, 2],
            [4, 3, 2, 1],
            [3, 2, 1, 0]
        ];
        // Or snake pattern
        const snake = [
            [15, 14, 13, 12],
            [8, 9, 10, 11],
            [7, 6, 5, 4],
            [0, 1, 2, 3]
        ];

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (grid[r][c] > 0) {
                    // Power of 2 weighting
                    score += grid[r][c] * snake[r][c];
                }
            }
        }

        return score;
    };

    // --- End AI Logic ---

    // Game Logic: Move & Merge
    const move = useCallback((direction: Direction) => {
        if (gameOver) return;

        setGrid(prevGrid => {
            // Deep copy for history
            const gridCopy = prevGrid.map(row => [...row]);

            const { newGrid, moved, scoreToAdd } = simulateMove(prevGrid, direction);

            if (moved) {
                // Save history
                setHistory(prev => [...prev, { grid: gridCopy, score }]);

                const finalGrid = addRandomTile(newGrid);
                setScore(prev => prev + scoreToAdd);

                if (checkWin(finalGrid) && !gameWon) {
                    setGameWon(true);
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                    // Don't stop auto play on win, let it continue if it can? 
                    // Usually 2048 stops, but "Keep Playing" exists.
                    // For now, let's pause auto play on win to let user see it.
                    setIsAutoPlaying(false);
                } else if (checkGameOver(finalGrid)) {
                    setGameOver(true);
                    setIsAutoPlaying(false);
                }
                return finalGrid;
            }
            return prevGrid;
        });
    }, [gameOver, gameWon, score]); // Added dependencies

    const checkGameOver = (currentGrid: number[][]) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 0) return false;
                if (c < 3 && currentGrid[r][c] === currentGrid[r][c + 1]) return false;
                if (r < 3 && currentGrid[r][c] === currentGrid[r + 1][c]) return false;
            }
        }
        return true;
    };

    const checkWin = (currentGrid: number[][]) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 2048) return true;
            }
        }
        return false;
    };

    const undo = () => {
        if (history.length === 0 || gameOver) return;
        const lastState = history[history.length - 1];
        setGrid(lastState.grid);
        setScore(lastState.score);
        setHistory(prev => prev.slice(0, -1));
        setIsAutoPlaying(false); // Stop auto play on manual intervention
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                setIsAutoPlaying(false); // Stop auto play on manual input
                move(e.key.replace('Arrow', '').toUpperCase() as Direction);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    // Touch controls (simple swipe)
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;
        const dx = e.changedTouches[0].clientX - touchStart.x;
        const dy = e.changedTouches[0].clientY - touchStart.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (Math.abs(dx) > 30) {
                setIsAutoPlaying(false);
                move(dx > 0 ? 'RIGHT' : 'LEFT');
            }
        } else {
            if (Math.abs(dy) > 30) {
                setIsAutoPlaying(false);
                move(dy > 0 ? 'DOWN' : 'UP');
            }
        }
        setTouchStart(null);
    };

    // Tile Colors
    const getTileColor = (val: number) => {
        const colors: { [key: number]: string } = {
            0: 'bg-gray-200',
            2: 'bg-orange-100 text-gray-800',
            4: 'bg-orange-200 text-gray-800',
            8: 'bg-orange-300 text-white',
            16: 'bg-orange-400 text-white',
            32: 'bg-orange-500 text-white',
            64: 'bg-orange-600 text-white',
            128: 'bg-yellow-400 text-white',
            256: 'bg-yellow-500 text-white',
            512: 'bg-yellow-600 text-white',
            1024: 'bg-yellow-700 text-white',
            2048: 'bg-yellow-800 text-white',
        };
        return colors[val] || 'bg-black text-white';
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-4 flex flex-col w-full max-w-[320px]">
                <div className="flex justify-between items-center mb-4">
                    <div className="bg-gray-700 text-white p-2 rounded">
                        <span className="text-xs text-gray-300 block">SCORE</span>
                        <span className="text-xl font-bold">{score}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            className={`px-4 py-2 rounded font-bold text-white transition-colors ${isAutoPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                }`}
                        >
                            {isAutoPlaying ? 'Stop Auto' : 'Auto'}
                        </button>
                        <button
                            onClick={startNewGame}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold"
                        >
                            New Game
                        </button>
                    </div>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg w-full">
                    <span className="text-xs font-bold text-gray-600 whitespace-nowrap">SPEED: {autoPlaySpeed}ms</span>
                    <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={1010 - autoPlaySpeed} // Invert so right is faster
                        onChange={(e) => setAutoPlaySpeed(1010 - parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            <div
                className="bg-gray-400 p-2 rounded-lg relative"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="grid grid-cols-4 gap-2">
                    {grid.map((row, r) => (
                        row.map((val, c) => (
                            <div
                                key={`${r}-${c}`}
                                className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded font-bold text-2xl transition-all duration-100 ${getTileColor(val)}`}
                            >
                                {val !== 0 ? val : ''}
                            </div>
                        ))
                    ))}
                </div>
                {gameOver && (
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-lg">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
                        <button
                            onClick={startNewGame}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
            <p className="mt-4 text-gray-600 text-sm">Use arrow keys or swipe to move tiles.</p>
        </div>
    );
}
