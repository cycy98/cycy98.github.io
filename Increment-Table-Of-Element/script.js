/* General Styling */
body {
    font-family: Arial, sans-serif;
    background-color: #111;
    color: #fff;
    margin: 0;
    padding: 0;
}

header nav {
    display: flex;
    justify-content: space-around;
    background-color: #222;
    padding: 10px;
}

header nav button {
    background: #333;
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
}

header nav button:hover {
    background: #555;
}

.tab-content {
    display: none;
    padding: 20px;
}

.tab-content.active {
    display: block;
}

#generator table {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
}

#generator th, #generator td {
    border: 1px solid #444;
    padding: 8px;
    text-align: center;
}

#periodic-table-container {
    display: grid;
    grid-template-columns: repeat(18, 40px);
    gap: 5px;
    justify-content: center;
}

.element {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #555;
    background-color: #333;
    color: #fff;
    cursor: default;
}

.element.unlocked {
    background-color: #0f0;
}
