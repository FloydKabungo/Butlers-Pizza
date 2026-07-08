const suburbs = [
    { name: "Rondebosch", branch: "Rondebosch" },
    { name: "Rosebank", branch: "Rondebosch" },
    { name: "Mowbray", branch: "Rondebosch" },
    { name: "Observatory", branch: "Rondebosch" },

    { name: "Newlands", branch: "Newlands" },
    { name: "Claremont", branch: "Newlands" },
    { name: "Bishopscourt", branch: "Newlands" },
    { name: "Fernwood", branch: "Newlands" },

    { name: "Wynberg", branch: "Wynberg" },
    { name: "Kenilworth", branch: "Wynberg" },
    { name: "Plumstead", branch: "Wynberg" },
    { name: "Diep River", branch: "Wynberg" },
    { name: "Constantia", branch: "Wynberg" },
    { name: "Tokai", branch: "Wynberg" },
    { name: "Bergvliet", branch: "Wynberg" },
    { name: "Retreat", branch: "Wynberg" },

    { name: "City Bowl", branch: "City Bowl" },
    { name: "Cape Town CBD", branch: "City Bowl" },
    { name: "Gardens", branch: "City Bowl" },
    { name: "Vredehoek", branch: "City Bowl" },
    { name: "Oranjezicht", branch: "City Bowl" },
    { name: "Woodstock", branch: "City Bowl" },
    { name: "Salt River", branch: "City Bowl" },
    { name: "Sea Point", branch: "City Bowl" },
    { name: "Green Point", branch: "City Bowl" },

    { name: "Bellville", branch: "Bellville" },
    { name: "Durbanville", branch: "Bellville" },
    { name: "Parow", branch: "Bellville" },
    { name: "Goodwood", branch: "Bellville" },
    { name: "Tyger Valley", branch: "Bellville" },
    { name: "Brackenfell", branch: "Bellville" },
    { name: "Kuils River", branch: "Bellville" },

    { name: "Table View", branch: "Table View" },
    { name: "Blouberg", branch: "Table View" },
    { name: "Bloubergstrand", branch: "Table View" },
    { name: "Parklands", branch: "Table View" },
    { name: "Portlands", branch: "Table View" },
    { name: "Sunningdale", branch: "Table View" },
    { name: "West Beach", branch: "Table View" },
    { name: "Big Bay", branch: "Table View" },
    { name: "Milnerton", branch: "Table View" },
    { name: "Century City", branch: "Table View" },
    { name: "Bothasig", branch: "Table View" },
    { name: "Edgemead", branch: "Table View" }
];

const branchPhones = {
    "Rondebosch": "021 686 9007",
    "Newlands": "021 686 3333",
    "Wynberg": "021 797 9980",
    "City Bowl": "021 462 3344",
    "Bellville": "021 948 8888",
    "Table View": "021 557 8899"
};

const input = document.getElementById("suburbInput");
const suggestionsBox = document.getElementById("suburbSuggestions");
const resultBox = document.getElementById("branchResult");
const form = document.getElementById("branchSearchForm");

function normalise(text) {
    return text.toLowerCase().trim();
}

function showSuggestions(value) {
    const search = normalise(value);

    suggestionsBox.innerHTML = "";

    if (search.length < 1) {
        suggestionsBox.style.display = "none";
        return;
    }

    const matches = suburbs
        .filter(item => normalise(item.name).startsWith(search))
        .slice(0, 6);

    if (matches.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    matches.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${item.name} → ${item.branch}`;

        button.addEventListener("click", () => {
            input.value = item.name;
            suggestionsBox.style.display = "none";
            findBranch(item.name);
        });

        suggestionsBox.appendChild(button);
    });

    suggestionsBox.style.display = "block";
}

function findBranch(value) {
    const search = normalise(value);

    if (!search) {
        resultBox.innerHTML = "Please enter a Cape Town suburb.";
        return;
    }

    let match = suburbs.find(item => normalise(item.name) === search);

    if (!match) {
        match = suburbs.find(item => normalise(item.name).startsWith(search));
    }

    if (!match) {
        match = suburbs.find(item => normalise(item.name).includes(search));
    }

    if (!match) {
        resultBox.innerHTML = `
            We could not find that suburb yet.<br>
            Try another nearby Cape Town suburb.
        `;
        clearBranchHighlights();
        return;
    }

    const phone = branchPhones[match.branch];

    resultBox.innerHTML = `
        Nearest branch for <strong>${match.name}</strong>:<br>
        <strong>${match.branch}</strong><br>
        Call: ${phone}
    `;

    highlightBranch(match.branch);
}

function clearBranchHighlights() {
    document.querySelectorAll(".loc-card").forEach(card => {
        card.classList.remove("branch-match");
    });
}

function highlightBranch(branchName) {
    clearBranchHighlights();

    document.querySelectorAll(".loc-card").forEach(card => {
        const title = card.querySelector("h3");

        if (title && normalise(title.textContent) === normalise(branchName)) {
            card.classList.add("branch-match");
            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
}

input.addEventListener("input", () => {
    showSuggestions(input.value);
});

form.addEventListener("submit", event => {
    event.preventDefault();
    suggestionsBox.style.display = "none";
    findBranch(input.value);
});

document.addEventListener("click", event => {
    if (!event.target.closest(".branch-search")) {
        suggestionsBox.style.display = "none";
    }
});