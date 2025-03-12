import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

function Marketing() {
  const [banner, setBanner] = useState(null);
  const [category, setCategory] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);

  const formData = new FormData();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getCategoryData = async () => {
    try {
      const response = await axios.get("https://api.nncwebsitedevelopment.com/api/categories");
      console.log("Categories API Response:", response.data);
      if (response.status === 200) {
        setCategoryData(response.data || []); 
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  

  const getBannerImages = async () => {
    try {
      const response = await axios.get("https://api.nncwebsitedevelopment.com/api/banners");
      if (response.status === 200) {
        setBannerData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const postBanner = async (e) => {
    e.preventDefault();
  
    if (!banner || !category) {
      alert("Please select a banner image and category.");
      return;
    }
  
    const formData = new FormData(); // Ensure it's inside the function
    formData.append("banner", banner);
    formData.append("category", category);
  
    try {
      const response = await axios.post("https://api.nncwebsitedevelopment.com/api/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 201) {
        alert("Banner added successfully!");
        setShow(false);
        getBannerImages();
      }
    } catch (error) {
      console.error("Error adding banner:", error.response?.data || error);
      alert("Failed to add banner. " + (error.response?.data?.message || ""));
    }
  };
  
  
  
  useEffect(() => {
    getCategoryData();
    getBannerImages();
  }, []);

  const deleteBanner = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const response = await axios.delete(`https://api.nncwebsitedevelopment.com/api/banners/${bannerId}`);
        if (response.status === 200) {
          alert(response.data.message);
          getBannerImages(); // Refresh the banner list
        }
      } catch (error) {
        console.error("Error deleting banner:", error);
        alert("Failed to delete banner.");
      }
    }
  };
  

  return (
    <div className="row">
      <div style={{ display: "flex", alignItems: "center", marginTop: "1%" }}>
        <div style={{ position: "relative", marginLeft: "20%" }}>
          <input
            type="text"
            placeholder="Search by status"
            style={{ padding: "5px 10px 5px 30px", width: "200px" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <i
            className="fa fa-search"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          ></i>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={handleShow}
            style={{ padding: "5px 10px", cursor: "pointer" }}
          >
            Add Banner
          </button>
        </div>
      </div>

      <div className="row pt-3 m-auto" style={{ marginLeft: "25%" }}>
        <Table striped
                    bordered
                    hover
                    responsive
                    className="product-table shadow-sm" style={{width:"80%", marginLeft:'19%'}}>
          <thead style={{textAlign:'center'}}>
            <tr>
              <th>SI.No</th>
              <th>Category</th>
              <th>Banner Images</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bannerData && bannerData.length > 0 ? (
              bannerData.map((element, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{element.category}</td>
                  <td>
                    <img
                       src={`https://api.nncwebsitedevelopment.com/uploads/${element.banner}`}
                      alt="Banner"
                      style={{ width: "41%", height: "", objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => deleteBanner(element._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No banners available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

     <Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Add Banner</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div>
      <label>Select Category</label>
      <select
        className="form-control"
        onChange={(e) => setCategory(e.target.value)}
        value={category}
      >
        <option value="">-- Select Category --</option>
        {categoryData.map((item) => (
          <option key={item._id} value={item.category}>
            {item.category}
          </option>
        ))}
      </select>
    </div>
    <div className="mt-3">
      <label>Select Banner Image</label>
      <small className="form-text text-muted">
        Image must have a height of 400px.
      </small>
      <input
        type="file"
        className="form-control"
        onChange={(e) => setBanner(e.target.files[0])}
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
    <Button variant="primary" onClick={postBanner}>
      Save
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default Marketing;
