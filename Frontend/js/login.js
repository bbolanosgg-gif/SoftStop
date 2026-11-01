
document.addEventListener("DOMContentLoaded", () => {
    let isLoginMode = true;

    const API_URL = "http://localhost:3000";

    const form = document.getElementById("loginForm");
    const nameContainer = document.getElementById("nameContainer");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const statusMessage = document.getElementById("statusMessage");
    const submitBtn = document.getElementById("submitBtn");
    const submitText = document.getElementById("submitText");
    const filaRecordarme = document.getElementById("filaRecordarme");

    const loginTitulo = document.getElementById("LoginTitulo");
    const loginSubtitulo = document.getElementById("LoginSubtitulo");
    const toggleContextText = document.getElementById("toggleContextText");
    const switchModeBtn = document.getElementById("switchModeBtn");

    // Alternar entre inicio de sesión y registro
    switchModeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        statusMessage.hidden = true;

        if (isLoginMode) {
            loginTitulo.textContent = "Bienvenido";
            loginSubtitulo.textContent = "Inicia sesion para continuar";
            submitText.textContent = "Iniciar sesión";
            toggleContextText.textContent = "¿No tienes una cuenta?";
            switchModeBtn.textContent = "Crear cuenta gratis";
            nameContainer.hidden = true;
            filaRecordarme.style.display = "flex";
        } else {
            loginTitulo.textContent = "Crea tu cuenta";
            loginSubtitulo.textContent = "Únete para continuar";
            submitText.textContent = "Crear cuenta";
            toggleContextText.textContent = "¿Ya tienes una cuenta?";
            switchModeBtn.textContent = "Inicia sesión";
            nameContainer.hidden = false;
            filaRecordarme.style.display = "none";
        }
    });

    // Mostrar u ocultar contraseña
    togglePasswordBtn.addEventListener("click", () => {
        const mostrar = passwordInput.type === "password";
        passwordInput.type = mostrar ? "text" : "password";
        togglePasswordBtn.setAttribute(
            "aria-label",
            mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
        );
    });

    // Validar correo
    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Mostrar errores
    const showError = (input, errorId, show) => {
        const campo = input.closest(".LoginCampo");
        const errorElement = document.getElementById(errorId);

        campo.classList.toggle("error", show);
        errorElement.hidden = !show;
    };

    nameInput.addEventListener("input", () =>
        showError(nameInput, "nameError", false)
    );

    emailInput.addEventListener("input", () =>
        showError(emailInput, "emailError", false)
    );

    passwordInput.addEventListener("input", () =>
        showError(passwordInput, "passwordError", false)
    );

    // Enviar formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let isValid = true;
        statusMessage.hidden = true;

        if (!isLoginMode) {
            showError(nameInput, "nameError", false);
            statusMessage.hidden = false;
            statusMessage.textContent =
                "El registro de usuarios todavía no está conectado al servidor.";
            return;
        }

        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, "emailError", true);
            isValid = false;
        }

        if (passwordInput.value.trim() === "") {
            showError(passwordInput, "passwordError", true);
            isValid = false;
        }

        if (!isValid) {
            statusMessage.hidden = false;
            statusMessage.textContent =
                "Revisa los datos ingresados.";
            return;
        }

        submitText.textContent = "Cargando...";
        submitBtn.disabled = true;

        const datos = {
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        try {
            const respuesta = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.error || "No se pudo iniciar sesión."
                );
            }

            // Comprobar que sea un administrador
            if (
                !resultado.usuario ||
                resultado.usuario.rol !== "admin" ||
                !resultado.token
            ) {
                throw new Error(
                    "Esta cuenta no tiene permisos de administrador."
                );
            }

            // Guardar el token para consultar el panel
            sessionStorage.setItem("softstopToken", resultado.token);

            // Entrar al panel de administración
            window.location.href = "admin-dashboard.html";

        } catch (error) {
            statusMessage.hidden = false;
            statusMessage.textContent = error.message;

            submitText.textContent = "Iniciar sesión";
            submitBtn.disabled = false;
        }
    });
});
