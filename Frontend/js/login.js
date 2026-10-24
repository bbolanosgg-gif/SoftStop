document.addEventListener("DOMContentLoaded", () => {

    // Estado del formulario
    let isLoginMode = true; 

    // Elementos del DOM
    const form = document.getElementById('loginForm');
    const nameContainer = document.getElementById('nameContainer');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const filaRecordarme = document.getElementById('filaRecordarme');

    // Elementos de texto dinámico
    const loginTitulo = document.getElementById('LoginTitulo');
    const loginSubtitulo = document.getElementById('LoginSubtitulo');
    const toggleContextText = document.getElementById('toggleContextText');
    const switchModeBtn = document.getElementById('switchModeBtn');

    // Lógica para alternar entre Iniciar Sesión y Registro
    switchModeBtn.addEventListener('click', (e) => {
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

    // Mostrar/Ocultar Contraseña
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        if (type === 'text') {
            eyeIcon.innerHTML = '<path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
        } else {
            eyeIcon.innerHTML = '<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="1.5"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" stroke-width="1.5"/>';
        }
    });

    // Funciones de validación visual
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showError = (input, errorId, show) => {
        const campo = input.closest('.LoginCampo');
        const errorElement = document.getElementById(errorId);
        campo.classList.toggle('error', show);
        errorElement.hidden = !show;
    };

    nameInput.addEventListener('input', () => showError(nameInput, 'nameError', false));
    emailInput.addEventListener('input', () => showError(emailInput, 'emailError', false));
    passwordInput.addEventListener('input', () => showError(passwordInput, 'passwordError', false));

    // Intercepción del envío
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;
        statusMessage.hidden = true;

        if (!isLoginMode && nameInput.value.trim() === '') {
            showError(nameInput, 'nameError', true);
            isValid = false;
        }

        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'emailError', true);
            isValid = false;
        }

        if (passwordInput.value.trim() === '') {
            showError(passwordInput, 'passwordError', true);
            isValid = false;
        }

        if (!isValid) {
            statusMessage.hidden = false;
            statusMessage.innerHTML = 'Faltan algunos datos. Revisa los campos señalados.';
            return;
        }

        submitText.innerHTML = `Cargando...`;
        submitBtn.disabled = true;

                const ruta = isLoginMode ? '/auth/login' : '/auth/registro';
        const datos = isLoginMode
            ? { email: emailInput.value.trim(), password: passwordInput.value }
            : { nombre: nameInput.value.trim(), email: emailInput.value.trim(), password: passwordInput.value };

        try {
            const respuesta = await fetch('http://localhost:3000' + ruta, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                statusMessage.hidden = false;
                statusMessage.textContent = resultado.error;
                submitText.textContent = isLoginMode ? 'Iniciar sesión' : 'Crear cuenta';
                submitBtn.disabled = false;
                return;
            }

            if (isLoginMode) {
                if (resultado.email === 'admin@softstop.com') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                window.location.href = 'checkin.html';
            }
        } catch (error) {
            statusMessage.hidden = false;
            statusMessage.textContent = 'No se pudo conectar con el servidor. ¿Está encendido?';
            submitText.textContent = isLoginMode ? 'Iniciar sesión' : 'Crear cuenta';
            submitBtn.disabled = false;
        }
    });
});