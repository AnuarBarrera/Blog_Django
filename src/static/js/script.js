/*
  Copyright [2005] [anuar eduardo barrera yeeben]
 
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.
*/

// Variables
const titulo = "Bienvenido a mi Blog";
const parrafoIntroductorio = "Bienvenido a mi CV en línea. Soy Anuar Barrera, un desarrollador apasionado por crear soluciones tecnológicas innovadoras.Te invito a consultar mi historia laboral y mi portafolio de proyectos para que tengas una mejor nocion de mis conocimientos y aptitudes.";
const redesSociales = [
  { nombre: "GitHub", url: "https://www.github.com/AnuarBarrera" },
  { nombre: "LinkedIn", url: "https://www.linkedin.com/in/anuarbarrera" },
];

let modal;

// Funciones
function crearModal() {
  if (document.getElementById('modal-redes')) {
    return document.getElementById('modal-redes');
  }
  
  modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modal-redes";
  modal.style.display = "none"; 
  
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  
  // Botón para cerrar
  const closeBtn = document.createElement("span");
  closeBtn.className = "close-button";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
  
  // Título del modal
  const titulo = document.createElement("h2");
  titulo.textContent = "Mis Redes Sociales";
  titulo.style.color = "white";
  
  // Contenedor de botones
  const botonesContainer = document.createElement("div");
  botonesContainer.className = "modal-buttons";
  
  // Crear botones para cada red social
  redesSociales.forEach(red => {
    const button = document.createElement("a");
    button.href = red.url;
    button.target = "_blank";
    button.className = "modal-button";
    button.textContent = red.nombre;
    botonesContainer.appendChild(button);
  });
  
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(titulo);
  modalContent.appendChild(botonesContainer);
  modal.appendChild(modalContent);
  
  document.body.appendChild(modal);
  
  // Cerrar modal si se hace clic fuera del contenido
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  return modal;
}

function crearTitulo() {
  const tituloElement = document.querySelector(".Title");
  tituloElement.textContent = titulo;
}

function crearParrafoIntroductorio() {
  const parrafoElement = document.querySelector(".Parrafo-entrada");
  parrafoElement.textContent = parrafoIntroductorio;
}

function crearBotonesAcceso() {
  const linksAccesosElement = document.querySelector(".Links-accesos");
  const modal = crearModal();
  
  const botones = [
    { texto: "Historial Laboral", url: "HistoriaLaboral/", tipo: "externo"},
    { texto: "Proyectos", url: "#proyectos", tipo: "interno"},
    { texto: "Redes Sociales", tipo: "modal"}
  ];
  
  botones.forEach((boton) => {
    const botonElement = document.createElement("button");
    botonElement.textContent = boton.texto;
    
    botonElement.onclick = () => {
      if (boton.tipo === "interno"){
        const seccion = document.querySelector(boton.url);
        if (seccion){
          seccion.scrollIntoView({ behavior: "smooth" });
        }
      }else if (boton.tipo === "modal"){
        modal.style.display = "block";
      }else if (boton.tipo === "externo"){
        window.location.href = boton.url;
      }
    };
    
    linksAccesosElement.appendChild(botonElement);
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
  crearTitulo();
  crearParrafoIntroductorio();
  crearBotonesAcceso();
});
