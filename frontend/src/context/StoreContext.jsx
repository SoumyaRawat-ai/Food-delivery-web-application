import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    const saveCartItems = (items) => {
        localStorage.setItem("cartItems", JSON.stringify(items));
    };

    const fetchCartItems = async () => {
        if (token) {
            const response = await axios.get(url + "/api/cart", { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
                saveCartItems(response.data.cartData);
            }
        }
    };

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    };
    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get",{},{headers:{token}})
        setCartItems (response.data.cartData);
    }
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            const newCartItems = { ...cartItems, [itemId]: 1 };
            setCartItems(newCartItems);
            saveCartItems(newCartItems);
        } else {
            const newCartItems = { ...cartItems, [itemId]: cartItems[itemId] + 1 };
            setCartItems(newCartItems);
            saveCartItems(newCartItems);
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            await fetchCartItems(); // Fetch updated cart items
        }
    };

    const removeFromCart = async (itemId) => {
        const newCartItems = { ...cartItems, [itemId]: cartItems[itemId] - 1 };
        setCartItems(newCartItems);
        saveCartItems(newCartItems);
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            await fetchCartItems(); // Fetch updated cart items
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
            const storedCartItems = localStorage.getItem("cartItems");
            if (storedCartItems) {
                setCartItems(JSON.parse(storedCartItems));
            }
            await fetchCartItems(); // Fetch updated cart items on load
        }
        loadData();
    }, [token]);

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};
export default StoreContextProvider;
