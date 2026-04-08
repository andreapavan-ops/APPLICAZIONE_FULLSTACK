const API_URL = "http://localhost:3000";

// Riferimenti agli elementi HTML
const listaUtenti    = document.getElementById("lista-utenti");
const listaPost      = document.getElementById("lista-post");
const titoloPost     = document.getElementById("titolo-post");
const listaCommenti  = document.getElementById("lista-commenti");
const titoloCommenti = document.getElementById("titolo-commenti");

// Tiene traccia della riga selezionata in ciascuna colonna
let rigaUtenteAttiva = null;
let rigaPostAttiva   = null;

function mostraErrore(messaggio) {
    const divErrore = document.getElementById ("errore")
    if (divErrore) {
        divErrore.textContent = messaggio
    }

}


async function fetchJSON(url) {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (errore) {
    mostraErrore("Impossibile connettersi al server. Avvia il backend!");
    return null;
    }
}




// ============================================================
// Livello 1 — Carica e mostra la lista degli utenti
// ============================================================

// Non possiamo usare await fuori da una funzione async,
// quindi avvolgiamo il codice iniziale in una funzione e la chiamiamo subito
async function init() {
    const data = await fetchJSON(`${API_URL}/api/utenti`);
    if (!data) return;

    data.forEach(utente => {
        const div = document.createElement("div");
        div.className = "riga";
        div.innerHTML = `
            <div class="nome">${utente.nome}</div>
            <div class="dettaglio">${utente.citta}</div>
        `;
        div.addEventListener("click", () => {
            if (rigaUtenteAttiva) rigaUtenteAttiva.classList.remove("attivo");
            div.classList.add("attivo");
            rigaUtenteAttiva = div;

            caricaPost(utente.id, utente.nome);
        });
        listaUtenti.appendChild(div);
    });
}

// ============================================================
// Livello 2 — Carica e mostra i post di un utente
// ============================================================

async function caricaPost(userId, nomeUtente) {
    titoloPost.textContent = `Post di ${nomeUtente}`;
    listaPost.innerHTML = "";

    // Resettiamo la colonna commenti
    titoloCommenti.textContent = "Commenti";
    listaCommenti.innerHTML = `<p class="placeholder">Seleziona un post</p>`;
    rigaPostAttiva = null;

    const data = await fetchJSON(`${API_URL}/api/post?userId=${userId}`);
    if (!data) return;

    data.forEach(post => {
        const div = document.createElement("div");
        div.className = "riga";
        div.innerHTML = `<div class="nome">${post.titolo}</div>`;
        div.addEventListener("click", () => {
            if (rigaPostAttiva) rigaPostAttiva.classList.remove("attivo");
            div.classList.add("attivo");
            rigaPostAttiva = div;

            caricaCommenti(post.id);
        });
        listaPost.appendChild(div);
    });
}

// ============================================================
// Livello 3 — Carica e mostra i commenti di un post
// ============================================================

async function caricaCommenti(postId) {
    titoloCommenti.textContent = "Commenti";
    listaCommenti.innerHTML = "";

    const data = await fetchJSON(`${API_URL}/api/commenti?postId=${postId}`);
    if (!data) return;

    data.forEach(commento => {
        const div = document.createElement("div");
        div.className = "riga";
        div.innerHTML = `
            <div class="autore">${commento.nome}</div>
            <div class="testo">${commento.corpo}</div>
        `;
        listaCommenti.appendChild(div);
    });
}

// Avviamo l'app
init();
