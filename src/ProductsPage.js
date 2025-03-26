import React, { useState, useEffect } from "react";
import "./ProductsPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaTrash, FaEdit } from "react-icons/fa";
import { Button, Table, Form, InputGroup, Pagination } from "react-bootstrap";

const ProductsPage = ({ existingProductData }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);


  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    categoryId: "",
    description: "",
    details: "",
    variants: [], 
    stock: "",
    images: [null, null, null, null, null],
  });
  

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  
  useEffect(() => {
    setFilteredProducts(products); 
  }, [products]); 
  
  const handleSearch = (query) => {
    setSearchTerm(query);
    setCurrentPage(1); 
  };
  

  const handleAddVariant = () => {
    const { quantity, variantPrice } = newProduct;
    
    // Ensure both quantity and price are valid
    const price = parseFloat(variantPrice); // Ensure price is a valid number
    if (!quantity || isNaN(price) || price <= 0) {
      alert("Please provide both valid quantity and price.");
      return;
    }
  
    // Add the quantity-price pair to the variants array
    setNewProduct({
      ...newProduct,
      variants: [
        ...newProduct.variants,
        { quantity, price }, // Add price as a number
      ],
      quantity: "",
      variantPrice: "",
    });
  };
  
  const handleRemoveVariant = (index) => {
    const updatedVariants = newProduct.variants.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, variants: updatedVariants });
  };
  

  const handleEditVariant = (index) => {
    const variant = newProduct.variants[index];
    setNewProduct({
      ...newProduct,
      quantity: variant.quantity,
      variantPrice: variant.price,
    });
    setEditingVariantIndex(index);
  };
  
  const handleUpdateVariant = () => {
    if (editingVariantIndex === null) return;
  
    const updatedVariants = [...newProduct.variants];
    updatedVariants[editingVariantIndex] = {
      quantity: newProduct.quantity,
      price: newProduct.variantPrice,
    };
  
    setNewProduct({
      ...newProduct,
      variants: updatedVariants,
      quantity: "",
      variantPrice: "",
    });
    setEditingVariantIndex(null);
  };
  
  
  const filteredData = searchTerm
  ? products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) 
  
    )
  : products;


const totalPages = Math.ceil(filteredData.length / itemsPerPage);


const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentProducts = filteredData.slice(indexOfFirstItem, indexOfLastItem);



  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://api.nncwebsitedevelopment.com/api/products");
      const productsData = response.data.data || [];
      
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const [imagePreviews, setImagePreviews] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = URL.createObjectURL(file); // Create preview URL
      setImagePreviews(updatedPreviews);

      const updatedImages = [...newProduct.images];
      updatedImages[index] = file; // Store actual file for upload
      setNewProduct({ ...newProduct, images: updatedImages });
    }
  };
  
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || newProduct.variants.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Log the variants to check before sending
    console.log("Variants being sent:", newProduct.variants);
  
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("category_id", newProduct.categoryId);  // No need to append SKU
    formData.append("description", newProduct.description);
    formData.append("details", newProduct.details);
    formData.append("stock", newProduct.stock);
  
    // Append only valid image files
    newProduct.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });
  
    // Serialize the variants correctly as a JSON string before appending
    // Use JSON.stringify() to serialize the variants properly.
    const variantsString = JSON.stringify(newProduct.variants);
    formData.append("variants", variantsString);
  
    try {
      const response = await axios.post("https://api.nncwebsitedevelopment.com/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.success) {
        alert("Product added successfully!");
        setNewProduct({
          name: "",
          category: "",
          categoryId: "",
          description: "",
          details: "",
          stock: "",
          images: [null, null, null, null, null],
          variants: [], // Reset variants
        });
        window.location.reload();
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      alert("An error occurred while adding the product.");
    }
  };
  
