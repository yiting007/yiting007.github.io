/**
 * FILE: src/components/Game2048.tsx
 * PURPOSE: Implements the 2048 game logic and UI.
 * OPTIMIZATION:
 *  - Use `useCallback` for event listeners to avoid re-binding.
 *  - Memoize tile components to prevent unnecessary re-renders.
 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function Game2048() {
    const [grid, setGrid] = useState<number[][]>(Array(4).fill(Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        let newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
        newGrid = addRandomTile(newGrid);
        newGrid = addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
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

    // Game Logic: Move & Merge
    const move = useCallback((direction: Direction) => {
        if (gameOver) return;

        setGrid(prevGrid => {
            let newGrid = prevGrid.map(row => [...row]);
            let moved = false;
            let scoreToAdd = 0;

            const rotate = (matrix: number[][]) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
            const rotateLeft = (matrix: number[][]) => matrix[0].map((_, i) => matrix.map(row => row[row.length - 1 - i]));

            // Normalize to LEFT movement
            if (direction === 'RIGHT') newGrid = newGrid.map(row => [...row].reverse());
            if (direction === 'UP') newGrid = rotateLeft(newGrid);
            if (direction === 'DOWN') newGrid = rotate(newGrid);

            // Process each row (as if moving LEFT)
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

            // Restore orientation
            if (direction === 'RIGHT') newGrid = newGrid.map(row => [...row].reverse());
            if (direction === 'UP') newGrid = rotate(newGrid);
            if (direction === 'DOWN') newGrid = rotateLeft(newGrid);

            if (moved) {
                newGrid = addRandomTile(newGrid);
                setScore(prev => prev + scoreToAdd);
                if (checkGameOver(newGrid)) setGameOver(true);
                return newGrid;
            }
            return prevGrid;
        });
    }, [gameOver]);

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

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
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
            if (Math.abs(dx) > 30) move(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
            if (Math.abs(dy) > 30) move(dy > 0 ? 'DOWN' : 'UP');
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
            <div className="mb-4 flex justify-between w-full max-w-[320px] items-center">
                <div className="bg-gray-700 text-white p-2 rounded">
                    <span className="text-xs text-gray-300 block">SCORE</span>
                    <span className="text-xl font-bold">{score}</span>
                </div>
                <button
                    onClick={startNewGame}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold"
                >
                    New Game
                </button>
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
