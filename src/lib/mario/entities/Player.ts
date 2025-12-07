/**
 * FILE: src/lib/mario/entities/Player.ts
 * PURPOSE: Player character with controls, physics, and state management for Mario game
 */

import { Entity, GAME_CONFIG } from '../gameEngine';

export type PlayerState = 'idle' | 'running' | 'jumping' | 'dead';
export type FaceExpression = 'normal' | 'jumping' | 'happy' | 'surprised' | 'running' | 'dead' | 'sleepy' | 'openMouth' | 'angry';

export class Player implements Entity {
    id: string;
    type: 'player' = 'player';
    x: number;
    y: number;
    width: number = 32;
    height: number = 48;
    velocityX: number = 0;
    velocityY: number = 0;
    active: boolean = true;

    // Player-specific properties
    state: PlayerState = 'idle';
    lives: number = 3;
    score: number = 0;
    canJump: boolean = true;
    facing: 'left' | 'right' = 'right';
    faceExpression: FaceExpression = 'normal';
    faceExpressionTimer: number = 0; // Timer to reset face expression
    idleFaceTimer: number = 0; // Timer for random idle faces
    lastIdleFaceChange: number = 0; // Time of last idle face change
    
    // Failed jump tracking
    jumpAttempts: number = 0; // Count of jump attempts near a platform
    lastJumpPlatformX: number = -1; // X position of platform when last jump was attempted
    lastJumpPlatformY: number = -1; // Y position of platform when last jump was attempted
    lastJumpX: number = 0; // Player X when last jump was attempted
    lastJumpY: number = 0; // Player Y when last jump was attempted
    failedJumpTimer: number = 0; // Timer to reset failed jump tracking

    // Movement constants (base values, can be scaled with difficulty)
    private baseWalkSpeed = 4;
    private baseRunSpeed = 7;
    private baseJumpPower = -12;
    private readonly AIR_CONTROL = 0.5;
    
    // Current speeds (scaled by difficulty)
    get WALK_SPEED(): number { return this.baseWalkSpeed; }
    get RUN_SPEED(): number { return this.baseRunSpeed; }
    get JUMP_POWER(): number { return this.baseJumpPower; }
    
    /**
     * Set movement speeds based on difficulty multiplier
     */
    setDifficulty(multiplier: number): void {
        this.baseWalkSpeed = 4 * multiplier;
        this.baseRunSpeed = 7 * multiplier;
        this.baseJumpPower = -12 * multiplier;
    }

    constructor(x: number, y: number) {
        this.id = 'player';
        this.x = x;
        this.y = y;
    }

    /**
     * Handle movement input
     */
    move(keys: { left: boolean; right: boolean; run: boolean }, onGround: boolean): void {
        if (this.state === 'dead') return;

        const speed = keys.run ? this.baseRunSpeed : this.baseWalkSpeed;
        const control = onGround ? 1 : this.AIR_CONTROL;

        if (keys.left) {
            this.velocityX = -speed * control;
            this.facing = 'left';
            this.state = onGround ? 'running' : 'jumping';
            // Reset idle face timer when moving
            if (this.state === 'running') {
                this.idleFaceTimer = 0;
                this.lastIdleFaceChange = 0;
            }
        } else if (keys.right) {
            this.velocityX = speed * control;
            this.facing = 'right';
            this.state = onGround ? 'running' : 'jumping';
            // Reset idle face timer when moving
            if (this.state === 'running') {
                this.idleFaceTimer = 0;
                this.lastIdleFaceChange = 0;
            }
        } else {
            if (onGround) {
                this.state = 'idle';
            }
        }
    }

    /**
     * Handle jump input
     */
    jump(keys: { jump: boolean }, onGround: boolean, nearbyPlatform?: { x: number; y: number } | null): void {
        if (this.state === 'dead') return;

        if (keys.jump && onGround && this.canJump) {
            this.velocityY = this.baseJumpPower;
            this.canJump = false;
            this.state = 'jumping';
            this.setFaceExpression('jumping', 300); // Show jumping face for 300ms
            
            // Track jump attempt if near a platform
            if (nearbyPlatform) {
                const platformDistance = Math.abs(this.x - nearbyPlatform.x);
                if (platformDistance < 200) { // Within 200 pixels
                    if (this.lastJumpPlatformX === nearbyPlatform.x && 
                        this.lastJumpPlatformY === nearbyPlatform.y) {
                        // Same platform, increment attempts
                        this.jumpAttempts++;
                    } else {
                        // New platform, reset counter
                        this.jumpAttempts = 1;
                        this.lastJumpPlatformX = nearbyPlatform.x;
                        this.lastJumpPlatformY = nearbyPlatform.y;
                    }
                    this.lastJumpX = this.x;
                    this.lastJumpY = this.y;
                    this.failedJumpTimer = 3000; // 3 seconds to land on platform
                }
            }
        }

        // Reset jump when key released
        if (!keys.jump) {
            this.canJump = true;
        }

        // Variable jump height (release early = shorter jump)
        if (!keys.jump && this.velocityY < 0) {
            this.velocityY *= 0.5;
        }
    }
    
