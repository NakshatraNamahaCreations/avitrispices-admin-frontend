import React, { useEffect, useState } from "react";


import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";

const active = {
  backgroundColor: "rgb(169, 4, 46)",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
};
const inactive = { color: "black", backgroundColor: "white" };
function Voucher() {
  const [selected, setSelected] = useState(0);
  const handleClick = (divNum) => () => {
    setSelected(divNum);
  };

  const [categorydata, setcategorydata] = useState([]);
  const [category, setcategory] = useState("");
  const [voucherCode, setvoucherCode] = useState("");
  const [discountPercentage, setdiscountPercentage] = useState("");
  const [startDate, setstartDate] = useState("");
  const [expDate, setexpDate] = useState("");
  const [desc, setdesc] = useState("");
  const [htuse, sethtuse] = useState("");

  const [voucherdata, setvoucherdata] = useState([]);

  const addvoucher = async (e) => {
    e.preventDefault();
    if (
      !category ||
      !voucherCode ||
      !discountPercentage ||
      !startDate ||
      !expDate ||
      !desc
    ) {
      alert("Please fill all the fields");
    } else {
      try {
        const config = {
          url: "/addvoucher",
          method: "post",
          baseURL: "https://api.nncwebsitedevelopment.com/api",
          headers: { "content-type": "application/json" },
          data: {
            category: category,
            voucherCode: voucherCode,
            discountPercentage: discountPercentage,
            startDate: startDate,
            expDate: expDate,
            desc: desc,
            htuse: htuse,
          },
        };
        const response = await axios(config);

        if (response.status === 200) {
          console.log("success");
          alert("Added");
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          alert(error.response.data.error); // Display error message from the API response
        } else {
          alert("An error occurred. Please try again later.");
        }
      }
    }
  };

  useEffect(() => {
    getcategory();
    getvoucher();
  }, []);



   const getcategory = async () => {
    try {
      const response = await axios.get("https://api.nncwebsitedevelopment.com/api/categories");
      console.log("API Response Inside fetchCategories:", response.data);
      setcategorydata(response.data || []); 
      console.log("Categories After setCategories:", response.data); 
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };



  const getvoucher = async () => {
    let res = await axios.get("https://api.nncwebsitedevelopment.com/api/getvoucher");
    if ((res.status = 200)) {
      setvoucherdata(res.data?.voucher);
    }
  };
  const deletevoucher = async (id) => {
    axios({
      method: "post",
      url: "https://api.nncwebsitedevelopment.com/api/deletevoucher/" + id,
    })
      .then(function (response) {
        //handle success
        console.log(response);
        alert("Deleted successfully");
        window.location.reload();
      })
      .catch(function (error) {
        //handle error
        console.log(error.response.data);
      });
  };
  return (
    <div className="row" style={{marginLeft:'20%'}}>

        <div className="d-flex float-end mt-4 mb-3">
          <button
            className="btn-primary-button mx-2"
            style={selected == 1 ? active : inactive}
            onClick={handleClick(1)}
          >
            Add Voucher
          </button>

          <button
            style={selected == 0 ? active : inactive}
            onClick={handleClick(0)}
            className="btn-secondary-button"
          >
            All Voucher
          </button>
        </div>

        <div className="row w-100">
          <div className="col-md-12">
            {selected == 0 ? (
              <>
                {" "}
                <table class="table table-hover table-bordered mt-5">
                  <thead className="">
                    <tr className="table-secondary">
                      <th className="table-head" scope="col">
                        S.No
                      </th>
                      <th className="table-head" scope="col">
                        Category
                      </th>
                      <th className="table-head" scope="col">
                        Voucher Code
                      </th>
                      <th className="table-head" scope="col">
                        Description
                      </th>

                      <th className="table-head" scope="col">
                        Discount Percentage
                      </th>
                      <th className="table-head" scope="col">
                        How may time use
                      </th>
                      <th className="table-head" scope="col">
                        Start Date
                      </th>
                      <th className="table-head" scope="col">
                        Exp date
                      </th>
                      <th className="table-head" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {voucherdata.map((i, index) => (
                      <tr className="user-tbale-body">
                        <td className="text-center">{index + 1}</td>
                        <td>{i.category}</td>
                        <td className="text-center">{i.voucherCode}</td>
                        <td className="text-center">{i.desc}</td>
                        <td className="text-center">{i.discountPercentage}</td>
                        <td className="text-center">{i.htuse}</td>

                        <td className="text-center">{i.startDate}</td>
                        <td>{i.expDate}</td>
                        <td onClick={() => deletevoucher(i._id)}>Delete</td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </>
            ) : (
              <>
                {" "}
                <div className="card mt-4">
                  <div className="card-body p-3">
                    {/* <div className="vhs-sub-heading pb-2">Add New Record</div> */}

                    <Form>
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label> Voucher Code</Form.Label>
                          <Form.Control
                            placeholder=" Voucher code "
                            onChange={(e) => setvoucherCode(e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label> Description</Form.Label>
                          <Form.Control
                            placeholder=" Description "
                            onChange={(e) => setdesc(e.target.value)}
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label> Discount Percentage</Form.Label>
                          <Form.Control
                            placeholder=" Discount "
                            onChange={(e) =>
                              setdiscountPercentage(e.target.value)
                            }
                          />
                          <b>(Example=10)</b>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label> Category</Form.Label>
                          <InputGroup className="mb-2">
                            <Form.Select
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              onChange={(e) => setcategory(e.target.value)}
                            >
                              <option>-Select Category-</option>
                              {categorydata.map((item) => (
                                <option value={item.category}>
                                  {item.category}
                                </option>
                              ))}
                            </Form.Select>
                          </InputGroup>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label> Start Date</Form.Label>
                          <Form.Control
                            placeholder=" start date "
                            type="date"
                            onChange={(e) => setstartDate(e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label>Validity till</Form.Label>
                          <Form.Control
                            placeholder=" validity "
                            type="date"
                            onChange={(e) => setexpDate(e.target.value)}
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label>How may time use</Form.Label>
                          <Form.Control
                            placeholder=" how may times use "
                            type="number"
                            onChange={(e) => sethtuse(e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridEmail">
                          {/* <Form.Label> Start Date</Form.Label>
                          <Form.Control
                            placeholder=" start date "
                            type="number"
                            onChange={(e)=>setstartDate(e.target.value)}
                          /> */}
                        </Form.Group>
                      </Row>
                      <div className="row pt-3 justify-content-center">
                        <div className="col-md-1">
                          <button className="vhs-button" onClick={addvoucher}>
                            Save
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      
    </div>
  );
}
export default Voucher;
