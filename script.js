const categorias = ["Retratos", "Digital", "Personas", "Paisajes", "Animales", "Construcciones", "Esculturas", "Objetos", "Arte", "Vehículos", "Abstracto", "Pinturas", "Todos"];

let datosJson = null;

let htmlInicialGaleria;

const urlActual = window.location.pathname.split('/').pop()

async function cargarDatosJSON() {
  const RUTA_JSON = './assets/json/imagenes.json';
  const contenedorError = document.getElementById('img-destacados');

  try {
    const response = await fetch(RUTA_JSON);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - No se pudo cargar el archivo.`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('El JSON se cargó pero está vacío o no es un array.');
    }

    return data;
  } catch (error) {
      console.error('Hubo un error al cargar o procesar el JSON:', error);

      if (contenedorError) {
        contenedorError.innerHTML =
          `<p style="color: red; padding: 20px;">
            **Error al cargar datos:** ${error.message}. Intente recargar la página.
          </p>`;
      }
    
    throw error;
  }
}


function cargarDatosTop3Descargas(datos) {
  const contenedor = document.getElementById('img-destacados');

  const cards = document.createElement('div');

  cards.classList.add('img-destacadas-contenedor');

  if(datos && Array.isArray(datos)){
    const top3Descargas = obtenerTop3Descargas(datos)

    top3Descargas.forEach( image => {
      const card = document.createElement('div');

      card.setAttribute('data-categoria', image.categorias)
      card.classList.add('imagen-contenedor', 'position-relative', "shadow");
      card.id = `${image.id}`;

      card.innerHTML = `
        <img src="assets/${image.path}" alt="imagen" class="w-100"/>
        <span class="text-imagen position-absolute w-100 bottom-0 start-0 d-flex flex-column py-3 px-5 z-1" ><p class="text-white">Descargas | ${image.numeroDeDescargas}</p> <p class="text-white">Autor | ${image.autor}</p></span>
      `;

      cards.appendChild(card);
    });

    contenedor.appendChild(cards);

  }else{
    cards.innerHTML = `<p class="text-light">No se encontraron datos</p>`;

    contenedor.appendChild(cards);
  }

};

function cargarDatosGaleria(datosJson){
  const contenedor = document.getElementById('contenedor-galeria');
  let datos = datosJson;
  let limite = 0;

  for (let i = 0; i < 3; i++) {
    if (i === 2) {
      limite = datos.length 
    }else{
      limite = Math.ceil(datosJson.length / 3);
    };

    const cards = document.createElement('div');
    cards.classList.add('d-flex', "flex-column");

    for (let j = 0; j < limite; j++) {
      const card = document.createElement('div');
      
      card.classList.add('imagen-contenedor', 'position-relative', "shadow", "mb-5");
      card.id = `${datos[j].id}`;

      card.dataset.categorias = datos[j].categorias;
      
      card.innerHTML = `
        <img src="assets/${datos[j].path}" alt="imagen" class="w-100"/>
        <span class="text-imagen position-absolute w-100 bottom-0 start-0 d-flex flex-column py-3 px-5 z-1" ><p class="text-white">Descargas | ${datos[j].numeroDeDescargas}</p> <p class="text-white">Autor | ${datos[j].autor}</p></span>
      `;

      cards.appendChild(card);
    };

    contenedor.appendChild(cards);
    
    if(i < 2){
      datos = datos.slice(Math.ceil(datosJson.length / 3))
    }
  }

  htmlInicialGaleria = document.querySelectorAll('[data-categorias]');

  console.log(htmlInicialGaleria)

};

function cargarDatosCategorias(datos) {
  const contenedor = document.getElementById('contenedor-categorias'); 

  const categorias = document.createElement('div');

    categorias.classList.add("d-grid", "justify-content-between", "p-4", "mt-2", "contenedor-categorias");

  datos.forEach( categoria => {
    const cardContenedor = document.createElement('div');
    cardContenedor.classList.add('d-flex', 'justify-content-center')

    const card = document.createElement('p');

    card.classList.add("text-categorias");

    card.innerHTML = `${categoria}`;

    if (urlActual === 'galeria.html') {
      card.classList.add('pointer');
      card.addEventListener('click', function() {
        filtrarPorCategoria(categoria);
      });
    }else{
      card.classList.add('cursorDefault');
    }
    cardContenedor.appendChild(card);

    categorias.appendChild(cardContenedor);
  });

  contenedor.appendChild(categorias)
}

function obtenerTop3Descargas(datosImágenes) {
  const datosOrdenados = [...datosImágenes]; 

  datosOrdenados.sort((a, b) => b.numeroDeDescargas - a.numeroDeDescargas);

  const top3 = datosOrdenados.slice(0, 3);
  
  return top3;
}

async function inicializarApp() {
  try {
    datosJson = await cargarDatosJSON();

    if (urlActual === 'index.html') {
      cargarDatosTop3Descargas(datosJson);
      cargarDatosCategorias(categorias);
    }else if(urlActual === 'galeria.html'){
      cargarDatosGaleria(datosJson);
      cargarDatosCategorias(categorias);
    };
  } catch (error) {
    console.log("No se pudo inicializar la aplicación debido al error anterior.", error);
  }
}

function cargarDatosGaleriaFiltrada(arrayHtml){
  const contenedor = document.getElementById('contenedor-galeria')

  contenedor.innerHTML = '';

  arrayHtml.forEach(card => {
    const cards = document.createElement('div');
  
    cards.classList.add('w-100');
    cards.appendChild(card);

    contenedor.appendChild(cards); 
  });

};

function filtrarPorCategoria(categoria){
  let array = htmlInicialGaleria
  let newArray = [];

  array.forEach( objeto => {
    const gruposString = objeto.dataset.categorias;

    const arrayDeGrupos = gruposString.split(',').map(g => g.trim());

    if(arrayDeGrupos.includes(categoria)){
      newArray.push(objeto)
    };
  });

  if(categoria === 'Todos'){
    cargarDatosGaleriaFiltrada(htmlInicialGaleria)
  }else{
    cargarDatosGaleriaFiltrada(newArray)
  }
};

function openClose(){
  const contenedor = document.getElementById('menu-open');
  const contenedorLinks = document.getElementById('menu-links')

  contenedor.classList.toggle('menu-contenedor-open');

  if (contenedor.classList.contains('menu-contenedor-open')) {
      contenedor.classList.remove('menu-contenedor');
      contenedorLinks.classList.remove('menu-links')
      contenedorLinks.classList.add('menu-link-open')
  } else {
      contenedor.classList.add('menu-contenedor');
      contenedorLinks.classList.add('menu-links')
      contenedorLinks.classList.remove('menu-link-open')
  }

}

document.addEventListener('DOMContentLoaded', inicializarApp);




