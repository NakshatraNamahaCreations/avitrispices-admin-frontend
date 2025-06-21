import React, { useState } from "react";
import { Container, Form, Button, Table, Card, Alert, Spinner } from "react-bootstrap";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderIdsInput, setOrderIdsInput] = useState("");

  const handleFetchOrders = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders([]);

    const orderIds = orderIdsInput
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id);

    if (orderIds.length === 0) {
      setError("Please enter at least one order ID.");
      setLoading(false);  // Stop loading if input is invalid
      return;
    }

    try {
      const response = await fetch("https://api.nncwebsitedevelopment.com/api/rapidshyp/fetch-all-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP Error: ${response.status} - ${errorData.message || "No message"}`);
      }

      const data = await response.json();
      console.log("Backend response:", data); // Debug log

      if (data.success && data.orders?.length > 0) {
        setOrders(data.orders);
      } else {
        setError("No orders found for the provided IDs.");
      }
    } catch (err) {
      console.error("🚨 Error fetching Rapidshyp orders:", err.message);
      setError(`Failed to fetch orders: ${err.message}`);
    } finally {
      setLoading(false); // Ensure loading stops after all attempts
    }
  };

  return (
    <Container className="py-4">
      <h3 className="text-center mb-4">Rapidshyp Orders Dashboard</h3>

      <Form onSubmit={handleFetchOrders} className="mb-4">
        <Form.Group controlId="orderIds">
          <Form.Label>Enter Order IDs (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., ORD-1748865964702"
            value={orderIdsInput}
            onChange={(e) => setOrderIdsInput(e.target.value)}
            required
          />
          <Form.Text className="text-muted">
            Enter one or more seller order IDs separated by commas to fetch specific orders.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Fetching...
            </>
          ) : (
            "Fetch Orders"
          )}
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order.seller_order_id} className="shadow-lg border-0 rounded p-3 mb-3">
            <Card.Body>
              <Card.Title>Order Details</Card.Title>
              <p><strong>Order ID:</strong> {order.seller_order_id}</p>
              <p><strong>AWB:</strong> {order.awb || "N/A"}</p>
              <p><strong>Status:</strong> {order.status || "N/A"}</p>
              {order.tracking_url && (
                <p>
                  <strong>Tracking URL:</strong>{" "}
                  <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                    Track Order
                  </a>
                </p>
              )}
              <p>
                <strong>Customer:</strong> {order.shipping_address?.first_name || "Unknown"}{" "}
                {order.shipping_address?.last_name || ""}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {order.shipping_address?.address_line1 || ""}, {order.shipping_address?.city || ""},{" "}
                {order.shipping_address?.state || ""} - {order.shipping_address?.pin_code || ""}
              </p>
              <p><strong>Total Amount:</strong> ₹{order.total_order_value?.toFixed(2) || 0}</p>
              <p><strong>Payment Method:</strong> {order.payment_method}</p>
              <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
              <hr />
              <h6>Order Items</h6>
              <Table bordered hover responsive style={{width:'90%'}}>
                <thead style={{textAlign:'center'}}>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price (₹)</th>
                  </tr>
                </thead>
                <tbody style={{textAlign:'center'}}>
                  {order.order_items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item_name}</td>
                      <td>{item.units}</td>
                      <td>₹{item.unit_price?.toFixed(2) || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">No orders found.</Alert>
      )}
    </Container>
  );
};

export default OrdersPage;
