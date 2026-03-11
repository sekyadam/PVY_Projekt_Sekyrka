// velikost mapy
const SIZE = 20;

//model mapy (2D pole)
let mapData = [];

// DOM prvky
const grid = document.getElementById("grid");
const menu = document.getElementById("menu");
const editor = document.getElementById("editor");
const newMapBtn = document.getElementById("newMapBtn");
const loadMapBtn = document.getElementById("loadMapBtn");
const saveBtn = document.getElementById("saveBtn");
const backBtn = document.getElementById("backBtn");
const savedMapsDiv = document.getElementById("savedMaps");
const mapList = document.getElementById("mapList");

// vytvoření prázdné mapy
function createEmptyMap() {
    mapData = [];
    for (let y = 0; y < SIZE; y++) {
        const row = [];
        for (let x = 0; x < SIZE; x++) {
            row.push("grass"); // výchozí typ
        }
        mapData.push(row);
    }
}

// vykreslení gridu
function renderGrid() {
    grid.innerHTML = "";

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {

            const cell = document.createElement("div");
            cell.classList.add("cell", mapData[y][x]);
            cell.dataset.x = x;
            cell.dataset.y = y;

            grid.appendChild(cell);
        }
    }
}

// přepínání typu políčka
function cycleType(type) {
    // jednoduché přepínání – pozn.: student-level
    if (type === "grass") return "road";
    if (type === "road") return "water";
    return "grass";
}

// kliknutí na grid (event delegation)
grid.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) return;

    const x = e.target.dataset.x;
    const y = e.target.dataset.y;

    const current = mapData[y][x];
    const next = cycleType(current);

    mapData[y][x] = next; // aktualizace dat
    e.target.className = "cell " + next; // aktualizace DOM
});

// přepnutí do editoru
newMapBtn.addEventListener("click", () => {
    createEmptyMap();
    renderGrid();
    menu.classList.add("hidden");
    editor.classList.remove("hidden");
});

// zpět do menu
backBtn.addEventListener("click", () => {
    editor.classList.add("hidden");
    menu.classList.remove("hidden");
});

// ukládání mapy
saveBtn.addEventListener("click", () => {
    const name = prompt("Zadej název mapy:");
    if (!name) return;

    localStorage.setItem("map_" + name, JSON.stringify(mapData));
    alert("Mapa uložena.");
});

// načítání map
loadMapBtn.addEventListener("click", () => {
    savedMapsDiv.classList.remove("hidden");
    mapList.innerHTML = "";

    for (let key in localStorage) {
        if (key.startsWith("map_")) {
            const li = document.createElement("li");
            const mapName = key.replace("map_", "");

            li.textContent = mapName;
            li.style.cursor = "pointer";

            li.addEventListener("click", () => {
                const data = JSON.parse(localStorage.getItem(key));
                mapData = data;
                renderGrid();
                menu.classList.add("hidden");
                editor.classList.remove("hidden");
            });

            mapList.appendChild(li);
        }
    }
});
