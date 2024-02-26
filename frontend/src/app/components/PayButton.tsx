import React, { useEffect, useRef, useState } from "react";

function PaymentButton() {
    const [merchantPaymentId, setMerchantPaymentId] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const ticketCreated = useRef(false);  // Using ref to immediately block further executions

  const handlePayment = async () => {
    const payload = {
      orderItems: [
        {
          name: "Green Tea Ice Cream",
          category: "Desserts",
          quantity: 1,
          productId: 201,
          unitPrice: {
            amount: 1,
            currency: "JPY"
          }
        }
      ],
      amount: {
        amount: 1,
        currency: "JPY"
      }
    };

    try {
      const response = await fetch('http://localhost:10000/create-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.data && data.data.url) {
        setMerchantPaymentId(data.data.merchantPaymentId);
        window.open(data.data.url, '_blank'); // Open the payment URL in a new tab
      } else {
        throw new Error('No URL or merchantPaymentId provided in the response');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!merchantPaymentId || ticketCreated.current) return;  // Check the ref to prevent further execution

      try {
        const response = await fetch(`http://localhost:10000/order-status/${merchantPaymentId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPaymentStatus(data.data.status);

        if (data.data.status === "COMPLETED" && !ticketCreated.current) {
          ticketCreated.current = true;  // Update the ref to block further executions

          const ticketResponse = await fetch(`http://localhost:10000/ticket/can`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: "Useable" }),
          });

          if (!ticketResponse.ok) {
            throw new Error(`HTTP error! status: ${ticketResponse.status}`);
          }
          console.log("Ticket created successfully");
        }
      } catch (error) {
        console.error("Failed to check payment status or create ticket:", error);
      }
    };

    if (merchantPaymentId && !ticketCreated.current) {
      const intervalId = setInterval(checkPaymentStatus, 5000);  // Check every 5 seconds
      return () => clearInterval(intervalId);  // Cleanup on unmount
    }
  }, [merchantPaymentId]);  // Dependency array

  return (
    <div className="pt-5">
      <button onClick={handlePayment} className="w-full text-white bg-spgreen hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-green-600 focus:outline-none">
        Payment
      </button >
      {merchantPaymentId && <div className="pt-5">Payment Status: {paymentStatus}</div>}
    </div>
  );
}

export default PaymentButton;
