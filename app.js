

/*document.addEventListener('DOMContentLoaded', function() {
    // --- Variables de Carrito (ya las tenías) ---
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || []; 
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // --- Variables para el Menú Móvil (¡Aquí está el ajuste crucial!) ---
    // Asegúrate de que 'btn_menu' sea el ID de tu botón de hamburguesa en el HTML
    // O si usas una clase, cambia a document.querySelector('.menu-toggle');
    const menuToggle = document.querySelector('.menu-toggle'); // Usamos el nombre que acordamos
    const navMenu = document.querySelector('.contenedor_nav .main-nav ul'); // Selector ajustado para tu UL


    // --- Funciones del Carrito (ya las tenías) ---
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart)); 
        updateCartCount();
        if (cartItemsContainer) { 
            renderCartItems();
        }
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => {
            const quantity = parseInt(item.quantity) || 0;
            return sum + quantity;
        }, 0);
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
        if (clearCartBtn) {
            clearCartBtn.disabled = cart.length === 0;
        }
        if (emptyCartMessage) {
            emptyCartMessage.style.display = cart.length === 0 ? 'block' : 'none';
        }
    }

    function calculateCartTotal() {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    }

    // --- Lógica de Añadir al Carrito (ya la tenías) ---
    function addProductToCart(event) {
        const button = event.target;
        const productItem = button.closest('.product-item');
        if (!productItem) return;
        const id = productItem.dataset.id;
        const name = productItem.dataset.name;
        let price = parseFloat(productItem.dataset.price);
        if (isNaN(price)) {
            price = 0; 
            console.warn(`Producto con ID ${id} tiene un precio inválido: ${productItem.dataset.price}. Establecido a 0.`);
        }
        const image = productItem.dataset.image;
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        saveCart();
    }
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addProductToCart);
        });
    }

    function renderCartItems() {
        if (!cartItemsContainer) return; 
        cartItemsContainer.innerHTML = ''; 
        const total = calculateCartTotal();
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.dataset.id = item.id;
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-thumbnail">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                        <div class="cart-item-quantity-controls">
                            <button class="quantity-decrease" data-id="${item.id}">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-from-cart-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }
        cartTotalElement.textContent = total.toFixed(2);
        updateCartCount();
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const id = target.dataset.id || target.closest('button')?.dataset.id;
            if (!id) return; 

            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex > -1) { 
                if (target.classList.contains('quantity-increase')) {
                    cart[itemIndex].quantity++;
                } else if (target.classList.contains('quantity-decrease')) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    } else {
                        if (confirm(`¿Quieres eliminar "${cart[itemIndex].name}" del carrito?`)) {
                            cart.splice(itemIndex, 1); 
                        }
                    }
                } else if (target.closest('.remove-from-cart-btn')) {
                    if (confirm(`¿Estás seguro de que quieres eliminar "${cart[itemIndex].name}" del carrito?`)) {
                        cart.splice(itemIndex, 1); 
                    }
                }
                saveCart(); 
            }
        });

        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                cart = [];
                saveCart();
                renderCartItems(); 
            });
        }
        renderCartItems();
    }
    
    // --- Lógica del Menú Móvil (¡Integrado aquí!) ---
    // Asegúrate de que 'menuToggle' apunte a tu botón de hamburguesa.
    // Asegúrate de que 'navMenu' apunte a tu UL dentro de nav.
    // Y que el CSS use la clase 'show-menu' para mostrar/ocultar el menú.
    if (menuToggle && navMenu) {
        console.log("Menú hamburguesa: Elementos encontrados. ¡Listo para funcionar!"); // Mensaje de depuración
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu'); // Usa 'show-menu' como en tu código
            const icon = menuToggle.querySelector('i'); // Apunta al icono dentro de menuToggle
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times'); 
        });

        // Opcional: Cerrar el menú si se hace clic en un enlace (dentro del menú)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu'); // Usa 'show-menu' para cerrar
                const icon = menuToggle.querySelector('i'); // Apunta al icono dentro de menuToggle
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    } else {
        console.warn("Menú hamburguesa: No se encontraron todos los elementos HTML. Verifique selectores.");
        if (!menuToggle) console.warn("menuToggle no encontrado.");
        if (!navMenu) console.warn("navMenu no encontrado.");
    }
    
    // Asegúrate de llamar a updateCartCount al final para inicializar el contador del carrito
    updateCartCount(); 
});*/


