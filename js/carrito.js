document.addEventListener("DOMContentLoaded", () => {
    let carritoData = JSON.parse(localStorage.getItem("carrito")) || [];

    const contenedorProductos = document.querySelector("#carrito-productos");
    const totalDisplay = document.querySelector("#Total");
    const contadorProductos = document.querySelector("#numerito");
    const btnLimpiarCarrito = document.querySelector(".carrito-acciones-vaciar");
    const btnFinalizarCompra = document.querySelector("#comprarAhora");
    const mensajeCarritoVacio = document.querySelector("#carrito-vacio");
    const accionesCarrito = document.querySelector("#carrito-acciones");
    const mensajeCompraRealizada = document.querySelector("#carrito-comprado");
    const panelLateral = document.querySelector(".aside-visible");

    function actualizarVistaCarrito() {
        contenedorProductos.innerHTML = "";
        let montoTotal = 0;

        carritoData.forEach((item, idx) => {
            let calculoSubtotal = item.precio * item.cantidad * 1.21;
            montoTotal += calculoSubtotal;

            const itemElemento = document.createElement("div");
            itemElemento.classList.add("carrito-producto");
            itemElemento.innerHTML = `
                <img src="${item.imagen}" alt="${item.titulo}" class="carrito-producto-imagen">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${item.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${item.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${item.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${Math.trunc(calculoSubtotal)}</p>
                </div>
                <button class="btn-comprar-item" data-id="${idx}"><i class="bi bi-bag-fill"></i>Comprar</button>
                <button class="btn-eliminar-item" data-id="${idx}"><i class="bi bi-trash-fill"></i>Eliminar</button>
            `;
            contenedorProductos.appendChild(itemElemento);
        });

        accionesCarrito.innerHTML = `
            <div class="carrito-acciones">
                <div class="acciones-izquierda">
                    <button class="carrito-acciones-vaciar">Vaciar carrito</button>
                </div>
                <div class="acciones-derecha">
                    <div class="total-contenedor">
                        <p>Total:</p>
                        <p id="Total">$${Math.trunc(montoTotal)}</p>
                    </div>
                    <button class="carrito-acciones-comprar">Comprar ahora</button>
                </div>
            </div>
        `;

        contadorProductos.textContent = carritoData.reduce((suma, el) => suma + el.cantidad, 0);

        if (carritoData.length === 0) {
            mensajeCarritoVacio.style.display = "block";
            contenedorProductos.style.display = "none";
            contadorProductos.textContent = "0";
            totalDisplay.innerHTML = `0`;
        } else {
            mensajeCarritoVacio.style.display = "none";
            contenedorProductos.style.display = "block";
        }

        configurarBotones();
    }

    function configurarBotones() {
        const btnVaciar = document.querySelector(".carrito-acciones-vaciar");
        const btnComprar = document.querySelector(".carrito-acciones-comprar");
        if (btnVaciar) btnVaciar.addEventListener("click", limpiarCarrito);
        if (btnComprar) btnComprar.addEventListener("click", procesarCompra);
    }

    function limpiarCarrito() {
        if (confirm("¿Deseas eliminar todo el contenido del carrito?")) {
            carritoData = [];
            localStorage.setItem("carrito", JSON.stringify(carritoData));
            actualizarVistaCarrito();
        }
    }

    function removerProducto(id) {
        if (confirm("¿Eliminar este producto del carrito?")) {
            if (carritoData[id].cantidad > 1) {
                carritoData[id].cantidad--;
            } else {
                carritoData.splice(id, 1);
            }

            localStorage.setItem("carrito", JSON.stringify(carritoData));
            actualizarVistaCarrito();
        }
    }

    function procesarCompra() {
        const totalFinal = carritoData.reduce((sum, el) => sum + el.precio * el.cantidad, 0);
        if (carritoData.length > 0 && confirm(`¿Confirmas la compra por $${totalFinal}?`)) {
            carritoData = [];
            localStorage.setItem("carrito", JSON.stringify(carritoData));
            actualizarVistaCarrito();
        }
    }

    function comprarIndividual(id) {
        if (confirm("¿Deseas comprar este artículo?")) {
            if (carritoData[id].cantidad > 1) {
                carritoData[id].cantidad--;
            } else {
                carritoData.splice(id, 1);
            }

            localStorage.setItem("carrito", JSON.stringify(carritoData));
            actualizarVistaCarrito();
        }
    }

    contenedorProductos.addEventListener("click", (event) => {
        const index = event.target.dataset.id;
        if (event.target.classList.contains("btn-comprar-item")) {
            comprarIndividual(index);
        } else if (event.target.classList.contains("btn-eliminar-item")) {
            removerProducto(index);
        }
    });

    const abrirAsideBtn = document.querySelector(".open-menu");
    const cerrarAsideBtn = document.querySelector(".close-menu");

    function mostrarAside(elemento) {
        elemento.style.display = "block";
        elemento.style.position = "fixed";
        cerrarAsideBtn.style.display = "block";
    }

    function ocultarAside(elemento) {
        elemento.style.display = "none";
        cerrarAsideBtn.style.display = "none";
    }

    abrirAsideBtn.addEventListener("click", () => mostrarAside(panelLateral));
    cerrarAsideBtn.addEventListener("click", () => ocultarAside(panelLateral));

    actualizarVistaCarrito();
});
