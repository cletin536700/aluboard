import { storage } from "./firebase.js";

import {
ref,
listAll,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const params = new URLSearchParams(window.location.search);
const sala = params.get("sala");

document.getElementById("tituloSala").innerText =
"Lições da sala " + sala;

const dias = [
"Segunda",
"Terça",
"Quarta",
"Quinta",
"Sexta"
];

const galeria = document.getElementById("galeria");

let imagens = [];
let indiceAtual = 0;

async function carregarLicoes(){

for(const dia of dias){

const pasta = ref(storage,`licoes/${sala}/${dia}`);

try{

const lista = await listAll(pasta);

for(const item of lista.items){

const url = await getDownloadURL(item);

const materia = item.name.split("_")[0];

imagens.push(url);

const card = document.createElement("div");

card.className="card";

card.innerHTML=`

<h3>${materia}</h3>
<p>${dia}</p>

<img src="${url}" class="imagemLousa">

`;

galeria.appendChild(card);

}

}catch(e){

console.log("Sem imagens",dia);

}

}

}

carregarLicoes();

const modal = document.getElementById("modalImagem");
const modalImg = document.getElementById("imagemGrande");
const fechar = document.getElementById("fecharModal");

const anterior = document.getElementById("anterior");
const proximo = document.getElementById("proximo");

const baixar = document.getElementById("baixarImagem");

document.addEventListener("click",function(e){

if(e.target.classList.contains("imagemLousa")){

indiceAtual = imagens.indexOf(e.target.src);

abrirImagem();

}

});

function abrirImagem(){

modal.style.display="flex";

modalImg.src = imagens[indiceAtual];

baixar.href = imagens[indiceAtual];

}

fechar.onclick = function(){

modal.style.display="none";

}

anterior.onclick = function(){

indiceAtual--;

if(indiceAtual < 0){

indiceAtual = imagens.length - 1;

}

abrirImagem();

}

proximo.onclick = function(){

indiceAtual++;

if(indiceAtual >= imagens.length){

indiceAtual = 0;

}

abrirImagem();

}