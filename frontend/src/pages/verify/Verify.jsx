import React, { useContext, useEffect } from 'react';
import './verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate(); // Corrected name from 'navigat' to 'navigate'
    
    const verifyPayment = async () => { // Corrected async function syntax
        try {
            const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
            if (response.data.success) {
                navigate("/myorders");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            navigate("/"); // Navigate to home if there's an error
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []); // Empty dependency array to run only once

    return (
        <div className="verify">
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;
