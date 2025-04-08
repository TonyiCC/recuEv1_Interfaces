function estaVacio(valor) {
    return valor.trim().length > 0;
}

function toggleError(mensajeElemento, mostrar) {
    mensajeElemento.style.display = mostrar ? "block" : "none";
}

function chequearNombre() {
    const campoNombre = document.getElementById("nombre");
    const mensajeError = document.getElementById("error-nombre");
    const regexNombre = /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/;

    if (!estaVacio(campoNombre.value)) {
        mensajeError.textContent = "Este campo es obligatorio";
        toggleError(mensajeError, true);
        return false;
    }

    if (!regexNombre.test(campoNombre.value)) {
        mensajeError.textContent = "Solo se permiten letras";
        toggleError(mensajeError, true);
        return false;
    }

    if (campoNombre.value.length > 20) {
        mensajeError.textContent = "Máximo 20 caracteres permitidos";
        toggleError(mensajeError, true);
        return false;
    }

    toggleError(mensajeError, false);
    return true;
}

function chequearPassword() {
    const campoPass = document.getElementById("password");
    const mensajeError = document.getElementById("error-password");
    const regexPass = /^[a-zA-Z0-9·$%&/().]{8,16}$/;

    if (!estaVacio(campoPass.value)) {
        mensajeError.textContent = "La contraseña no puede estar vacía";
        toggleError(mensajeError, true);
        return false;
    }

    if (!regexPass.test(campoPass.value)) {
        mensajeError.textContent = "Debe tener entre 8 y 16 caracteres válidos: letras, números o ·$%&/().";
        toggleError(mensajeError, true);
        return false;
    }

    toggleError(mensajeError, false);
    return true;
}

function reiniciarFormulario() {
    const form = document.getElementById("formulario");
    form.reset();

    document.querySelectorAll(".error-message").forEach((elemento) => {
        elemento.textContent = "";
        elemento.style.display = "none";
    });
}

function manejarEnvio(e) {
    e.preventDefault();

    const nombreCorrecto = chequearNombre();
    const passCorrecta = chequearPassword();

    if (!nombreCorrecto || !passCorrecta) {
        return; // se cancela sin mostrar alert
    }

    location.href = "./main.html";
}

document.getElementById("nombre").addEventListener("blur", chequearNombre);
document.getElementById("password").addEventListener("blur", chequearPassword);
document.getElementById("limpiar").addEventListener("click", reiniciarFormulario);
document.getElementById("formulario").addEventListener("submit", manejarEnvio);
