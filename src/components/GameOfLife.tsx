'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaPlay, FaStop, FaStepForward, FaTrash, FaRandom } from 'react-icons/fa';

interface Point {
    x: number;
    y: number;
}

const CELL_SIZE = 10;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 700;

const GameOfLife = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [generation, setGeneration] = useState(0);
    const [liveCells, setLiveCells] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });

    // Store active cells as a Set of strings "x,y" for O(1) lookup
    const activeCellsRef = useRef<Set<string>>(new Set());
    const runningRef = useRef(false);

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.strokeStyle = '#eee';
        for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
        }
        for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
        }
        ctx.stroke();
    };

    const drawCells = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#000';
        activeCellsRef.current.forEach(key => {
            const [x, y] = key.split(',').map(Number);
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
    };

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawGrid(ctx);
        drawCells(ctx);
    }, []);

    const computeNextGeneration = useCallback(() => {
        const newActiveCells = new Set<string>();
        const neighborCounts = new Map<string, number>();

        // Count neighbors
        activeCellsRef.current.forEach(key => {
            const [cx, cy] = key.split(',').map(Number);
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = cx + dx;
                    const ny = cy + dy;
                    const nKey = `${nx},${ny}`;
                    neighborCounts.set(nKey, (neighborCounts.get(nKey) || 0) + 1);
                }
            }
        });

        // Apply rules
        neighborCounts.forEach((count, key) => {
            if (count === 3 || (count === 2 && activeCellsRef.current.has(key))) {
                newActiveCells.add(key);
            }
        });

        activeCellsRef.current = newActiveCells;
        setGeneration(g => g + 1);
        setLiveCells(newActiveCells.size);
        render();
    }, [render]);

    const runSimulation = useCallback(() => {
        if (!runningRef.current) return;
        computeNextGeneration();
        setTimeout(runSimulation, 100);
    }, [computeNextGeneration]);

    const toggleRunning = () => {
        setIsRunning(!isRunning);
        runningRef.current = !isRunning;
        if (!isRunning) {
            runSimulation();
        }
    };

    const handleNext = () => {
        computeNextGeneration();
    };

    const handleClear = () => {
        setIsRunning(false);
        runningRef.current = false;
        activeCellsRef.current.clear();
        setGeneration(0);
        setLiveCells(0);
        render();
    };

    const handleGenerate = () => {
        handleClear();
        const newActiveCells = new Set<string>();
        const cols = Math.floor(CANVAS_WIDTH / CELL_SIZE);
        const rows = Math.floor(CANVAS_HEIGHT / CELL_SIZE);

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (Math.random() < 0.2) { // 20% chance of being alive
                    newActiveCells.add(`${x},${y}`);
                }
            }
        }
        activeCellsRef.current = newActiveCells;
        setLiveCells(newActiveCells.size);
        render();
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
        const key = `${x},${y}`;

        if (activeCellsRef.current.has(key)) {
            activeCellsRef.current.delete(key);
        } else {
            activeCellsRef.current.add(key);
        }
        setLiveCells(activeCellsRef.current.size);
        render();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
        setMousePos({ x, y });
    };

    useEffect(() => {
        render();
    }, [render]);

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-8 text-lg font-semibold">
                <div>Live Cells: {liveCells}</div>
                <div>Generations: {generation}</div>
                <div>Cursor: ({mousePos.x}, {mousePos.y})</div>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={toggleRunning}
                    className={`flex items-center space-x-2 px-4 py-2 rounded text-white ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isRunning ? <><FaStop /> <span>Stop</span></> : <><FaPlay /> <span>Auto</span></>}
                </button>
                <button
                    onClick={handleNext}
                    disabled={isRunning}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    <FaStepForward /> <span>Next</span>
                </button>
                <button
                    onClick={handleGenerate}
                    disabled={isRunning}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                >
                    <FaRandom /> <span>Generate</span>
                </button>
                <button
                    onClick={handleClear}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    <FaTrash /> <span>Clear</span>
                </button>
            </div>

            <div className="border border-gray-300 shadow-lg overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    className="cursor-crosshair bg-white"
                />
            </div>
        </div>
    );
};

export default GameOfLife;
