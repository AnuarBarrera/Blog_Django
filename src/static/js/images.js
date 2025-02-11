// Variables
const fotos = [
  { url: "/static/images/image1.jpg", descripcion: "Foto 1" },
  { url: "/static/images/image2.jpg", descripcion: "Foto 2" },
  { url: "/static/images/image3.jpg", descripcion: "Foto 3" },
  { url: "/static/images/image4.jpg", descripcion: "Foto 4" },
  { url: "/static/images/image5.jpg", descripcion: "Foto 5" },
  { url: "/static/images/image6.jpg", descripcion: "Foto 6" },
  { url: "/static/images/image7.jpg", descripcion: "Foto 7" },
  { url: "/static/images/image8.jpg", descripcion: "Foto 8" },
];
const fotos2 = [
  { url: "/static/images/image9.jpg", descripcion: "Foto 9" },
  { url: "/static/images/image10.jpg", descripcion: "Foto 10" },
  { url: "/static/images/image11.jpg", descripcion: "Foto 11" },
  { url: "/static/images/image12.jpg", descripcion: "Foto 12" },
  { url: "/static/images/image13.jpg", descripcion: "Foto 13" },
  { url: "/static/images/image14.jpg", descripcion: "Foto 14" },
  { url: "/static/images/image15.jpg", descripcion: "Foto 15" },
  { url: "/static/images/image16.jpg", descripcion: "Foto 16" },
];

// Funciones
function crearCarruselFotos(fotos,contenedor, tiempoPorFoto = 3) {
  let carruselElement = contenedor.querySelector(".carrusel");
  if(!carruselElement){
    carruselElement = document.createElement("div");
    carruselElement.classList.add("carrusel");
    contenedor.appendChild(carruselElement);
  }
  carruselElement.innerHTML='';
  
  const wrapper = document.createElement("div");
  wrapper.classList.add("carrusel-wrapper");
  const fotosDobles = [...fotos, ...fotos];
  
  fotosDobles.forEach((foto) => {
    const fotoElement = document.createElement("img");
    fotoElement.src = foto.url;
    fotoElement.alt = foto.descripcion;
    wrapper.appendChild(fotoElement)
  });
  
  carruselElement.appendChild(wrapper);
  
// Calcular el tiempo total basado en la cantidad de fotos
  const cantidadFotos = fotos.length;
  const tiempoTotal = tiempoPorFoto * cantidadFotos;

// Calculamos el ancho total del carrusel
  const anchoTotal = fotosDobles.length * 420; // 400px de imagen + 20px de margen
  wrapper.style.setProperty('--carrusel-width', `${anchoTotal}px`);
  
  // Establecer la duración de la animación como una variable CSS personalizada
  wrapper.style.setProperty('--animation-duration', `${tiempoTotal}s`);
}

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
  /* se crea un contenedor para el carrusel de fotos*/
  const contenedor = document.querySelector(".fotos"); 
  const todasLasFotos = [...fotos, ...fotos2]; // Combinamos todas las fotos
  crearCarruselFotos(todasLasFotos, contenedor, 10);
  crearCarruselFotos(todasLasFotos, contenedor, 10);
});