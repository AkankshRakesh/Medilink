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

export const createRazorpayOrder = async (payload) => {
  try {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/createOrder.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to create order");
    }

    return data;
  } catch (error) {
    console.error("Error details:", {
      error: error.message,
      payload,
      stack: error.stack
    });
    throw error;
  }
};

export const initRazorpay = async () => {
    if (window.Razorpay) return true;
  
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) {
          resolve(true);
        } else {
          console.warn("Razorpay loaded but not available");
          resolve(false);
        }
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

export const processPayment = (order) => {
    return new Promise(async (resolve, reject) => {
      try {
        const initialized = await initRazorpay();
        if (!initialized) {
          throw new Error("Payment system unavailable");
        }
  
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_yzGAVhIYZJF0BR",
          amount: order.amount * 100, 
          currency: "INR",
          name: "Medilink",
          description: "Payment Description",
          order_id: order.razorpay_order_id, 
          handler: (response) => {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: order.razorpay_order_id,
              signature: response.razorpay_signature
            });
          },
          prefill: {
            name: order.patient_name || "Customer Name",
            email: order.patient_email || "customer@email.com",
            contact: order.patient_phone || "9000000000"
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment window closed by user"));
            }
          }
        };
  
        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', (response) => {
          reject(new Error(response.error.description || "Payment failed"));
        });
  
        rzp.open();
  
      } catch (error) {
        reject(error);
      }
    });
  };
