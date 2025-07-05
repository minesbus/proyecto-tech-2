document.addEventListener('DOMContentLoaded', () => {

    
    
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || []; 
    const cartCountElements = document.querySelectorAll('.cart-count');

    // --- variables para el Carrito ----
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    
    // --- variables  para el Menú Móvil ---
    const btnMenu = document.getElementById('btn_menu');
    const navMenu = document.querySelector('.contenedor_nav nav ul'); 

    // --- Funciones del Carrito ---

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
        
        // Mostrar/ocultar mensaje de carrito vacío
        if (emptyCartMessage) {
            emptyCartMessage.style.display = cart.length === 0 ? 'block' : 'none';
        }
    }

    function calculateCartTotal() {
        return cart.reduce((total, item) => {
            // Asegurarme que precioy cantidad  sean números válidos antes de multiplicar
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    }

    // --- Lógica de Añadir al Carrito  ---

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
                {
                    cart = [];
                    saveCart();
                    renderCartItems(); 
                }
            });
        }

        
        renderCartItems();
    }

    
    

   
    // --- Lógica del Menú Móvil ---
    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu'); 
            const icon = btnMenu.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times'); 
        });
    }

    
    updateCartCount();
});