document.addEventListener('DOMContentLoaded', function() {

    // ===============================================
    // --- 1. DECLARACIÓN DE VARIABLES GLOBALES Y SELECTORES ---
    //    Estas variables se buscan una vez cuando la página carga.
    // ===============================================

    // Variables para la funcionalidad del Carrito de Compras
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || []; 
    const cartCountElements = document.querySelectorAll('.cart-count'); // Elementos donde se muestra el contador del carrito (ej. al lado del ícono)
    const cartItemsContainer = document.getElementById('cart-items-container'); // Contenedor en la página del carrito donde se listan los productos
    const cartTotalElement = document.getElementById('cart-total');       // Elemento que muestra el precio total del carrito
    const clearCartBtn = document.getElementById('clear-cart-btn');       // Botón para vaciar el carrito
    const emptyCartMessage = document.getElementById('empty-cart-message'); // Mensaje cuando el carrito está vacío

    // Variables para la funcionalidad del Menú Móvil (Menú Hamburguesa)
    // Asegúrate de que el botón en tu HTML tenga la clase 'menu-toggle'
    const menuToggle = document.querySelector('.menu-toggle'); 
    // Asegúrate de que tu elemento <nav> que contiene la <ul> tenga la clase 'main-nav' 
    // y esté dentro de un div con la clase 'contenedor_nav' en tu HTML.
    const navMenu = document.querySelector('.contenedor_nav .main-nav ul'); 

    // ===============================================
    // --- 2. FUNCIONES REUTILIZABLES ---
    //    Definiciones de funciones que serán llamadas por eventos o al inicio.
    // ===============================================

    /**
     * Guarda el estado actual del carrito en localStorage.
     * También actualiza el contador de ítems y el renderizado del carrito si estamos en la página.
     */
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart)); 
        updateCartCount(); // Llama a la función para actualizar el número en el icono del carrito
        
        // Si el contenedor de ítems del carrito existe en esta página (ej. estamos en carrito.html),
        // vuelve a renderizar los ítems para reflejar los cambios.
        if (cartItemsContainer) { 
            renderCartItems();
        }
    }

    /**
     * Calcula el número total de ítems en el carrito y actualiza los elementos '.cart-count'.
     * También controla la visibilidad del botón de vaciar carrito y el mensaje de carrito vacío.
     */
    function updateCartCount() {
        // Suma las cantidades de todos los productos en el carrito
        const totalItems = cart.reduce((sum, item) => {
            const quantity = parseInt(item.quantity) || 0; // Asegura que la cantidad sea un número
            return sum + quantity;
        }, 0);
        
        // Actualiza el texto de todos los elementos que tienen la clase 'cart-count'
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });

        // Deshabilita el botón de vaciar carrito si el carrito está vacío
        if (clearCartBtn) {
            clearCartBtn.disabled = cart.length === 0;
        }
        
        // Muestra u oculta el mensaje de "carrito vacío"
        if (emptyCartMessage) {
            emptyCartMessage.style.display = cart.length === 0 ? 'block' : 'none';
        }
    }

    /**
     * Calcula el precio total de todos los productos en el carrito.
     * @returns {number} El precio total.
     */
    function calculateCartTotal() {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;     // Asegura que el precio sea un número
            const quantity = parseInt(item.quantity) || 0; // Asegura que la cantidad sea un número
            return total + (price * quantity);
        }, 0);
    }

    /**
     * Añade un producto al carrito cuando se hace clic en un botón "Añadir al Carrito".
     * Obtiene los datos del producto de los atributos 'data-' del elemento padre.
     * @param {Event} event - El evento de clic.
     */
    function addProductToCart(event) {
        const button = event.target;
        // Encuentra el elemento '.product-item' más cercano que contiene el botón clicado.
        const productItem = button.closest('.product-item');

        if (!productItem) return; // Si no se encontró un '.product-item' padre, salimos.

        // Extrae los datos del producto de los atributos 'data-' del HTML.
        const id = productItem.dataset.id;
        const name = productItem.dataset.name;
        let price = parseFloat(productItem.dataset.price); // Convierte el precio a número flotante
        const image = productItem.dataset.image;

        // Si el precio no es un número válido, lo establece en 0 y emite una advertencia en consola.
        if (isNaN(price)) {
            price = 0; 
            console.warn(`Producto con ID ${id} tiene un precio inválido: ${productItem.dataset.price}. Establecido a 0.`);
        }

        // Busca si el producto ya existe en el carrito.
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++; // Si el producto ya está en el carrito, solo incrementa su cantidad.
        } else {
            // Si el producto no está en el carrito, lo añade como un nuevo ítem con cantidad 1.
            cart.push({ id, name, price, image, quantity: 1 });
        }
        saveCart(); // Guarda el carrito actualizado y refresca la UI.
    }

    /**
     * Renderiza (dibuja) los ítems del carrito en el contenedor de la página del carrito.
     * Esta función solo se ejecuta si 'cartItemsContainer' existe en la página actual.
     */
    function renderCartItems() {
        if (!cartItemsContainer) return; // Si no hay contenedor, salimos.

        cartItemsContainer.innerHTML = ''; // Limpia el contenido actual del contenedor.
        const total = calculateCartTotal(); // Calcula el total del carrito.

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block'; // Muestra el mensaje de carrito vacío.
        } else {
            emptyCartMessage.style.display = 'none'; // Oculta el mensaje de carrito vacío.
            
            // Itera sobre cada ítem en el carrito para crear su representación HTML.
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item'); // Añade la clase CSS para estilo.
                cartItemDiv.dataset.id = item.id;        // Almacena el ID del producto como un atributo de dato.

                // Inserta el HTML para el ítem del carrito.
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-thumbnail">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                        <div class="cart-item-quantity-controls">
                            <button class="quantity-decrease" data-id="${item.id}">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-from-cart-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv); // Añade el nuevo ítem al contenedor.
            });
        }
        // Actualiza el elemento HTML que muestra el total del carrito.
        cartTotalElement.textContent = total.toFixed(2);
        updateCartCount(); // Asegura que el contador del icono del carrito también esté al día.
    }

    // ===============================================
    // --- 3. EVENT LISTENERS PRINCIPALES ---
    //    Aquí se configuran las interacciones cuando el DOM está listo.
    // ===============================================

    // Listener para los botones "Añadir al Carrito" en todas las páginas de productos.
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) { // Solo si hay botones de añadir al carrito en esta página.
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addProductToCart);
        });
    }

    // Listener para la sección del carrito (delegación de eventos para optimizar).
    // Esto maneja clics en aumentar, disminuir y eliminar dentro del contenedor del carrito.
    if (cartItemsContainer) { // Solo si el contenedor del carrito existe en la página actual.
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target; // El elemento en el que se hizo clic.
            // Intenta obtener el ID del producto desde el elemento clicado o su botón padre más cercano.
            const id = target.dataset.id || target.closest('button')?.dataset.id;
            if (!id) return; // Si no se pudo obtener un ID, salimos.

            const itemIndex = cart.findIndex(item => item.id === id); // Encuentra el índice del ítem en el array del carrito.

            if (itemIndex > -1) { // Si el ítem se encontró en el carrito.
                if (target.classList.contains('quantity-increase')) {
                    cart[itemIndex].quantity++; // Incrementa la cantidad.
                } else if (target.classList.contains('quantity-decrease')) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--; // Decrementa la cantidad si es mayor que 1.
                    } else {
                        // Si la cantidad es 1 y se decreta, pide confirmación para eliminar.
                        if (confirm(`¿Quieres eliminar "${cart[itemIndex].name}" del carrito?`)) {
                            cart.splice(itemIndex, 1); // Elimina el ítem del array.
                        }
                    }
                } else if (target.closest('.remove-from-cart-btn')) { // Si se hizo clic en el botón de eliminar.
                    if (confirm(`¿Estás seguro de que quieres eliminar "${cart[itemIndex].name}" del carrito?`)) {
                        cart.splice(itemIndex, 1); // Elimina el ítem del array.
                    }
                }
                saveCart(); // Guarda los cambios en el carrito y actualiza la UI.
            }
        });

        // Listener para el botón "Vaciar Carrito".
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) { // Pide confirmación.
                    cart = []; // Vacía el array del carrito.
                    saveCart(); // Guarda y actualiza la UI.
                    renderCartItems(); // Vuelve a renderizar el carrito (ahora vacío).
                }
            });
        }
        
        // Renderiza los ítems del carrito al cargar la página si el contenedor existe.
        renderCartItems(); 
    }

    // ===============================================
    // --- 4. LÓGICA DEL MENÚ MÓVIL (MENÚ HAMBURGUESA) ---
    // ===============================================
    
    // Solo ejecuta la lógica del menú hamburguesa si encuentra los elementos en el HTML de la página actual.
    if (menuToggle && navMenu) {
        console.log("Menú hamburguesa: Elementos HTML encontrados. ¡Listo para interactuar!"); // Mensaje de depuración.

        // Escucha el clic en el botón de hamburguesa para abrir/cerrar el menú.
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu'); // Alterna la clase 'show-menu' en la UL de la navegación.
            
            // Cambia el ícono de hamburguesa a 'X' y viceversa.
            const icon = menuToggle.querySelector('i'); // Selecciona el elemento <i> dentro del botón.
            icon.classList.toggle('fa-bars'); // Quita/añade el ícono de barras.
            icon.classList.toggle('fa-times'); // Añade/quita el ícono de 'X'.
        });

        // Cierra el menú automáticamente cuando se hace clic en un enlace (para mejorar la UX móvil).
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu'); // Cierra el menú quitando la clase 'show-menu'.
                
                // Vuelve a cambiar el ícono a hamburguesa al cerrar el menú.
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    } else {
        // Mensajes de advertencia si los elementos del menú no se encuentran (útil para depuración).
        console.warn("Menú hamburguesa: No se encontraron todos los elementos HTML necesarios. Verifique sus selectores y el HTML.");
        if (!menuToggle) console.warn("Elemento '.menu-toggle' (botón de hamburguesa) no encontrado.");
        if (!navMenu) console.warn("Elemento '.contenedor_nav .main-nav ul' (lista de navegación) no encontrado.");
    }
    
    // ===============================================
    // --- 5. LLAMADAS DE INICIALIZACIÓN FINAL ---
    //    Funciones que deben ejecutarse al final para que la UI esté lista.
    // ===============================================

    // Inicializa el contador del carrito al cargar la página para que siempre esté al día.
    updateCartCount(); 

    // Aquí puedes añadir otras funciones que necesiten inicializarse al final del DOMContentLoaded.
    // Por ejemplo: inicializar sliders, cargar datos, etc.

}); // FIN: document.addEventListener('DOMContentLoaded')
