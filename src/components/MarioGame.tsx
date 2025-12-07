/**
 * FILE: src/components/MarioGame.tsx
 * PURPOSE: Main game component with canvas, game loop, and rendering
 */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Player } from '@/lib/mario/entities/Player';
import { Item } from '@/lib/mario/entities/Item';
import { Enemy } from '@/lib/mario/entities/Enemy';
import { Controls } from '@/lib/mario/controls';
import {
    GAME_CONFIG,
    Entity,
    applyPhysics,
    isOnGround,
    checkCollision,
    generateId
} from '@/lib/mario/gameEngine';

export default function MarioGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [restartKey, setRestartKey] = useState(0); // Key to force useEffect re-run
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [combo, setCombo] = useState(0);
    const [comboMultiplier, setComboMultiplier] = useState(1);

    // Game state refs (don't cause re-renders)
    const playerRef = useRef<Player | null>(null);
    const controlsRef = useRef<Controls | null>(null);
    const platformsRef = useRef<Entity[]>([]);
    const coinsRef = useRef<Item[]>([]);
    const enemiesRef = useRef<Enemy[]>([]);
    const cameraXRef = useRef(0);
    const animationIdRef = useRef<number | null>(null);
    const lastScoreRef = useRef(0);
    const lastCoinTimeRef = useRef(0);
    const comboTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (!gameStarted) return;
        
        // This effect will re-run when restartKey changes

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize game
        const player = new Player(100, 300);
        const controls = new Controls();

        playerRef.current = player;
        controlsRef.current = controls;

        // Create initial platforms and coins
        platformsRef.current = createInitialPlatforms();
        coinsRef.current = [];
        enemiesRef.current = [];

        controls.attach();

        // Game loop
        let lastTime = performance.now();
        const gameLoop = (currentTime: number) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // Update
            update(deltaTime);

            // Render
            render(ctx);

            // Continue loop
            animationIdRef.current = requestAnimationFrame(gameLoop);
        };

        // Start game loop
        animationIdRef.current = requestAnimationFrame(gameLoop);

        // Cleanup
        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (comboTimeoutRef.current) {
                clearTimeout(comboTimeoutRef.current);
            }
            controls.detach();
        };
    }, [gameStarted, restartKey]);

    /**
     * Update game state
     */
    const update = (deltaTime: number) => {
        const player = playerRef.current;
        const controls = controlsRef.current;
        const platforms = platformsRef.current;
        const coins = coinsRef.current;
        const enemies = enemiesRef.current;

        if (!player || !controls || player.state === 'dead') {
            if (player && player.state === 'dead') {
                setGameOver(true);
                player.updateFaceExpression(deltaTime);
            }
            return;
        }

        // Update face expression
        player.updateFaceExpression(deltaTime);

        const keys = controls.getState();
        const onGround = isOnGround(player, platforms);

        // Find nearest platform for jump tracking
        let nearestPlatform: { x: number; y: number } | null = null;
        let minDistance = Infinity;
        for (const platform of platforms) {
            const distance = Math.abs(player.x - platform.x);
            if (distance < minDistance && distance < 200) {
                minDistance = distance;
                nearestPlatform = { x: platform.x, y: platform.y };
            }
        }

        // Handle input
        player.move(
            { left: keys.left, right: keys.right, run: keys.run },
            onGround
        );
        player.jump({ jump: keys.jump }, onGround, nearestPlatform);

        // Update moving platforms
        for (const platform of platforms) {
            if (platform.isMoving && platform.moveType && platform.moveSpeed) {
                if (platform.moveType === 'horizontal') {
                    // Horizontal movement
                    const startX = platform.moveStartX ?? platform.x;
                    const range = platform.moveRange ?? 100;
                    const direction = platform.moveDirection ?? 1;
                    
                    platform.x += platform.moveSpeed * direction;
                    
                    // Reverse direction at boundaries
                    if (platform.x >= startX + range) {
                        platform.moveDirection = -1;
                        platform.x = startX + range;
                    } else if (platform.x <= startX) {
                        platform.moveDirection = 1;
                        platform.x = startX;
                    }
                } else if (platform.moveType === 'vertical') {
                    // Vertical movement
                    const startY = platform.moveStartY ?? platform.y;
                    const range = platform.moveRange ?? 100;
                    const direction = platform.moveDirection ?? 1;
                    
                    platform.y += platform.moveSpeed * direction;
                    
                    // Reverse direction at boundaries
                    if (platform.y >= startY + range) {
                        platform.moveDirection = -1;
                        platform.y = startY + range;
                    } else if (platform.y <= startY) {
                        platform.moveDirection = 1;
                        platform.y = startY;
                    }
                }
            }
        }

        // Apply physics
        applyPhysics(player, onGround);

        // Collision with platforms (including moving platforms)
        let standingOnMovingPlatform = false;
        let platformVelocityX = 0;
        let platformVelocityY = 0;
        
        for (const platform of platforms) {
            const collision = checkCollision(player, platform);
            if (collision.collided) {
                if (collision.side === 'top') {
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    
                    // Check if this is the target platform for jump success
                    player.checkJumpSuccess([{ x: platform.x, y: platform.y, width: platform.width, height: platform.height }]);
                    
                    // If standing on a moving platform, move with it
                    if (platform.isMoving) {
                        standingOnMovingPlatform = true;
                        if (platform.moveType === 'horizontal') {
                            platformVelocityX = (platform.moveSpeed ?? 0) * (platform.moveDirection ?? 1);
                            player.x += platformVelocityX;
                        } else if (platform.moveType === 'vertical') {
                            platformVelocityY = (platform.moveSpeed ?? 0) * (platform.moveDirection ?? 1);
                            player.y += platformVelocityY;
                        }
                    }
                } else if (collision.side === 'bottom') {
                    player.y = platform.y + platform.height;
                    player.velocityY = 0;
                } else if (collision.side === 'left') {
                    player.x = platform.x - player.width;
                } else if (collision.side === 'right') {
                    player.x = platform.x + platform.width;
                }
            }
        }
        
        // Check jump success after all collisions
        player.checkJumpSuccess(platforms.map(p => ({ x: p.x, y: p.y, width: p.width, height: p.height })));

        // Coin collection with combo system
        const currentTime = performance.now();
        const COMBO_TIME_WINDOW = 2000; // 2 seconds to maintain combo
        
        for (const coin of coins) {
            if (!coin.active) continue;
            const collision = checkCollision(player, coin);
            if (collision.collided) {
                const basePoints = coin.collect();
                
                // Check if within combo window
                if (currentTime - lastCoinTimeRef.current < COMBO_TIME_WINDOW) {
                    // Increase combo
                    const newCombo = combo + 1;
                    setCombo(newCombo);
                    
                    // Calculate multiplier (1x, 2x, 3x, 4x, 5x max)
                    const newMultiplier = Math.min(1 + Math.floor(newCombo / 3), 5);
                    setComboMultiplier(newMultiplier);
                    
                    // Award points with multiplier
                    const points = basePoints * newMultiplier;
                    player.addScore(points);
                } else {
                    // Reset combo
                    setCombo(1);
                    setComboMultiplier(1);
                    player.addScore(basePoints);
                }
                
                lastCoinTimeRef.current = currentTime;
                
                // Reset combo timeout
                if (comboTimeoutRef.current) {
                    clearTimeout(comboTimeoutRef.current);
                }
                comboTimeoutRef.current = window.setTimeout(() => {
                    setCombo(0);
                    setComboMultiplier(1);
                }, COMBO_TIME_WINDOW);
            }
        }

        // Remove collected coins
        coinsRef.current = coins.filter(c => c.active);

        // Update enemies
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            enemy.update(platforms, deltaTime);
        }

        // Enemy collision with player
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            
            const collision = checkCollision(player, enemy);
            if (collision.collided) {
                // Check if player is stomping the enemy (falling and hitting from above)
                // Player must be falling (velocityY > 0) and player's bottom should be near enemy's top
                const playerBottom = player.y + player.height;
                const enemyTop = enemy.y;
                const isStomping = player.velocityY > 0 && 
                                   playerBottom >= enemyTop && 
                                   playerBottom <= enemyTop + 15 &&
                                   player.y < enemy.y;
                
                if (isStomping) {
                    // Player stomped the enemy
                    enemy.stomp();
                    player.velocityY = -8; // Bounce up a bit
                    player.y = enemyTop - player.height; // Position player on top
                    player.addScore(200); // Points for stomping
                } else {
                    // Enemy hit player - take damage
                    player.takeDamage();
                    // Knockback
                    if (player.x < enemy.x) {
                        player.velocityX = -5;
                    } else {
                        player.velocityX = 5;
                    }
                }
            }
        }

        // Remove inactive enemies
        enemiesRef.current = enemies.filter(e => e.active);

        // Ground collision
        if (player.y + player.height >= GAME_CONFIG.GROUND_Y) {
            player.y = GAME_CONFIG.GROUND_Y - player.height;
            player.velocityY = 0;
        }

        // Camera follows player
        cameraXRef.current = Math.max(0, player.x - GAME_CONFIG.WIDTH / 3);

        // Update score (distance traveled + collected coins)
        const currentScore = Math.floor(player.x / 10) + player.score;
        if (currentScore !== lastScoreRef.current) {
            lastScoreRef.current = currentScore;
            setScore(currentScore);
        }

        // Calculate difficulty based on score
        // Difficulty increases every 1000 points, max 3x speed
        const difficultyLevel = Math.min(1 + (currentScore / 1000) * 0.2, 3.0);
        
        // Update player difficulty (movement speeds)
        player.setDifficulty(difficultyLevel);

        // Generate new platforms and coins as player moves forward
        const lastPlatform = platforms[platforms.length - 1];
        if (lastPlatform && lastPlatform.x - cameraXRef.current < GAME_CONFIG.WIDTH * 1.5) {
            generateNextPlatform(platforms, coins, enemies, difficultyLevel);
        }

        // Remove platforms, coins, and enemies that are off-screen
        platformsRef.current = platforms.filter(
            p => p.x + p.width > cameraXRef.current - 100
        );
        coinsRef.current = coins.filter(
            c => c.x + c.width > cameraXRef.current - 100 && c.active
        );
        enemiesRef.current = enemies.filter(
            e => e.x + e.width > cameraXRef.current - 100 && e.active
        );

        // Update lives display
        if (player.lives !== lives) {
            setLives(player.lives);
        }

        // Death condition - falling into gaps or off screen
        if (player.y > GAME_CONFIG.HEIGHT + 100) {
            player.die();
        }

        // Keep player in bounds (left edge)
        if (player.x < cameraXRef.current) {
            player.x = cameraXRef.current;
            player.velocityX = 0;
        }
    };

    /**
     * Render game
     */
    const render = (ctx: CanvasRenderingContext2D) => {
        const player = playerRef.current;
        const platforms = platformsRef.current;
        const coins = coinsRef.current;
        const enemies = enemiesRef.current;
        const cameraX = cameraXRef.current;

        if (!player) return;

        // Clear canvas
        ctx.fillStyle = '#5C94FC'; // Sky blue
        ctx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

        // Save context for camera
        ctx.save();
        ctx.translate(-cameraX, 0);

        // Draw ground
        ctx.fillStyle = '#8B4513'; // Brown ground
        ctx.fillRect(
            cameraX,
            GAME_CONFIG.GROUND_Y,
            GAME_CONFIG.WIDTH,
            GAME_CONFIG.HEIGHT - GAME_CONFIG.GROUND_Y
        );

        // Draw platforms (above the ground)
        for (const platform of platforms) {
            // Draw platform body - fully filled
            // Moving platforms have a slightly different color
            if (platform.isMoving) {
                ctx.fillStyle = '#9B7A24'; // Lighter brown for moving platforms
            } else {
                ctx.fillStyle = '#8B6914'; // Brown/gold platforms
            }
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

            // Draw platform border for definition
            ctx.strokeStyle = platform.isMoving ? '#FFD700' : '#654321'; // Gold border for moving, dark brown for static
            ctx.lineWidth = platform.isMoving ? 3 : 2;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

            // Draw grass on top of platform
            ctx.fillStyle = '#228B22'; // Forest green
            ctx.fillRect(platform.x, platform.y - 5, platform.width, 5);
            
            // Draw arrow indicator for moving platforms
            if (platform.isMoving && platform.moveType) {
                ctx.fillStyle = '#FFD700'; // Gold
                ctx.font = 'bold 16px Arial';
                const arrow = platform.moveType === 'horizontal' ? '↔' : '↕';
                ctx.fillText(arrow, platform.x + platform.width / 2 - 8, platform.y + platform.height / 2 + 6);
            }
        }

        // Draw coins
        for (const coin of coins) {
            if (!coin.active) continue;

            // Draw coin as circle
            ctx.fillStyle = '#FFD700'; // Gold
            ctx.beginPath();
            ctx.arc(
                coin.x + coin.width / 2,
                coin.y + coin.height / 2,
                coin.width / 2,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // Draw coin shine
            ctx.fillStyle = '#FFF59D'; // Light gold
            ctx.beginPath();
            ctx.arc(
                coin.x + coin.width / 2 - 4,
                coin.y + coin.height / 2 - 4,
                coin.width / 4,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Draw enemies
        for (const enemy of enemies) {
            if (!enemy.active) continue;

            if (enemy.enemyType === 'goomba') {
                // Draw Goomba - brown rounded rectangle with eyes
                ctx.fillStyle = '#8B4513'; // Brown
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Draw Goomba eyes
                ctx.fillStyle = '#FFF';
                ctx.fillRect(enemy.x + 6, enemy.y + 6, 4, 4);
                ctx.fillRect(enemy.x + 18, enemy.y + 6, 4, 4);
                
                // Draw Goomba pupils
                ctx.fillStyle = '#000';
                ctx.fillRect(enemy.x + 7, enemy.y + 7, 2, 2);
                ctx.fillRect(enemy.x + 19, enemy.y + 7, 2, 2);
            } else if (enemy.enemyType === 'flying') {
                // Draw flying enemy - purple with wings
                ctx.fillStyle = '#8B008B'; // Purple
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Draw wings
                ctx.fillStyle = '#9370DB'; // Light purple
                ctx.fillRect(enemy.x - 4, enemy.y + 8, 4, 8);
                ctx.fillRect(enemy.x + enemy.width, enemy.y + 8, 4, 8);
                
                // Draw eyes
                ctx.fillStyle = '#FFF';
                ctx.fillRect(enemy.x + 4, enemy.y + 4, 3, 3);
                ctx.fillRect(enemy.x + 17, enemy.y + 4, 3, 3);
            } else if (enemy.enemyType === 'ground') {
                // Draw ground enemy - red/orange with spikes
                ctx.fillStyle = '#FF4500'; // Orange-red
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Draw spikes on top
                ctx.fillStyle = '#FF6347'; // Light red
                ctx.beginPath();
                ctx.moveTo(enemy.x, enemy.y);
                ctx.lineTo(enemy.x + enemy.width / 2, enemy.y - 6);
                ctx.lineTo(enemy.x + enemy.width, enemy.y);
                ctx.fill();
                
                // Draw eyes
                ctx.fillStyle = '#FFF';
                ctx.fillRect(enemy.x + 6, enemy.y + 6, 3, 3);
                ctx.fillRect(enemy.x + 21, enemy.y + 6, 3, 3);
            }
        }

        // Draw player
        ctx.fillStyle = player.state === 'dead' ? '#888' : '#E74C3C'; // Red (or gray if dead)
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw player face based on expression
        ctx.fillStyle = '#FFF';
        const eyeY = player.y + 15;
        const eyeSize = 4;
        const mouthY = player.y + 28;
        
        if (player.state === 'dead') {
            // Dead face: X X
            if (player.facing === 'right') {
                // Draw X eyes
                ctx.strokeStyle = '#FFF';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(player.x + 18, eyeY);
                ctx.lineTo(player.x + 22, eyeY + eyeSize);
                ctx.moveTo(player.x + 22, eyeY);
                ctx.lineTo(player.x + 18, eyeY + eyeSize);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(player.x + 26, eyeY);
                ctx.lineTo(player.x + 30, eyeY + eyeSize);
                ctx.moveTo(player.x + 30, eyeY);
                ctx.lineTo(player.x + 26, eyeY + eyeSize);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(player.x + 8, eyeY);
                ctx.lineTo(player.x + 12, eyeY + eyeSize);
                ctx.moveTo(player.x + 12, eyeY);
                ctx.lineTo(player.x + 8, eyeY + eyeSize);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(player.x + 16, eyeY);
                ctx.lineTo(player.x + 20, eyeY + eyeSize);
                ctx.moveTo(player.x + 20, eyeY);
                ctx.lineTo(player.x + 16, eyeY + eyeSize);
                ctx.stroke();
            }
        } else {
            // Draw eyes based on facing direction
            if (player.facing === 'right') {
                ctx.fillRect(player.x + 18, eyeY, eyeSize, eyeSize);
                ctx.fillRect(player.x + 26, eyeY, eyeSize, eyeSize);
            } else {
                ctx.fillRect(player.x + 8, eyeY, eyeSize, eyeSize);
                ctx.fillRect(player.x + 16, eyeY, eyeSize, eyeSize);
            }
            
            // Draw mouth/expression
            ctx.fillStyle = '#FFF';
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            
            switch (player.faceExpression) {
                case 'jumping':
                    // o 0 o - mouth open (circle)
                    if (player.facing === 'right') {
                        ctx.beginPath();
                        ctx.arc(player.x + 22, mouthY, 5, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.arc(player.x + 12, mouthY, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
                    
                case 'happy':
                    // > V < - smile
                    if (player.facing === 'right') {
                        ctx.beginPath();
                        ctx.moveTo(player.x + 16, mouthY);
                        ctx.lineTo(player.x + 22, mouthY + 4);
                        ctx.lineTo(player.x + 28, mouthY);
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(player.x + 6, mouthY);
                        ctx.lineTo(player.x + 12, mouthY + 4);
                        ctx.lineTo(player.x + 18, mouthY);
                        ctx.stroke();
                    }
                    break;
                    
                case 'surprised':
                    // O O - big eyes and O mouth
                    if (player.facing === 'right') {
                        // Bigger eyes
                        ctx.fillRect(player.x + 16, eyeY - 1, eyeSize + 2, eyeSize + 2);
                        ctx.fillRect(player.x + 24, eyeY - 1, eyeSize + 2, eyeSize + 2);
                        // O mouth
                        ctx.beginPath();
                        ctx.arc(player.x + 22, mouthY, 4, 0, Math.PI * 2);
                        ctx.stroke();
                    } else {
                        ctx.fillRect(player.x + 6, eyeY - 1, eyeSize + 2, eyeSize + 2);
                        ctx.fillRect(player.x + 14, eyeY - 1, eyeSize + 2, eyeSize + 2);
                        ctx.beginPath();
                        ctx.arc(player.x + 12, mouthY, 4, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    break;
                    
                case 'running':
                    // Running face - determined look with slight mouth
                    if (player.facing === 'right') {
                        ctx.fillRect(player.x + 22, mouthY, 6, 2);
                    } else {
                        ctx.fillRect(player.x + 10, mouthY, 6, 2);
                    }
                    break;
                    
                case 'sleepy':
                    // Sleepy face - half-closed eyes and zzz
                    if (player.facing === 'right') {
                        // Half-closed eyes (horizontal lines)
                        ctx.fillRect(player.x + 18, eyeY + 2, eyeSize, 1);
                        ctx.fillRect(player.x + 26, eyeY + 2, eyeSize, 1);
                        // Small line mouth
                        ctx.fillRect(player.x + 22, mouthY, 4, 1);
                    } else {
                        ctx.fillRect(player.x + 8, eyeY + 2, eyeSize, 1);
                        ctx.fillRect(player.x + 16, eyeY + 2, eyeSize, 1);
                        ctx.fillRect(player.x + 12, mouthY, 4, 1);
                    }
                    break;
                    
                case 'openMouth':
                    // Open mouth - wide open O
                    if (player.facing === 'right') {
                        ctx.beginPath();
                        ctx.arc(player.x + 22, mouthY, 6, 0, Math.PI * 2);
                        ctx.stroke();
                        // Fill inside
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.arc(player.x + 12, mouthY, 6, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.fill();
                    }
                    break;
                    
                case 'angry':
                    // Angry face - slanted eyes and > < mouth
                    if (player.facing === 'right') {
                        // Angry slanted eyes
                        ctx.fillRect(player.x + 17, eyeY - 1, 3, 6);
                        ctx.fillRect(player.x + 25, eyeY - 1, 3, 6);
                        // Angry mouth > <
                        ctx.beginPath();
                        ctx.moveTo(player.x + 18, mouthY + 3);
                        ctx.lineTo(player.x + 22, mouthY);
                        ctx.lineTo(player.x + 26, mouthY + 3);
                        ctx.stroke();
                    } else {
                        ctx.fillRect(player.x + 7, eyeY - 1, 3, 6);
                        ctx.fillRect(player.x + 15, eyeY - 1, 3, 6);
                        ctx.beginPath();
                        ctx.moveTo(player.x + 8, mouthY + 3);
                        ctx.lineTo(player.x + 12, mouthY);
                        ctx.lineTo(player.x + 16, mouthY + 3);
                        ctx.stroke();
                    }
                    break;
                    
                case 'normal':
                default:
                    // Normal face - just eyes, no mouth or small line
                    if (player.facing === 'right') {
                        ctx.fillRect(player.x + 22, mouthY, 4, 1);
                    } else {
                        ctx.fillRect(player.x + 12, mouthY, 4, 1);
                    }
                    break;
            }
        }

        ctx.restore();

        // Draw UI (score, lives, combo) - calculate score directly from player to avoid stale closure
        const currentScore = Math.floor(player.x / 10) + player.score;
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Score: ${currentScore}`, 10, 30);
        ctx.fillText(`Lives: ${player.lives}`, 10, 60);
        
        // Draw combo UI
        if (combo > 0) {
            ctx.fillStyle = '#FF6B00'; // Orange for combo
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`COMBO x${comboMultiplier}!`, 10, 100);
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.fillText(`${combo} coins`, 10, 120);
        }
    };

    /**
     * Create initial platforms
     */
    const createInitialPlatforms = (): Entity[] => {
        const platforms: Entity[] = [];

        // Starting platform
        platforms.push({
            id: generateId(),
            type: 'platform',
            x: 0,
            y: 450,
            width: 400,
            height: 50,
            velocityX: 0,
            velocityY: 0,
            active: true,
        });

        // Generate a few more platforms
        let lastX = 400;
        for (let i = 0; i < 5; i++) {
            const gap = 100 + Math.random() * 100;
            const width = 100 + Math.random() * 150;
            const y = 350 + Math.random() * 100;

            platforms.push({
                id: generateId(),
                type: 'platform',
                x: lastX + gap,
                y,
                width,
                height: 50,
                velocityX: 0,
                velocityY: 0,
                active: true,
            });

            lastX += gap + width;
        }

        return platforms;
    };

    /**
   * Generate next platform
   */
    const generateNextPlatform = (platforms: Entity[], coins: Item[], enemies: Enemy[], difficulty: number = 1) => {
        const lastPlatform = platforms[platforms.length - 1];

        // 30% chance to create a gap (no platform, just empty space - player must jump over)
        const createGap = Math.random() < 0.3;
        // 25% chance to create a moving platform
        const createMoving = !createGap && Math.random() < 0.25;

        if (createGap) {
            // Create a larger gap that requires a jump
            const gapWidth = 150 + Math.random() * 100;
            const nextX = lastPlatform.x + lastPlatform.width + gapWidth;
            const y = 300 + Math.random() * 150;
            const width = 100 + Math.random() * 100;

            platforms.push({
                id: generateId(),
                type: 'platform',
                x: nextX,
                y,
                width,
                height: 50,
                velocityX: 0,
                velocityY: 0,
                active: true,
            });

            // Add coins above this platform
            spawnCoinsNearPlatform(nextX, y, width, coins);
            // Spawn enemies on this platform (chance increases with difficulty)
            spawnEnemiesOnPlatform(nextX, y, width, enemies, difficulty);
        } else if (createMoving) {
            // Create a moving platform
            const gap = 80 + Math.random() * 120;
            const width = 100 + Math.random() * 100;
            const y = 300 + Math.random() * 150;
            const platformX = lastPlatform.x + lastPlatform.width + gap;
            
            // Decide movement type (70% horizontal, 30% vertical)
            const moveType = Math.random() < 0.7 ? 'horizontal' : 'vertical';
            // Scale move speed with difficulty
            const baseMoveSpeed = 1 + Math.random() * 1.5; // 1-2.5 base speed
            const moveSpeed = baseMoveSpeed * difficulty; // Scale with difficulty
            const moveRange = moveType === 'horizontal' ? 80 + Math.random() * 120 : 60 + Math.random() * 80;

            platforms.push({
                id: generateId(),
                type: 'platform',
                x: platformX,
                y,
                width,
                height: 50,
                velocityX: 0,
                velocityY: 0,
                active: true,
                isMoving: true,
                moveType,
                moveSpeed,
                moveRange,
                moveStartX: platformX,
                moveStartY: y,
                moveDirection: 1,
            });

            // Add coins above this platform
            spawnCoinsNearPlatform(platformX, y, width, coins);
            // Spawn enemies on this platform (chance increases with difficulty)
            spawnEnemiesOnPlatform(platformX, y, width, enemies, difficulty);
        } else {
            // Normal platform spacing
            const gap = 80 + Math.random() * 120;
            const width = 80 + Math.random() * 120;
            const y = 300 + Math.random() * 150;

            platforms.push({
                id: generateId(),
                type: 'platform',
                x: lastPlatform.x + lastPlatform.width + gap,
                y,
                width,
                height: 50,
                velocityX: 0,
                velocityY: 0,
                active: true,
            });

            // Add coins above this platform
            const platformX = lastPlatform.x + lastPlatform.width + gap;
            spawnCoinsNearPlatform(platformX, y, width, coins);
            // Spawn enemies on this platform (chance increases with difficulty)
            spawnEnemiesOnPlatform(platformX, y, width, enemies, difficulty);
        }
    };

    /**
     * Spawn coins near a platform
     */
    const spawnCoinsNearPlatform = (platformX: number, platformY: number, platformWidth: number, coins: Item[]) => {
        // 50% chance to spawn coins
        if (Math.random() > 0.5) return;

        const numCoins = 1 + Math.floor(Math.random() * 3); // 1-3 coins
        const spacing = platformWidth / (numCoins + 1);

        for (let i = 0; i < numCoins; i++) {
            const coinX = platformX + spacing * (i + 1) - 12;
            const coinY = platformY - 40 - Math.random() * 60; // Float above platform
            coins.push(new Item(coinX, coinY, 'coin'));
        }
    };

    /**
     * Spawn enemies on or near a platform
     */
    const spawnEnemiesOnPlatform = (platformX: number, platformY: number, platformWidth: number, enemies: Enemy[], difficulty: number = 1) => {
        // Base 30% chance, increases with difficulty (up to 70% at max difficulty)
        const baseChance = 0.3;
        const maxChance = 0.7;
        const spawnChance = baseChance + (maxChance - baseChance) * Math.min((difficulty - 1) / 2, 1);
        
        if (Math.random() > spawnChance) return;
        
        // Spawn more enemies as difficulty increases (1-3 enemies)
        const numEnemies = 1 + Math.floor(Math.random() * Math.min(2 + difficulty, 3));

        for (let i = 0; i < numEnemies; i++) {
            const enemyType = Math.random();
            const spacing = platformWidth / (numEnemies + 1);
            const enemyX = platformX + spacing * (i + 1) - 15;
            
            if (enemyType < 0.4) {
                // 40% chance: Goomba on platform
                enemies.push(new Enemy(enemyX, platformY - 28, 'goomba'));
            } else if (enemyType < 0.7) {
                // 30% chance: Flying enemy above platform
                const flyY = platformY - 100 - Math.random() * 50;
                enemies.push(new Enemy(enemyX, flyY, 'flying'));
            } else {
                // 30% chance: Ground enemy on platform
                enemies.push(new Enemy(enemyX, platformY - 30, 'ground'));
            }
        }
    };

    /**
     * Start/Restart game
     */
    const startGame = () => {
        // Reset all game state
        setGameOver(false);
        setScore(0);
        setLives(3);
        setCombo(0);
        setComboMultiplier(1);
        cameraXRef.current = 0;
        lastScoreRef.current = 0;
        lastCoinTimeRef.current = 0;
        
        // Clear game arrays
        platformsRef.current = [];
        coinsRef.current = [];
        enemiesRef.current = [];
        
        if (comboTimeoutRef.current) {
            clearTimeout(comboTimeoutRef.current);
            comboTimeoutRef.current = null;
        }

        // Increment restart key to force useEffect to re-run
        setRestartKey(prev => prev + 1);
        setGameStarted(true);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold mb-2">Endless Mario Platformer</h2>
                <p className="text-gray-600 text-sm">
                    Controls: Arrow Keys or WASD to move • Space to Jump • Shift to Run
                </p>
            </div>

            <div className="relative" style={{ width: GAME_CONFIG.WIDTH, height: GAME_CONFIG.HEIGHT }}>
                <canvas
                    ref={canvasRef}
                    width={GAME_CONFIG.WIDTH}
                    height={GAME_CONFIG.HEIGHT}
                    className="border-4 border-gray-800 rounded"
                />

                {!gameStarted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                        <button
                            onClick={startGame}
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg"
                        >
                            Start Game
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded">
                        <h3 className="text-white text-3xl font-bold mb-4">Game Over!</h3>
                        <p className="text-white text-xl mb-6">Final Score: {score}</p>
                        <button
                            onClick={startGame}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
