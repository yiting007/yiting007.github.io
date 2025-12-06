export interface Project {
    id: string;
    name: string;
    src: string;
    url: string;
    description: string;
    pageType: 'static' | 'dynamic' | 'redirect';
}

export const projects: Project[] = [
    {
        id: 'single-div-css',
        name: 'Single Div CSS',
        description: 'A collection of CSS art created with a single div.',
        url: '/projects/single-div-css',
        src: '/images/singleDiv.eafadc85.png',
        pageType: 'dynamic'
    },
    {
        id: "game-of-life",
        name: "Game of Life",
        src: "/images/gameOfLife.d15d16e6.png",
        url: "/projects/game-of-life", // Updated to local route
        description: "",
        pageType: "dynamic",
    },
    {
        id: "java-3d-engine",
        name: "Java 3D Engine",
        src: "/images/3dEngine.b69870fc.png",
        url: "/projects/java-3d-engine",
        description: "Running in browser via CheerpJ",
        pageType: "dynamic",
    },
    {
        id: "five-chess-game",
        name: "Five Chess Game Simulator & AI",
        src: "/images/5ChessGame.23a0a800.png",
        url: "https://github.com/yiting007/QI_Plantform",
        description: "",
        pageType: "redirect",
    },
    {
        id: "golang-arduino",
        name: "Golang & Arduino",
        src: "/images/arduinoGo.2b2489f6.gif",
        url: "/projects/arduino", // Updated to local route
        description: "",
        pageType: "static",
    },
];
