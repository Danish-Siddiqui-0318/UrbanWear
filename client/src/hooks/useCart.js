import { useState, useEffect } from "react";

// Hook to manage cart state with localStorage persistence
export const useCart = () => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("urbanwear_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("urbanwear_cart", JSON.stringify(cart));
        // Dispatch a custom event so other components (like Navbar) can update
        window.dispatchEvent(new Event("cartUpdate"));
    }, [cart]);

    const addToCart = (product, quantity, size) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => item._id === product._id && item.size === size
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            }

            return [...prevCart, { 
                _id: product._id, 
                name: product.name, 
                price: product.price, 
                image: product.images[0]?.url, 
                quantity, 
                size,
                category: product.category
            }];
        });
    };

    const removeFromCart = (productId, size) => {
        setCart(prevCart => prevCart.filter(item => !(item._id === productId && item.size === size)));
    };

    const updateQuantity = (productId, size, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart => prevCart.map(item => 
            (item._id === productId && item.size === size) 
                ? { ...item, quantity: newQuantity } 
                : item
        ));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return { 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal,
        itemCount: cart.reduce((total, item) => total + item.quantity, 0)
    };
};
