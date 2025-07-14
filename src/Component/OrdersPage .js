import React, { useEffect, useState } from "react";
import { Container, Table, Card, Alert, Spinner, Button, Modal, Pagination } from "react-bootstrap";
import { FaEye, FaClock, FaCogs, FaShippingFast, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token") || "dummyToken";
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get("https://api.nncwebsitedevelopment.com/api/orders", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setOrders(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(selectedOrder && selectedOrder._id === order._id ? null : order);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token") || "dummyToken";
      if (!token) {
        toast.error("Please log in to update order status.");
        return;
      }

      const response = await axios.put(
        `https://api.nncwebsitedevelopment.com/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Order status updated successfully!");
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      toast.error(`Error updating status: ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setShowConfirmModal(false);
      setPendingStatusUpdate(null);
    }
  };

  const handleConfirmStatusUpdate = (orderId, newStatus) => {
    setPendingStatusUpdate({ orderId, newStatus });
    setShowConfirmModal(true);
  };

  const getStatusButton = (order) => {
    const statusMap = {
      Pending: {
        next: "Processing",
        icon: <FaClock />,
        style: {
          backgroundColor: "#facc15",
          color: "#fff",
          border: "none",
        },
        text: "Mark as Processing",
      },
      Processing: {
        next: "Shipped",
        icon: <FaCogs />,
        style: {
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
        },
        text: "Mark as Shipped",
      },
      Shipped: {
        next: "Delivered",
        icon: <FaShippingFast />,
        style: {
          backgroundColor: "#a855f7",
          color: "#fff",
          border: "none",
        },
        text: "Mark as Delivered",
      },
      Delivered: {
        icon: <FaCheckCircle />,
        style: {
          backgroundColor: "#22c55e",
          color: "#fff",
          border: "none",
        },
        text: "Delivered",
        disabled: true,
      },
    };

    const { next, icon, style, text, disabled } = statusMap[order.status] || {};
    if (!next && !disabled) return null;

    return (
      <Button
        style={style}
        className="d-flex align-items-center gap-2 px-3 py-2"
        onClick={() => !disabled && handleConfirmStatusUpdate(order._id, next)}
        disabled={disabled}
      >
        {icon} {text}
      </Button>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: {
        backgroundColor: "#fef9c3",
        color: "#854d0e",
        padding: "5px 10px",
        borderRadius: "12px",
      },
      Processing: {
        backgroundColor: "#bfdbfe",
        color: "#1e3a8a",
        padding: "5px 10px",
        borderRadius: "12px",
      },
      Shipped: {
        backgroundColor: "#e9d5ff",
        color: "#6b21a8",
        padding: "5px 10px",
        borderRadius: "12px",
      },
      Delivered: {
        backgroundColor: "#bbf7d0",
        color: "#166534",
        padding: "5px 10px",
        borderRadius: "12px",
      },
    };

    return (
      <span style={statusStyles[status] || { backgroundColor: "#e5e7eb", color: "#374151", padding: "5px 10px", borderRadius: "12px" }}>
        {status}
      </span>
    );
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', paddingTop: '2rem' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Container style={{ maxWidth: '1200px', marginLeft: '17%', padding: '0 15px' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: '2rem' }}>
          All Orders
        </h3>
        {loading && <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />}
        {error && (
          <Alert variant="danger" style={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
            {error}
          </Alert>
        )}

        {!loading && !selectedOrder && orders.length > 0 ? (
          <>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Table bordered hover responsive style={{ textAlign: 'center', width: '100%', marginBottom: '0' }}>
                <thead style={{ backgroundColor: '#1f2937', color: '#fff' }}>
                  <tr>
                    <th style={{ padding: '12px' }}>Sl No</th>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Amount</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order, index) => (
                    <tr
                      key={order._id}
                      style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : '#fff', transition: 'background-color 0.2s' }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '12px' }}>{indexOfFirstOrder + index + 1}</td>
                      <td style={{ padding: '12px' }}>{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</td>
                      <td style={{ padding: '12px' }}>₹{order.total.toFixed(2)}</td>
                      <td style={{ padding: '12px' }}>{getStatusBadge(order.status)}</td>
                      <td style={{ padding: '12px' }}>{formatDate(order.createdAt)}</td>
                      <td style={{ padding: '12px' }}>
                        <Button
                          variant="link"
                          onClick={() => handleViewOrder(order)}
                          title="View Details"
                          style={{ color: '#4b5563', padding: '0' }}
                          className="hover:text-primary"
                        >
                          <FaEye style={{ fontSize: '1.2rem' }} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Pagination style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </>
        ) : (
          !loading &&
          !selectedOrder && (
            <Alert variant="info" style={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
              No orders found.
            </Alert>
          )
        )}

        {selectedOrder && (
          <Card
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              marginTop: '2rem',
              animation: 'fadeIn 0.5s ease-out',
            }}
          >
            <div
              style={{
                color: '#000',
                padding: '1.5rem',
                textAlign: 'center',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
              }}
            >
              <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>
                Order ID: {selectedOrder.orderId}
              </Card.Title>
            </div>
            <Card.Body style={{ padding: '2rem' }}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setSelectedOrder(null)}
                style={{
                  borderRadius: '20px',
                  border: '2px solid #d1d5db',
                  padding: '6px 12px',
                  marginBottom: '1.5rem',
                }}
                className="hover:border-primary hover:text-primary"
              >
                Back to Orders
              </Button>
              <div className="row">
                <div className="col-md-6" style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Customer Details
                  </h5>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Name:</strong> {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Email:</strong> {selectedOrder.shippingAddress.email}
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Address:</strong> {selectedOrder.shippingAddress.addressLine1}
                    {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                    , {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pinCode}, {selectedOrder.shippingAddress.country}
                  </p>
                </div>
                <div className="col-md-6" style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Order Details
                  </h5>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Payment:</strong> {selectedOrder.paymentMethod}
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Total:</strong> ₹{selectedOrder.total.toFixed(2)}
                  </p>
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </p>
                  <div style={{ marginTop: '1rem' }}>{getStatusButton(selectedOrder)}</div>
                </div>
              </div>
              <h5 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '1rem' }}>
                Products
              </h5>
              <div style={{ overflowX: 'auto' }}>
                <Table bordered hover responsive style={{ marginBottom: '0' }}>
                  <thead style={{ backgroundColor: '#f3f4f6' }}>
                    <tr>
                      <th style={{ padding: '12px' }}>Image</th>
                      <th style={{ padding: '12px' }}>Item</th>
                      <th style={{ padding: '12px' }}>Quantity</th>
                      <th style={{ padding: '12px' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: '12px' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '80px', height: 'auto', objectFit: 'contain', borderRadius: '4px' }}
                          />
                        </td>
                        <td style={{ padding: '12px' }}>{item.name}</td>
                        <td style={{ padding: '12px' }}>{item.quantity}</td>
                        <td style={{ padding: '12px' }}>₹{item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Status Change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to change the order status to "{pendingStatusUpdate?.newStatus}"?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              style={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleStatusUpdate(pendingStatusUpdate.orderId, pendingStatusUpdate.newStatus)}
              style={{ borderRadius: '8px', backgroundColor: '#2563eb', border: 'none' }}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <style>{`
        .table-row-hover:hover {
          background-color: #f1f5f9 !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover\:text-primary:hover {
          color: #2563eb !important;
        }
        .hover\:border-primary:hover {
          border-color: #2563eb !important;
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;