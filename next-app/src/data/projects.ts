export interface Project {
    id: string;
    name: string;
    src: string;
    url: string;
    description: string;
}

export const projects: Project[] = [
    {
        id: "photo-1",
        name: "Single Div CSS",
        src: "/images/singleDiv.eafadc85.png",
        url: "https://github.com/yiting007/singleDiv/blob/master/README.md",
        description: "",
    },
    {
        id: "photo-2",
        name: "Date Range Picker",
        src: "/images/dateRangePicker.e0c67dbf.png",
        url: "/projects/angular-date-picker", // Updated to local route
        description: "An AngularJS directive",
    },
    {
        id: "photo-3",
        name: "Game of Life",
        src: "/images/gameOfLife.d15d16e6.png",
        url: "/projects/game-of-life", // Updated to local route
        description: "",
    },
    {
        id: "photo-4",
        name: "Java 3D Engine",
        src: "/images/3dEngine.b69870fc.png",
        url: "https://github.com/yiting007/myJava3D",
        description: "",
    },
    {
        id: "photo-5",
        name: "Five Chess Game Simulator & AI",
        src: "/images/5ChessGame.23a0a800.png",
        url: "https://github.com/yiting007/QI_Plantform",
        description: "",
    },
    {
        id: "photo-6",
        name: "Sudoku Solver",
        src: "/images/sudokuSolver.1e4c896e.png",
        url: "/projects/sudoku", // Updated to local route
        description: "",
    },
    {
        id: "photo-7",
        name: "Golang & Arduino",
        src: "/images/arduinoGo.2b2489f6.gif",
        url: "/projects/arduino", // Updated to local route
        description: "",
    },
    {
        id: "photo-8",
        name: "Digit Recognition",
        src: "/images/digitRec.eda0a436.png",
        url: "/projects/digit", // Updated to local route
        description: "",
    },
];