    /**
     * Check if player successfully landed on a platform after jump attempt
     */
    checkJumpSuccess(platforms: Array<{ x: number; y: number; width: number; height: number }>): void {
        if (this.jumpAttempts === 0) return;
        
        // Check if player is standing on the target platform
        for (const platform of platforms) {
            if (Math.abs(platform.x - this.lastJumpPlatformX) < 10 &&
                Math.abs(platform.y - this.lastJumpPlatformY) < 10) {
                // Check if player is on top of this platform
                if (this.y + this.height >= platform.y &&
                    this.y + this.height <= platform.y + 10 &&
                    this.x + this.width > platform.x &&
                    this.x < platform.x + platform.width &&
                    this.velocityY >= 0) {
                    // Successfully landed, reset counter
                    this.jumpAttempts = 0;
                    this.failedJumpTimer = 0;
                    return;
                }
            }
        }
    }
    
    /**
     * Set face expression with optional duration
     */
    setFaceExpression(expression: FaceExpression, duration: number = 0): void {
        this.faceExpression = expression;
        if (duration > 0) {
            this.faceExpressionTimer = duration;
        }
    }
    
    /**
     * Update face expression timer (call this every frame)
     */
    updateFaceExpression(deltaTime: number): void {
        // Update failed jump timer
        if (this.failedJumpTimer > 0) {
            this.failedJumpTimer -= deltaTime;
            if (this.failedJumpTimer <= 0) {
                // Timeout - failed to land, check if should show angry
                if (this.jumpAttempts >= 3) {
                    this.setFaceExpression('angry', 2000); // Show angry for 2 seconds
                }
                // Reset after showing angry
                this.jumpAttempts = 0;
            }
        }
        
        // Check for angry face from failed jumps
        if (this.jumpAttempts >= 3 && this.failedJumpTimer > 0) {
            this.setFaceExpression('angry', 2000);
        }
        
        if (this.faceExpressionTimer > 0) {
            this.faceExpressionTimer -= deltaTime;
            if (this.faceExpressionTimer <= 0) {
                // Reset to normal or based on state
                if (this.state === 'dead') {
                    this.faceExpression = 'dead';
                } else if (this.state === 'jumping') {
                    this.faceExpression = 'jumping';
                } else {
                    this.faceExpression = 'normal';
                }
            }
        } else {
            // Auto-update based on state if no timer
            if (this.state === 'dead') {
                this.faceExpression = 'dead';
            } else if (this.jumpAttempts >= 3 && this.failedJumpTimer > 0) {
                // Show angry if failed jumps
                this.faceExpression = 'angry';
            } else if (this.state === 'jumping' && this.faceExpression !== 'happy' && this.faceExpression !== 'angry') {
                this.faceExpression = 'jumping';
            } else if (this.state === 'running' && this.faceExpression !== 'happy' && this.faceExpression !== 'angry') {
                this.faceExpression = 'running';
            } else if (this.state === 'idle') {
                // Handle random idle faces
                this.idleFaceTimer += deltaTime;
                
                // Change idle face every 2-4 seconds
                if (this.idleFaceTimer - this.lastIdleFaceChange > 2000 + Math.random() * 2000) {
                    const idleFaces: FaceExpression[] = ['normal', 'sleepy', 'openMouth'];
                    const randomFace = idleFaces[Math.floor(Math.random() * idleFaces.length)];
                    this.faceExpression = randomFace;
                    this.lastIdleFaceChange = this.idleFaceTimer;
                    // Show for 1-2 seconds
                    this.faceExpressionTimer = 1000 + Math.random() * 1000;
                } else if (this.faceExpression !== 'happy' && this.faceExpression !== 'angry' && 
                          this.faceExpression !== 'sleepy' && this.faceExpression !== 'openMouth') {
                    // Keep current idle face or set to normal
                    if (this.faceExpressionTimer <= 0) {
                        this.faceExpression = 'normal';
                    }
                }
            }
        }
    }

    /**
     * Take damage
     */
    takeDamage(): void {
        if (this.state === 'dead') return;

        this.lives--;
        if (this.lives <= 0) {
            this.die();
        } else {
            // Knockback
            this.velocityY = -8;
            this.setFaceExpression('surprised', 400); // Show surprised face when taking damage
        }
    }

    /**
     * Die
     */
    die(): void {
        this.state = 'dead';
        this.velocityY = -10;
    }

    /**
     * Add score
     */
    addScore(points: number): void {
        this.score += points;
        // Show happy face when collecting coins
        this.setFaceExpression('happy', 500); // Show happy face for 500ms
    }

    /**
     * Reset player position
     */
    respawn(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.state = 'idle';
        this.lives = 3;
        this.score = 0;
        this.faceExpression = 'normal';
        this.faceExpressionTimer = 0;
        this.idleFaceTimer = 0;
        this.lastIdleFaceChange = 0;
        this.jumpAttempts = 0;
        this.lastJumpPlatformX = -1;
        this.lastJumpPlatformY = -1;
        this.failedJumpTimer = 0;
    }
}

