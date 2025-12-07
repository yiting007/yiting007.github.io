/**
 * FILE: src/lib/mario/entities/Enemy.ts
 * PURPOSE: Enemy entities for Mario game (Goombas, flying enemies, etc.)
 */

import { Entity, GAME_CONFIG, generateId } from '../gameEngine';

export type EnemyType = 'goomba' | 'flying' | 'ground';

export class Enemy implements Entity {
    id: string;
    type: 'enemy' = 'enemy';
    x: number;
    y: number;
    width: number = 28;
    height: number = 28;
    velocityX: number = 0;
    velocityY: number = 0;
    active: boolean = true;

    // Enemy-specific properties
    enemyType: EnemyType;
    direction: -1 | 1 = -1; // -1 for left, 1 for right
    speed: number = 1.5;
    platformBound: boolean = false; // Whether enemy is bound to a platform
    platformId?: string; // ID of platform enemy is on
    startY?: number; // Starting Y position for flying enemies
    flyRange?: number; // Vertical range for flying enemies
    flyDirection: -1 | 1 = -1; // Vertical direction for flying enemies

    constructor(x: number, y: number, enemyType: EnemyType = 'goomba') {
        this.id = generateId();
        this.x = x;
        this.y = y;
        this.enemyType = enemyType;
        
        // Set properties based on enemy type
        if (enemyType === 'goomba') {
            this.width = 28;
            this.height = 28;
            this.speed = 1.5;
            this.direction = Math.random() > 0.5 ? 1 : -1;
        } else if (enemyType === 'flying') {
            this.width = 24;
            this.height = 24;
            this.speed = 2;
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.startY = y;
            this.flyRange = 80 + Math.random() * 60; // 80-140 pixel range
            this.flyDirection = -1;
        } else if (enemyType === 'ground') {
            this.width = 30;
            this.height = 30;
            this.speed = 2;
            this.direction = Math.random() > 0.5 ? 1 : -1;
        }
    }

    /**
     * Update enemy movement
     */
    update(platforms: Entity[], deltaTime: number): void {
        if (!this.active) return;

        if (this.enemyType === 'goomba') {
            this.updateGoomba(platforms);
        } else if (this.enemyType === 'flying') {
            this.updateFlying(deltaTime);
        } else if (this.enemyType === 'ground') {
            this.updateGround(platforms);
        }

        // Apply gravity to ground-based enemies
        if (this.enemyType === 'goomba' || this.enemyType === 'ground') {
            this.velocityY += GAME_CONFIG.GRAVITY * 0.8; // Slightly slower fall
            this.y += this.velocityY;
        }
    }

    /**
     * Update Goomba movement (walks on platforms, falls off edges)
     */
    private updateGoomba(platforms: Entity[]): void {
        // Move horizontally
        this.x += this.speed * this.direction;

        // Check if on a platform
        let onPlatform = false;
        let platformY = 0;
        
        for (const platform of platforms) {
            if (!platform.active) continue;
            
            // Check if standing on platform
            if (
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + 10 &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.velocityY >= 0
            ) {
                onPlatform = true;
                platformY = platform.y;
                this.platformId = platform.id;
                this.velocityY = 0;
                this.y = platform.y - this.height;
                break;
            }
        }

        // Check if on ground
        if (!onPlatform && this.y + this.height >= GAME_CONFIG.GROUND_Y) {
            onPlatform = true;
            platformY = GAME_CONFIG.GROUND_Y;
            this.velocityY = 0;
            this.y = GAME_CONFIG.GROUND_Y - this.height;
        }

        // If not on platform, apply gravity
        if (!onPlatform) {
            // Already applied in update()
        } else {
            // Check if at edge of platform - reverse direction
            let atEdge = false;
            for (const platform of platforms) {
                if (platform.id === this.platformId) {
                    const leftEdge = platform.x;
                    const rightEdge = platform.x + platform.width;
                    
                    // Check if at left edge moving left
                    if (this.direction === -1 && this.x <= leftEdge) {
                        atEdge = true;
                        this.direction = 1;
                    }
                    // Check if at right edge moving right
                    else if (this.direction === 1 && this.x + this.width >= rightEdge) {
                        atEdge = true;
                        this.direction = -1;
                    }
                    break;
                }
            }
        }
    }

    /**
     * Update flying enemy movement (flies in a pattern)
     */
    private updateFlying(deltaTime: number): void {
        if (!this.startY) return;

        // Move horizontally (deltaTime normalized for 60fps)
        const normalizedDelta = deltaTime / 16.67; // Normalize to 60fps
        this.x += this.speed * this.direction * normalizedDelta;

        // Move vertically in a pattern
        this.y += this.flyDirection * 1.2 * normalizedDelta;

        // Reverse vertical direction at boundaries
        if (this.y <= this.startY - (this.flyRange || 0)) {
            this.flyDirection = 1;
        } else if (this.y >= this.startY + (this.flyRange || 0)) {
            this.flyDirection = -1;
        }
    }

    /**
     * Update ground enemy movement (similar to Goomba but faster)
     */
    private updateGround(platforms: Entity[]): void {
        // Similar to Goomba but with different behavior
        this.x += this.speed * this.direction;

        // Check if on a platform
        let onPlatform = false;
        
        for (const platform of platforms) {
            if (!platform.active) continue;
            
            if (
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + 10 &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.velocityY >= 0
            ) {
                onPlatform = true;
                this.platformId = platform.id;
                this.velocityY = 0;
                this.y = platform.y - this.height;
                
                // Check edges
                const leftEdge = platform.x;
                const rightEdge = platform.x + platform.width;
                
                if (this.direction === -1 && this.x <= leftEdge) {
                    this.direction = 1;
                } else if (this.direction === 1 && this.x + this.width >= rightEdge) {
                    this.direction = -1;
                }
                break;
            }
        }

        if (!onPlatform && this.y + this.height >= GAME_CONFIG.GROUND_Y) {
            onPlatform = true;
            this.velocityY = 0;
            this.y = GAME_CONFIG.GROUND_Y - this.height;
        }
    }

    /**
     * Check if enemy should be stomped (player jumps on top)
     */
    isStomped(playerY: number, playerHeight: number, playerVelocityY: number): boolean {
        // Player must be falling and above the enemy
        if (playerVelocityY <= 0) return false;
        
        // Check if player's bottom is hitting enemy's top
        const playerBottom = playerY + playerHeight;
        const enemyTop = this.y;
        
        return playerBottom >= enemyTop && playerBottom <= enemyTop + 10;
    }

    /**
     * Stomp this enemy (deactivate it)
     */
    stomp(): void {
        this.active = false;
    }
}

