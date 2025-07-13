document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const userNameInput = document.getElementById('userNameInput');
    const loginMessage = document.getElementById('login-message');
    const loginOverlay = document.querySelector('.login-overlay'); // Selecciona el overlay

    // Escucha el evento de envío del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que la página se recargue al enviar el formulario

            const userName = userNameInput.value.trim(); // Obtiene el nombre ingresado y elimina espacios extra

            if (userName) { // Si el campo del nombre no está vacío
                localStorage.setItem('loggedInUserName', userName); // Guarda el nombre en localStorage

                // Muestra un mensaje de éxito
                loginMessage.textContent = `¡Hola, ${userName}! Entrando a la página...`;
                loginMessage.classList.add('success');
                loginMessage.classList.remove('error'); // Limpia la clase de error si estaba

                // Oculta el overlay después de un breve retraso
                setTimeout(() => {
                    if (loginOverlay) {
                        loginOverlay.style.opacity = '0'; // Hace que se desvanezca
                        loginOverlay.style.pointerEvents = 'none'; // Deshabilita interacciones para el overlay
                        // Si quieres que desaparezca completamente del DOM, puedes añadir:
                        // loginOverlay.style.display = 'none';
                    }
                    // Opcional: Si en el futuro quieres redirigir a una página principal
                    window.location.href = 'home.html'; 
                }, 1000); // 1000 milisegundos = 1 segundo
            } else {
                // Muestra un mensaje de error si el campo está vacío
                loginMessage.textContent = 'Por favor, ingresa tu nombre para continuar.';
                loginMessage.classList.add('error');
                loginMessage.classList.remove('success'); // Limpia la clase de éxito si estaba
            }
        });
    }

   
});