/**
 * FILE: src/lib/mario/entities/Item.ts
 * PURPOSE: Collectible items (coins, power-ups) for Mario game
 */

import { Entity, generateId } from '../gameEngine';

export type ItemType = 'coin' | 'powerup';

export class Item implements Entity {
    id: string;
    type: 'item' = 'item';
    x: number;
    y: number;
    width: number = 24;
    height: number = 24;
    velocityX: number = 0;
    velocityY: number = 0;
    active: boolean = true;

    // Item-specific properties
    itemType: ItemType;
    value: number;

    constructor(x: number, y: number, itemType: ItemType = 'coin') {
        this.id = generateId();
        this.x = x;
        this.y = y;
        this.itemType = itemType;
        this.value = itemType === 'coin' ? 100 : 0;
    }

    /**
     * Collect this item
     */
    collect(): number {
        this.active = false;
        return this.value;
    }
}

