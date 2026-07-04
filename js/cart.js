// BEACON Cart Controller
document.addEventListener('DOMContentLoaded', () => {
    // State
    let cart = [];
    const WHATSAPP_NUMBER = "541145559999"; // From concierge contact VIP line
    let activeProductId = null;
    let modalQuantity = 1;

    // Elements
    const cartBtn = document.getElementById('cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartBadge = document.getElementById('cart-badge');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    const cartEmptyState = document.getElementById('cart-empty-state');
    const cartCheckoutWrapper = document.getElementById('cart-checkout-wrapper');

    // Floating Cart Elements
    const floatingCart = document.getElementById('floating-cart');
    const floatingCartCount = document.getElementById('floating-cart-count');
    const floatingCartTotal = document.getElementById('floating-cart-total');
    const floatingCartViewBtn = document.getElementById('floating-cart-view-btn');

    // Product Modal Elements
    const productModal = document.getElementById('product-modal');
    const modalBackdrop = document.getElementById('product-modal-backdrop');
    const modalClose = document.getElementById('product-modal-close');
    const modalImg = document.getElementById('modal-product-img');
    const modalBadge = document.getElementById('modal-product-badge');
    const modalSubtitle = document.getElementById('modal-product-subtitle');
    const modalName = document.getElementById('modal-product-name');
    const modalDesc = document.getElementById('modal-product-desc');
    const modalPrice = document.getElementById('modal-product-price');
    const modalQtyVal = document.getElementById('modal-qty-val');
    const modalDecBtn = document.getElementById('modal-dec-qty');
    const modalIncBtn = document.getElementById('modal-inc-qty');
    const modalAddBtn = document.getElementById('modal-add-btn');

    // Init Cart from LocalStorage
    function initCart() {
        const storedCart = localStorage.getItem('beacon_cart');
        if (storedCart) {
            try {
                cart = JSON.parse(storedCart);
            } catch (e) {
                cart = [];
            }
        }
        updateCart();
    }

    // Save to LocalStorage
    function saveCart() {
        localStorage.setItem('beacon_cart', JSON.stringify(cart));
    }

    // Toggle Drawer
    function toggleDrawer(open) {
        if (open) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('open');
            // Only restore if modal is not open
            if (!productModal || !productModal.classList.contains('visible')) {
                document.body.style.overflow = ''; // Restore background scrolling
            }
        }
        updateFloatingCartVisibility();
    }

    // Toggle Floating Cart Visibility
    function updateFloatingCartVisibility() {
        if (!floatingCart) return;
        const isDrawerOpen = cartDrawer.classList.contains('open');
        const hasItems = cart.length > 0;

        if (hasItems && !isDrawerOpen) {
            floatingCart.classList.add('visible');
        } else {
            floatingCart.classList.remove('visible');
        }
    }

    // Update Cart UI, Badge and LocalStorage
    function updateCart() {
        saveCart();
        renderCartItems();
        updateBadge();
        
        // Update Floating Cart values
        if (floatingCartCount && floatingCartTotal) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            let subtotal = 0;
            cart.forEach(item => {
                const product = window.PRODUCTS.find(p => p.id === item.id);
                if (product) {
                    subtotal += product.price * item.quantity;
                }
            });
            floatingCartCount.textContent = totalItems;
            floatingCartTotal.textContent = `$${subtotal.toLocaleString('es-AR')}`;
        }
        
        updateFloatingCartVisibility();
    }

    // Update Navbar Badge
    function updateBadge() {
        if (!cartBadge) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('hidden');
            cartBadge.classList.add('flex'); // Keep centered alignment
        } else {
            cartBadge.textContent = '';
            cartBadge.classList.add('hidden');
            cartBadge.classList.remove('flex');
        }
    }

    // Render Items inside Drawer
    function renderCartItems() {
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartEmptyState.classList.remove('hidden');
            cartCheckoutWrapper.classList.add('hidden');
            cartSubtotal.textContent = '$0';
            return;
        }

        cartEmptyState.classList.add('hidden');
        cartCheckoutWrapper.classList.remove('hidden');

        let subtotal = 0;
        cartItemsContainer.innerHTML = cart.map(item => {
            const product = window.PRODUCTS.find(p => p.id === item.id);
            if (!product) return '';
            
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            const icon = product.icon || (window.CATEGORY_ICONS && window.CATEGORY_ICONS[product.category]) || 'package';
            return `
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-background border border-black/10 group transition-all hover:bg-tertiary">
                    <div class="w-16 h-16 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 flex-shrink-0 flex items-center justify-center">
                        <i data-lucide="${icon}" class="w-7 h-7 text-primary"></i>
                    </div>
                    <div class="flex-grow">
                        <h5 class="font-display font-bold text-sm text-dark">${product.name}</h5>
                        <p class="text-textSec text-xs">${product.subtitle}</p>
                        <div class="flex items-center justify-between mt-2">
                            <span class="font-bold text-sm text-primary">$${product.price.toLocaleString('es-AR')}</span>
                            <!-- Qty Controls -->
                            <div class="flex items-center gap-2 bg-tertiary border border-black/10 px-2 py-1 rounded-full">
                                <button class="qty-btn dec-qty hover:text-primary transition-colors text-xs" data-id="${item.id}">
                                    <i data-lucide="minus" class="w-3 h-3"></i>
                                </button>
                                <span class="text-xs font-semibold w-4 text-center">${item.quantity}</span>
                                <button class="qty-btn inc-qty hover:text-primary transition-colors text-xs" data-id="${item.id}">
                                    <i data-lucide="plus" class="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button class="remove-item p-2 text-dark/30 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all" data-id="${item.id}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
        }).join('');

        cartSubtotal.textContent = `$${subtotal.toLocaleString('es-AR')}`;
        
        // Re-init icons for dynamic HTML content
        if (window.lucide) {
            window.lucide.createIcons();
        }

    }

    // Event delegation for quantity controls and removal in cart
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            // Dec button
            const decBtn = e.target.closest('.dec-qty');
            if (decBtn) {
                const id = decBtn.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        cart = cart.filter(item => item.id !== id);
                    }
                    updateCart();
                }
                return;
            }

            // Inc button
            const incBtn = e.target.closest('.inc-qty');
            if (incBtn) {
                const id = incBtn.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity++;
                    updateCart();
                }
                return;
            }

            // Remove button
            const removeBtn = e.target.closest('.remove-item');
            if (removeBtn) {
                const id = removeBtn.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
                return;
            }
        });
    }

    // Public method to Add Product to Cart with Quantity
    window.addToCart = function(productId, qty = 1) {
        const product = window.PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            cart.push({ id: productId, quantity: qty });
        }

        updateCart();
        toggleDrawer(true); // Open cart to show user it was added
    };

    // Public method to Open Product Modal
    window.openProductModal = function(productId) {
        const product = window.PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        activeProductId = productId;
        modalQuantity = 1;

        // Populate Modal Fields
        if (modalImg) {
            const icon = product.icon || (window.CATEGORY_ICONS && window.CATEGORY_ICONS[product.category]) || 'package';
            modalImg.style.display = 'none';
            const imgContainer = modalImg.parentElement;
            let iconEl = imgContainer.querySelector('.modal-icon-placeholder');
            if (!iconEl) {
                iconEl = document.createElement('div');
                iconEl.className = 'modal-icon-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-tertiary';
                imgContainer.appendChild(iconEl);
            }
            iconEl.innerHTML = `<div class="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"><i data-lucide="${icon}" class="w-12 h-12 text-primary"></i></div>`;
            if (window.lucide) window.lucide.createIcons();
        }
        if (modalName) modalName.textContent = product.name;
        if (modalSubtitle) modalSubtitle.textContent = product.subtitle;
        if (modalDesc) modalDesc.textContent = product.description;
        if (modalPrice) modalPrice.textContent = `$${product.price.toLocaleString('es-AR')}`;
        if (modalQtyVal) modalQtyVal.textContent = modalQuantity;

        if (modalBadge) {
            if (product.badge) {
                modalBadge.textContent = product.badge;
                modalBadge.classList.remove('hidden');
            } else {
                modalBadge.classList.add('hidden');
            }
        }

        // Show Modal
        if (productModal) {
            productModal.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Lock page scroll
        }
    };

    // Close Product Modal
    function closeProductModal() {
        if (productModal) {
            productModal.classList.remove('visible');
            // Restore body scroll only if cart drawer is not open
            if (!cartDrawer.classList.contains('open')) {
                document.body.style.overflow = '';
            }
        }
        activeProductId = null;
    }

    // Compile WhatsApp Checkout Link
    function checkoutCart() {
        if (cart.length === 0) return;

        let message = `¡Hola BEACON! Me interesa cotizar los siguientes productos de sublimado y diseño:\n\n`;
        let total = 0;

        cart.forEach(item => {
            const product = window.PRODUCTS.find(p => p.id === item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                message += `• ${item.quantity}x ${product.name} - $${product.price.toLocaleString('es-AR')} c/u ($${itemTotal.toLocaleString('es-AR')})\n`;
            }
        });

        message += `\n*Total del Pedido: $${total.toLocaleString('es-AR')}*\n\nPor favor, confírmenme la disponibilidad y los pasos para coordinar la entrega. ¡Gracias!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    // Modal Events Setup
    if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeProductModal);
    }

    if (modalDecBtn) {
        modalDecBtn.addEventListener('click', () => {
            if (modalQuantity > 1) {
                modalQuantity--;
                if (modalQtyVal) modalQtyVal.textContent = modalQuantity;
            }
        });
    }

    if (modalIncBtn) {
        modalIncBtn.addEventListener('click', () => {
            modalQuantity++;
            if (modalQtyVal) modalQtyVal.textContent = modalQuantity;
        });
    }

    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
            if (activeProductId) {
                window.addToCart(activeProductId, modalQuantity);
                closeProductModal();
            }
        });
    }

    // Floating Cart Click Event (Opens main Drawer)
    if (floatingCart) {
        floatingCart.addEventListener('click', (e) => {
            // Check that they didn't click inside a button (if any other actions exist)
            toggleDrawer(true);
        });
    }

    // Global Key Events (ESC to close drawers/modals)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            toggleDrawer(false);
        }
    });

    // Event Listeners for main drawer toggling
    if (cartBtn) {
        cartBtn.addEventListener('click', () => toggleDrawer(true));
    }
    
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', () => toggleDrawer(false));
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => toggleDrawer(false));
    }

    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', checkoutCart);
    }

    // Initialize
    initCart();
});

