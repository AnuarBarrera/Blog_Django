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
const titulo = "Proyectos";
const parrafoIntroductorio = "Esta es una consola interactiva de uso sencillo. Para ejecutar un script, escribe el comando run seguido del nombre del script en la consola de entrada y presiona Enter. También puedes hacer clic en uno de los scripts disponibles en la lista y luego presionar Enter. El resultado se mostrará en la consola de salida. Además, puedes utilizar los comandos integrados para obtener más información sobre el entorno.";
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
    // Crear el modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    // Crear el contenedor del contenido del modal
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Botón de cierre
    const closeButton = document.createElement('button');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        modalOverlay.classList.remove('show');
    };

    // Agregar botón de cierre al modal
    modalContent.appendChild(closeButton);

    // Definir los botones
    const botones = [
        {texto: "REGRESAR A INICIO", url: "/", tipo: "externo"},
        { texto: "HISTORIA LABORAL", url: "/HistoriaLaboral/", tipo: "externo"},
        { texto: "REDES SOCIALES", tipo: "modal"}
    ];
    
    // Crear y agregar botones al modal
    botones.forEach((boton) => {
        const botonElement = document.createElement("button");
        botonElement.textContent = boton.texto;
        
        botonElement.onclick = () => {
            modalOverlay.classList.remove('show');
            
            if (boton.tipo === "interno"){
                const seccion = document.querySelector(boton.url);
                if (seccion){
                    seccion.scrollIntoView({ behavior: "smooth" });
                }
            } else if (boton.tipo === "modal"){
                // Aseguramos que el modal esté creado
                modal = crearModal();
                modal.style.display = "block";
            } else if (boton.tipo === "externo"){
                window.location.href = boton.url;
            }
        };
        
        modalContent.appendChild(botonElement);
    });

    // Agregar contenido al overlay
    modalOverlay.appendChild(modalContent);

    // Agregar modal al body
    document.body.appendChild(modalOverlay);

    // Modificar el evento del menú para mostrar el modal
    const menuElement = document.querySelector('.menu');
    menuElement.onclick = () => {
        modalOverlay.classList.add('show');
    };

    // Cerrar modal si se hace clic fuera del contenido
    modalOverlay.onclick = (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.classList.remove('show');
        }
    };
}

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
  crearTitulo();
  crearParrafoIntroductorio();
  crearBotonesAcceso();
  // Inicializamos el modal pero no lo mostramos todavía
  modal = crearModal();
});