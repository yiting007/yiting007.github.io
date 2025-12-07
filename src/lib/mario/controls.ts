/**
 * FILE: src/lib/mario/controls.ts
 * PURPOSE: Keyboard input handling for Mario game controls
 */

export interface KeyState {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jump: boolean;
    run: boolean;
}

export class Controls {
    private keys: KeyState = {
        left: false,
        right: false,
        up: false,
        down: false,
        jump: false,
        run: false,
    };

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    attach(): void {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    detach(): void {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    private handleKeyDown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right = true;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.keys.up = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.keys.down = true;
                break;
            case ' ':
                e.preventDefault(); // Prevent page scroll
                this.keys.jump = true;
                break;
            case 'Shift':
                this.keys.run = true;
                break;
        }
    }

    private handleKeyUp(e: KeyboardEvent): void {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right = false;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.keys.up = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.keys.down = false;
                break;
            case ' ':
                this.keys.jump = false;
                break;
            case 'Shift':
                this.keys.run = false;
                break;
        }
    }

    getState(): KeyState {
        return { ...this.keys };
    }

    reset(): void {
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            run: false,
        };
    }
}

