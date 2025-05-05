
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategoria = document.querySelectorAll(".boton-categoria");
const contadorCarrito = document.querySelector("#numerito");
const aside = document.querySelector(".aside-visible");
const titulo = document.querySelector("#titulo-principal");
const botonTodos = document.querySelector("#todos");
const abrirAsideBtn = document.querySelector(".open-menu");
const cerrarAsideBtn = document.querySelector(".close-menu");

let productos = [];
let carrito = [];

const obtenerProductos = () => {
    fetch("./js/productos.json")
        .then(resp => resp.json())
        .then(data => {
            productos = data;
            renderizarProductos(productos);
            activarBotonesAgregar();
        })
        .catch(err => {
            console.error("No se pudieron cargar los productos:", err);
            contenedorProductos.innerHTML = "<p>Error al mostrar los productos.</p>";
        });
};

const renderizarProductos = items => {
    contenedorProductos.innerHTML = "";
    for (const item of items) {
        const card = document.createElement("div");
        card.classList.add("producto");
        card.innerHTML = `
            <img class="producto-imagen" src="${item.imagen}" alt="${item.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${item.titulo}</h3>
                <p class="producto-precio">$${item.precio}</p>
                <button class="producto-agregar" data-id="${item.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.appendChild(card);
    }
};

const actualizarContador = () => {
    const total = carrito.reduce((sum, prod) => sum + prod.cantidad, 0);
    contadorCarrito.textContent = total;
};

const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const agregarAlCarrito = id => {
    const producto = productos.find(p => p.id == id);
    if (!producto) return console.error("Producto no encontrado.");

    const existente = carrito.find(p => p.id == id);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarContador();
    guardarCarrito();
};

const activarBotonesAgregar = () => {
    contenedorProductos.addEventListener("click", e => {
        if (e.target.classList.contains("producto-agregar")) {
            const id = e.target.dataset.id;
            agregarAlCarrito(id);
        }
    });
};

const restaurarCarrito = () => {
    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = guardado.filter(p => productos.some(prod => prod.id === p.id));
    actualizarContador();
};

const manejarCategoriaClick = e => {
    const id = e.currentTarget.id;

    botonesCategoria.forEach(btn => {
        btn.classList.remove("active");
        const icon = btn.querySelector("i");
        icon?.classList.replace("bi-hand-index-thumb-fill", "bi-hand-index-thumb");
    });

    e.currentTarget.classList.add("active");
    const icono = e.currentTarget.querySelector("i");
    icono?.classList.replace("bi-hand-index-thumb", "bi-hand-index-thumb-fill");

    if (id === "todos") {
        titulo.textContent = "Todos los productos";
        renderizarProductos(productos);
    } else {
        const filtrados = productos.filter(p => p.categoria.id === id);
        titulo.textContent = filtrados[0]?.categoria.nombre || "Categoría";
        renderizarProductos(filtrados);
    }

    activarBotonesAgregar();
};

botonesCategoria.forEach(btn => {
    btn.addEventListener("click", manejarCategoriaClick);
});

botonTodos.addEventListener("click", () => {
    titulo.textContent = "Todos los productos";
    renderizarProductos(productos);
    activarBotonesAgregar();
});

const mostrarAside = aside => {
    if (window.innerWidth < 601) {
        Object.assign(aside.style, {
            display: "block",
            position: "fixed"
        });
        cerrarAsideBtn.style.display = "block";
    } else {
        aside.style.display = "block";
        aside.style.position = "sticky";
    }
};

const ocultarAside = aside => {
    if (window.innerWidth < 601) {
        aside.style.display = "none";
        cerrarAsideBtn.style.display = "none";
    }
};

abrirAsideBtn.addEventListener("click", () => mostrarAside(aside));
cerrarAsideBtn.addEventListener("click", () => ocultarAside(aside));

// Inicialización
restaurarCarrito();
obtenerProductos();