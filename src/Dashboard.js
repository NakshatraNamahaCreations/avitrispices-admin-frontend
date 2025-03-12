import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  Cell,
} from "recharts";

function Dashboard() {
  const [barData, setBarData] = useState([
    { month: "Jan", sales: 0 },
    { month: "Feb", sales: 0 },
    { month: "March", sales: 0 },
    { month: "April", sales: 0 },
    { month: "May", sales: 0 },
    { month: "June", sales: 0 },
    { month: "July", sales: 0 },
    { month: "August", sales: 0 },
    { month: "Sept", sales: 0 },
    { month: "Oct", sales: 0 },
    { month: "Nov", sales: 0 },
    { month: "Dec", sales: 0 },
  ]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://api.nncwebsitedevelopment.com/api/products");
      const productsData = response.data.data || [];

      // Group sales by month
      const monthlySales = {};
      productsData.forEach((product) => {
        const createdDate = new Date(product.createdDate);
        const monthIndex = createdDate.getMonth(); // 0 for Jan, 1 for Feb, etc.
        const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(createdDate);

        if (!monthlySales[monthName]) {
          monthlySales[monthName] = 0;
        }
        monthlySales[monthName] += product.sold;
      });

      // Update barData with dynamic sales values
      const updatedBarData = barData.map((item) => ({
        ...item,
        sales: monthlySales[item.month] || 0,
      }));

      setBarData(updatedBarData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard p-4" style={{ marginLeft: "250px", backgroundColor: "white" }}>
      <h3 className="mb-4">Dashboard</h3>

      {/* Sales Chart */}
      <Card className="mt-4 shadow-sm">
        <Card.Body>
          <h5>Sales</h5>
          <p>Amount of products sold per month</p>
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <RechartsLegend />
                <Bar dataKey="sales" name="Sales">
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.sales > 10 ? "#F8ABAB" : "#986A6A"} // Color logic
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;
