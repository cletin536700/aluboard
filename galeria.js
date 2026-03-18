import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlv14QREYv_qOFquKCJvorGlLOEqfpmTE",
  authDomain: "aluboard.firebaseapp.com",
  projectId: "aluboard",
  storageBucket: "aluboard.appspot.com",
  messagingSenderId: "582046047061",
  appId: "1:582046047061:web:bbdfb59676475e2441eddc"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const sala = params.get("sala");

document.getElementById("tituloSala").innerText = "Sala " + sala;

const galeria = document.getElementById("galeria");
let imagens = [];
let indiceAtual = 0;

async function carregarLicoes() {
  try {
    const q = query(
      collection(db, "licoes"),
      where("sala", "==", sala),
      orderBy("data", "desc")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      galeria.innerHTML = '<p style="color:#8b7eaa;text-align:center;grid-column:1/-1;margin-top:40px">Nenhuma lição encontrada para a sala ' + sala + '</p>';
      return;
    }

    snapshot.forEach(doc => {
      const item = doc.data();
      const diaLabel = item.dia === "Terca" ? "Terça" : item.dia;
      imagens.push(item.url);

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        '<div class="card-info"><h3>' + item.materia.toUpperCase() + '</h3><p>' + diaLabel + '</p></div>' +
        '<img src="' + item.url + '" class="imagemLousa" alt="' + item.materia + '">';
      galeria.appendChild(card);
    });
  } catch(e) {
    console.error(e);
    galeria.innerHTML = '<p style="color:#f87171;text-align:center;grid-column:1/-1;margin-top:40px">Erro ao carregar lições.</p>';
  }
}

carregarLicoes();

const modal    = document.getElementById("modalImagem");
const modalImg = document.getElementById("imagemGrande");
const fechar   = document.getElementById("fecharModal");
const anterior = document.getElementById("anterior");
const proximo  = document.getElementById("proximo");
const baixar   = document.getElementById("baixarImagem");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("imagemLousa")) {
    indiceAtual = imagens.indexOf(e.target.src);
    abrirImagem();
  }
});

function abrirImagem() {
  modal.style.display = "flex";
  modalImg.src = imagens[indiceAtual];
  baixar.href  = imagens[indiceAtual];
}

fechar.onclick   = () => { modal.style.display = "none"; };
anterior.onclick = () => { indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length; abrirImagem(); };
proximo.onclick  = () => { indiceAtual = (indiceAtual + 1) % imagens.length; abrirImagem(); };
modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });