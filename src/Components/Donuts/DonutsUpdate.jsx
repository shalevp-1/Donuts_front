import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Donuts.css';
import api from "../../Utils/apiClient";

const DonutsUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const donutId = location.pathname.split("/")[2];

  const [donut, setDonut] = useState({
    name: "",
    price: "",
    description: "",
    ingredients: "",
    calories: "",
    image: ""
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  useEffect(() => {
    const fetchDonut = async () => {
      try {
        const res = await api.get(`/donut/${donutId}`);
        setDonut({
          ...res.data[0],
          ingredients: Array.isArray(res.data[0]?.ingredients)
            ? res.data[0].ingredients.join(", ")
            : res.data[0]?.ingredients || "",
          calories: res.data[0]?.calories ?? ""
        }); 
      } catch (err) {
        console.log("Error fetching donut data:", err);
      }
    };

    fetchDonut();
  }, [donutId]);

  const handleChange = (e) => {
    setDonut((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setMessage(null);
      const response = await api.put(`/donuts/${donutId}`, {
        ...donut,
        price: Number(donut.price),
        calories: Number(donut.calories)
      });
      setMessage({ type: "success", text: response.data?.message || "Donut has been updated successfully." });
      navigate("/donutsv");
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || "Error updating donut data."
      });
      console.log("Error updating donut:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='donutAdminPage'>
      <div className='donutFormCard'>
      <p className='adminEyebrow'>Admin</p>
      <h1>Update The Donut</h1>
      <p className='adminLead'>Edit the donut details and save them back to MySQL.</p>
      {message && <div className={`adminMessage ${message.type}`}>{message.text}</div>}
      <input
        type="text"
        placeholder='Name'
        value={donut.name}
        onChange={handleChange}
        name="name"
      />
      <input
        type="text"
        placeholder='Price'
        value={donut.price}
        onChange={handleChange}
        name="price"
      />
      <textarea
        placeholder='Description'
        value={donut.description}
        onChange={handleChange}
        name="description"
      />
      <input
        type="text"
        placeholder='Ingredients (comma separated)'
        value={donut.ingredients}
        onChange={handleChange}
        name="ingredients"
      />
      <input
        type="number"
        placeholder='Calories'
        value={donut.calories}
        onChange={handleChange}
        name="calories"
      />
      <input
        type="text"
        placeholder='Image Url'
        value={donut.image}
        onChange={handleChange}
        name="image"
      />
      <button onClick={handleClick} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Update Donut"}</button>
      </div>
    </div>
  );
};

export default DonutsUpdate;
