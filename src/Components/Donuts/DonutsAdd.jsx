import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Donuts.css';
import api from "../../Utils/apiClient";

const DonutsAdd = () => {
  const [donut, setDonut] = useState({
    name:"",
    price:"", 
    description:"",
    ingredients:"",
    calories:"",
    image:""
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>{
    setDonut((prev) => ({...prev, [e.target.name]: e.target.value}));
  };
  console.log(donut);
  
  const handleClick = async (e) =>{
    e.preventDefault();
    try{
      setIsSubmitting(true);
      setMessage(null);
      const response = await api.post("/donuts", {
        ...donut,
        price: Number(donut.price),
        calories: Number(donut.calories)
      });
      setMessage({ type: "success", text: response.data?.message || "Donut was created successfully." });
      navigate("/donutsv");
    }
    catch(err){
      setMessage({
        type: "error",
        text: err?.response?.data?.error || "Donut could not be created."
      });
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='donutAdminPage'>
      <div className='donutFormCard'>
        <p className='adminTitle'>Admin</p>
        <h1>Add A New Donut</h1>
        <p className='adminLead'>Create a new donut directly in your SQL database.</p>
        {message && <div className={`adminMessage ${message.type}`}>{message.text}</div>}
        <input type="text" placeholder='Name' onChange={handleChange} name="name" value={donut.name}/>
        <input type="number" step="0.01" placeholder='Price' onChange={handleChange} name="price" value={donut.price}/>
        <textarea placeholder='Description' onChange={handleChange} name="description" value={donut.description}/>
        <input type="text" placeholder='Ingredients (comma separated)' onChange={handleChange} name="ingredients" value={donut.ingredients}/>
        <input type="number" placeholder='Calories' onChange={handleChange} name="calories" value={donut.calories}/>
        <input type="text" placeholder='Image Url' onChange={handleChange} name="image" value={donut.image}/>

        <button onClick={handleClick} disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Add Donut"}</button>
      </div>
    </div>
  )
}

export default DonutsAdd
