/**
 * FILE: src/data/projects.ts
 * PURPOSE: Centralized data source for all projects displayed on the portfolio. Defines the schema and content for project cards.
 * OPTIMIZATION:
 *  - Currently hardcoded. Moving this to a headless CMS (like Contentful or Sanity) would allow for easier content updates without code changes.
 *  - Types could be strictly validated using Zod at runtime if data comes from an external API.
 */
export interface Project {
    id: string;
    name: string;
    description: string;
    src: string;
    url: string;
    pageType?: 'static' | 'dynamic' | 'redirect'; // Optional tag for internal logic
    era: 'modern' | 'classic'; // New field for categorization
}

export const projects: Project[] = [
    {
        id: '2048',
        name: '2048',
        description: 'A clone of the popular 2048 game built with React and Tailwind CSS.',
        src: '/images/2048-cover.png',
        url: '/projects/2048',
        pageType: 'dynamic',
        era: 'modern'
    },
    {
        id: 'single-div-css',
        name: 'Single Div CSS',
        description: 'A collection of CSS art created with a single div.',
        src: '/images/singleDiv.eafadc85.png',
        url: '/projects/single-div-css',
        pageType: 'dynamic',
        era: 'classic'
    },
    {
        id: 'game-of-life',
        name: 'Game of Life',
        description: 'A React implementation of Conway\'s Game of Life.',
        src: '/images/gameOfLife.d15d16e6.png',
        url: '/projects/game-of-life',
        pageType: 'dynamic',
        era: 'classic'
    },
    {
        id: 'java-3d-engine',
        name: 'Java 3D Engine',
        description: 'Running in browser via CheerpJ',
        src: '/images/3dEngine.b69870fc.png',
        url: '/projects/java-3d-engine',
        pageType: 'dynamic',
        era: 'classic'
    },
    {
        id: 'five-chess',
        name: 'Five Chess Game Simulator & AI',
        description: '',
        src: '/images/5ChessGame.23a0a800.png',
        url: 'https://github.com/yiting007/Five-Chess-Game-Simulator-AI',
        pageType: 'redirect',
        era: 'classic'
    },
    {
        id: 'arduino',
        name: 'Golang & Arduino',
        description: '',
        src: '/images/arduinoRun.cdd4c83f.png',
        url: '/projects/arduino',
        pageType: 'dynamic',
        era: 'classic'
    }
];
