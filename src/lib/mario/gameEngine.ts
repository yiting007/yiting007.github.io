/**
 * FILE: src/lib/mario/gameEngine.ts
 * PURPOSE: Core game engine with physics, collision detection, and entity management for Mario game
 */

// Game configuration
export const GAME_CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    GRAVITY: 0.6,
    GROUND_Y: 500,
    FPS: 60,
} as const;

// Entity types
export type EntityType = 'player' | 'enemy' | 'platform' | 'item';

// Base entity interface
export interface Entity {
    id: string;
    type: EntityType;
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    active: boolean;
    // Moving platform properties (optional)
    isMoving?: boolean;
    moveType?: 'horizontal' | 'vertical';
    moveSpeed?: number;
    moveRange?: number;
    moveStartX?: number;
    moveStartY?: number;
    moveDirection?: 1 | -1; // 1 for positive direction, -1 for negative
}

// Collision result
export interface Collision {
    collided: boolean;
    side?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * AABB Collision Detection
 * Checks if two rectangular entities are colliding
 */
export function checkCollision(a: Entity, b: Entity): Collision {
    if (!a.active || !b.active) {
        return { collided: false };
    }

    const collided =
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

    if (!collided) {
        return { collided: false };
    }

    // Determine collision side based on overlap
    const overlapLeft = (a.x + a.width) - b.x;
    const overlapRight = (b.x + b.width) - a.x;
    const overlapTop = (a.y + a.height) - b.y;
    const overlapBottom = (b.y + b.height) - a.y;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    let side: 'top' | 'bottom' | 'left' | 'right';
    if (minOverlap === overlapTop) side = 'top';
    else if (minOverlap === overlapBottom) side = 'bottom';
    else if (minOverlap === overlapLeft) side = 'left';
    else side = 'right';

    return { collided: true, side };
}

/**
 * Apply physics to an entity
 */
export function applyPhysics(entity: Entity, onGround: boolean): void {
    // Apply gravity if not on ground
    if (!onGround) {
        entity.velocityY += GAME_CONFIG.GRAVITY;
    }

    // Update position based on velocity
    entity.x += entity.velocityX;
    entity.y += entity.velocityY;

    // Apply friction
    entity.velocityX *= 0.9;

    // Terminal velocity
    if (entity.velocityY > 15) {
        entity.velocityY = 15;
    }
}

/**
 * Check if entity is on ground
 */
export function isOnGround(entity: Entity, platforms: Entity[]): boolean {
    for (const platform of platforms) {
        if (!platform.active) continue;

        // Check if entity is standing on platform
        if (
            entity.y + entity.height >= platform.y &&
            entity.y + entity.height <= platform.y + 10 && // Small tolerance
            entity.x + entity.width > platform.x &&
            entity.x < platform.x + platform.width &&
            entity.velocityY >= 0
        ) {
            return true;
        }
    }

    // Check if on ground
    return entity.y + entity.height >= GAME_CONFIG.GROUND_Y;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

