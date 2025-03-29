export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const createRazorpayOrder = async ({ doctor_id, patient_id, amount, meeting_date, meeting_time }) => {
    try {
        const response = await fetch("http://localhost/backend/createOrder.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                doctor_id,
                patient_id,
                amount,
                meeting_date,
                meeting_time,
            }),
        });

        const orderData = await response.json();
        if (!orderData.success) {
            throw new Error("Failed to create order");
        }

        return orderData.order; // Returning order details
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return null;
    }
};

export const processPayment = async (order) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
    }

    return new Promise((resolve, reject) => {
        const options = {
            key: "rzp_test_yzGAVhIYZJF0BR", // Replace with your Razorpay key
            amount: order.amount * 100,
            currency: order.currency,
            name: "Doctor Appointment",
            description: "Payment for Consultation",
            order_id: order.id,
            handler: (response) => {
                resolve(response);
            },
            prefill: {
                name: "John Doe",
                email: "johndoe@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const razor = new window.Razorpay(options);
        razor.open();
        razor.on("payment.failed", (response) => {
            reject(response.error);
        });
    });
};