const handleUpdateProduct = async () => {
  try {
    if (!newProduct._id) {
      console.error("No product ID found for update.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("details", newProduct.details);
    formData.append("stock", newProduct.stock);

    if (newProduct.images && newProduct.images.length > 0) {
      newProduct.images.forEach((file) => {
        formData.append("images", file); 
      });
    }

    const response = await axios.put(
      `https://api.nncwebsitedevelopment.com/api/products/${newProduct._id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }, 
      }
    );

    if (response.data.success) {
      alert("Product updated successfully!");
      setIsAddingProduct(false); 
      setIsEditingProduct(false); 
      fetchProducts(); 
    } else {
      alert(response.data.message || "Failed to update product.");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Failed to update product.");
  }
};

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product._id === productId);
    
    if (!productToEdit) return;
  
    // Map image URLs correctly
    const updatedImagePreviews = productToEdit.images.map(
      (image) => (typeof image === "string" ? image : null)
    );
  
    setNewProduct({
      ...productToEdit,
      category: productToEdit.category || "",
      images: productToEdit.images, // Ensure images are set properly
    });
  
    setImagePreviews(updatedImagePreviews);
    setIsAddingProduct(true);
    setIsEditingProduct(true);
  };
  
  
  

  const handleDeleteProduct = async (productId) => {
    try {
      console.log("Delete product with id:", productId); 

      const response = await axios.delete(
        `https://api.nncwebsitedevelopment.com/api/products/${productId}`
      );

      if (response.data.success) {
        alert("Product deleted successfully!");
       
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
      alert("An error occurred while deleting the product.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://api.nncwebsitedevelopment.com/api/categories");
      console.log("API Response Inside fetchCategories:", response.data); 
      setCategories(response.data || []); 
      console.log("Categories After setCategories:", response.data); 
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

const handleCategoryChange = (selectedCategory) => {
  const findCategory = categories.find(
    (category) => category.category === selectedCategory
  );

  setNewProduct({
    ...newProduct,
    category: findCategory.category,
    categoryId: findCategory._id,
  });
};

  
  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };
  

  const handleBackToTable = () => {
    setSelectedProduct(null);
  };

  return (
    <div
      className="container my-4"
      style={{ maxWidth: "120%", marginLeft: "10%" }}
    >
      <div className="row">
        {/* Left Column - Products */}
        <div className="col-md-8 mx-auto" style={{ width: "80%" }}>
          <h3
            className="mb-4 text-center"
            style={{ color: "#333", fontWeight: "bold" }}
          ></h3>

          {isAddingProduct ? (
            <div
              style={{
                padding: "15px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <button
                  variant="secondary"
                  onClick={() => setIsAddingProduct(false)}
                  style={{
                    padding: "10px",
                    backgroundColor: "transparent",
                    color: "#333",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
                  </svg>
                </button>
                <h2
                  style={{
                    textAlign: "left",
                    color: "#333",
                    flexGrow: 1,
                    margin: 0,
                  }}
                >
                  {isEditingProduct ? "Edit Product" : "Add Product"}
                </h2>
              </div>

              {/* <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
  {[0, 1, 2].map((index) => (
    <div
      key={index}
      style={{
        width: "200px",
        height: "338px",
        border: "3px dashed #ccc",
      }}
    >
      <label htmlFor={`image${index}` }>
        {imagePreviews[index] ? (
          <img
            src={imagePreviews[index]}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          "+ Add Image"
        )}
      </label>
      <input
        id={`image${index}`}
        type="file"
        onChange={(e) => handleImageChange(e, index)}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  ))}
</div> */}



<div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
  {[0, 1, 2, 3].map((index) => (
    <div
      key={index}
      style={{
        width: "200px",
        height: "260px", // 🔒 Fixed height
        border: "2px dashed #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <label
        htmlFor={`image${index}`}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imagePreviews[index] ? (
          <img
            src={imagePreviews[index]}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // 🔐 This keeps it inside the fixed box
              borderRadius: "8px",
            }}
          />
        ) : (
          <span
            style={{
              color: "#aaa",
              fontSize: "16px",
              textAlign: "center",
              padding: "10px",
            }}
          >
            + Add Image
          </span>
        )}
      </label>
      <input
        id={`image${index}`}
        type="file"
        onChange={(e) => handleImageChange(e, index)}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  ))}
</div>





              <div
                style={{ display: "flex", gap: "15px", marginBottom: "20px" }}
              >
                {/* Product Name */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    style={{
                      width: "93%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                {/* Category */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Category
                  </label>

                  <select
  style={{
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  }}
  value={newProduct.category || ""} 
  onChange={(e) => handleCategoryChange(e.target.value)}
>
  <option value="">-- Select Category --</option>
  {categories.length > 0 ? (
    categories.map((category) => (
      <option key={category._id} value={category.category}>
        {category.category}
      </option>
    ))
  ) : (
    <option disabled>Loading categories...</option>
  )}
</select>

                </div>

               
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    style={{
                      width: "93%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
              <div
                style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
              >
                
                {/* <div style={{ flex: 1,  }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div> */}
              <div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '58px',
  flexWrap: 'wrap',
}}>
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ fontSize: '13px', marginBottom: '3px' }}>Quantity</label>
    <input
      type="text"
      placeholder="e.g., 500g"
      value={newProduct.quantity || ""}
      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
      style={{
        padding: "6px 8px",
        width: "120px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px"
      }}
    />
  </div>

  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ fontSize: '13px', marginBottom: '3px' }}>Price</label>
    <input
      type="number"
      placeholder="e.g., 199"
      value={newProduct.variantPrice || ""}
      onChange={(e) => setNewProduct({ ...newProduct, variantPrice: e.target.value })}
      style={{
        padding: "6px 8px",
        width: "120px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px"
      }}
    />
  </div>

  <button
    type="button"
    onClick={editingVariantIndex !== null ? handleUpdateVariant : handleAddVariant}
    style={{
      marginTop: '22px',
      backgroundColor: editingVariantIndex !== null ? "" : "#28a745",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer"
    }}
  >
    {editingVariantIndex !== null ? "Save" : "+"}
  </button>
</div>
<div style={{ marginTop: "15px" }}>
  <p style={{ fontWeight: "bold", marginBottom: "8px" }}>Added Variants</p>
  {newProduct.variants.map((variant, index) => (
    <div key={index} style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: "1px solid #eee",
      padding: "8px 12px",
      borderRadius: "6px",
      background: "#f9f9f9",
      marginBottom: "6px"
    }}>
      <span style={{ fontSize: "14px" }}>
        <strong>Qty:</strong> {variant.quantity} | <strong>Price:</strong> ₹{variant.price}
      </span>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => handleEditVariant(index)}
          style={{
            backgroundColor: "gray",
            color: "black",
            borderColor:'black',
            border: "none",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "13px",
            marginLeft:"10px",
            cursor: "pointer"
          }}
        >
          Edit
        </button>
        <button
          onClick={() => handleRemoveVariant(index)}
          style={{
            backgroundColor: "gray",
            color: "white",
            border: "none",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "13px",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


                
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
             
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={
                    isEditingProduct ? handleUpdateProduct : handleAddProduct
                  }
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#593E3E",
                    color: "#fff",
                    marginLeft: "auto",
                    border: "none",
                    // marginTop:'80%',
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isEditingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "-3%",
                  position:'relative'
                }}
              >
                <div style={{ position: "relative" }}>
                <input
  type="text"
  placeholder="Search "
  style={{ padding: "5px 10px 5px 30px", width: "250px" }}
  value={searchTerm}
  onChange={(e) => handleSearch(e.target.value)}
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
                    onClick={() => setIsAddingProduct(true)}
                    style={{ padding: "5px 10px", cursor: "pointer",  }}
                  >
                    + Add Product
                  </button>
                </div>
              </div>

              <div>
                {/* Show Table if no product is selected */}
                {!selectedProduct && (
                 <>
                 <Table striped bordered hover responsive className="product-table shadow-sm">
                   <thead style={{ textAlign: "center" }}>
                     <tr>
                       <th>Sl.no</th>
                       <th>Product Name</th>
                       <th>Category</th>
                       {/* <th>Price</th> */}
                       {/* <th>SKU</th> */}
                       <th>Created Date</th>
                       <th>Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {currentProducts .map((product, index) => (
                       <tr key={product._id} style={{ cursor: "pointer" }}>
                         <td>{indexOfFirstItem + index + 1}</td>
                         <td onClick={() => handleRowClick(product)}>{product.name}</td>
                         <td onClick={() => handleRowClick(product)}>{product.category}</td>
                         {/* <td onClick={() => handleRowClick(product)}>{product.price}</td> */}
                         {/* <td onClick={() => handleRowClick(product)}>{product.sku}</td> */}
                         <td onClick={() => handleRowClick(product)}>
                           {product.formattedCreatedDate}
                         </td>
                         <td>
                           <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                             <FaEdit
                               style={{ cursor: "pointer", marginRight: "5px" }}
                               onClick={() => handleEditProduct(product._id)}
                             />
                             <FaTrash
                               style={{ cursor: "pointer", color: "red" }}
                               onClick={() => handleDeleteProduct(product._id)}
                             />
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </Table>
           
                 {/* Pagination Controls */}
                 <Pagination className="justify-content-center">
  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
  <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

  {Array.from({ length: totalPages }, (_, i) => (
    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
      {i + 1}
    </Pagination.Item>
  ))}

  <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
  <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
</Pagination>

               </>
                )}

                {/* Show Details if a product is selected */}
                {selectedProduct && (
                  <div>
                    <button
                      variant="secondary"
                      onClick={handleBackToTable}
                      style={{
                        padding: "10px",
                        backgroundColor: "transparent",
                        color: "#333",
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      aria-label="Back"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
                      </svg>
                    </button>
                    <div
                      style={{
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        maxWidth: "900px",
                        margin: "0 auto",
                      }}
                    >
                    
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          marginBottom: "20px",
                        }}
                      >
 {selectedProduct.images && 
  selectedProduct.images.map((image, index) => {
    console.log("Image URL:", image);

    const filename = image.split("/").pop();
    const fullImageUrl = `https://api.nncwebsitedevelopment.com/uploads/${filename}`;
    


    return (
      <div
        key={index}
        style={{
          width: "120px",
          height: "120px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <img
          src={fullImageUrl}
          alt={`Product ${index}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  })
}



                        <div
                          style={{
                            width: "120px",
                            height: "120px",
                            border: "1px dashed #ccc",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ fontSize: "24px", color: "#aaa" }}>
                            + Add images
                          </span>
                        </div>
                      </div>

                      {/* Category, Sub-category, and Attributes */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "15px",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            padding: "10px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <strong>Category:</strong> {selectedProduct.category}
                        </div>
                        {/* <div
                          style={{
                            padding: "10px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <strong>Sub-category:</strong>{" "}
                          {selectedProduct.subCategory} */}
                        {/* </div> */}
                        {/* <div
                          style={{
                            padding: "10px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <strong>Length:</strong> {selectedProduct.length}
                        </div> */}
                        {/* <div
                          style={{
                            padding: "10px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <strong>Width:</strong> {selectedProduct.width}
                        </div> */}
                        {/* <div
                          style={{
                            padding: "10px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <strong>SKU:</strong> {selectedProduct.sku}
                        </div> */}
                        {/* <div
                          style={{
                            padding: "10px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <strong>Color:</strong> {selectedProduct.color}
                        </div> */}
                        {/* <div
                          style={{
                            padding: "10px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <strong>Material:</strong> {selectedProduct.material}
                        </div> */}
                      </div>

                      {/* Description */}
                      <div>
                        <h3>Description</h3>
                        <p style={{ lineHeight: "1.6", color: "#555" }}>
                          {selectedProduct.description}
                        </p>
                      </div>
                      {/* <div>
                        <h3>Details</h3>
                        <p style={{ lineHeight: "1.6", color: "#555" }}>
                          {selectedProduct.details}
                        </p>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
