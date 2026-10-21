import { useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import "./Donuts.css";
import api from "../../Utils/apiClient";

type DonutForm = {
  name: string;
  price: string;
  description: string;
  ingredients: string;
  calories: string;
  image: string;
};

type FormMessage = { type: "success" | "error"; text: string };
type ApiMessage = { message?: string; error?: string };

const emptyDonut: DonutForm = {
  name: "", price: "", description: "", ingredients: "", calories: "", image: ""
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiMessage>(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

const DonutsAdd = () => {
  const [donut, setDonut] = useState<DonutForm>(emptyDonut);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setDonut((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(donut.price);
    const calories = Number(donut.calories);
    if (!donut.price.trim() || !Number.isFinite(price) || price < 0 || !donut.calories.trim() || !Number.isInteger(calories) || calories < 0) {
      setMessage({ type: "error", text: "Enter a valid non-negative price and whole number of calories." });
      return;
    }
    const ingredients = donut.ingredients.split(",").map((item) => item.trim()).filter(Boolean);
    if (!ingredients.length) {
      setMessage({ type: "error", text: "Enter at least one ingredient, separated by commas." });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage(null);
      const response = await api.post<ApiMessage>("/donuts", {
        ...donut, price, calories, ingredients
      });
      setMessage({ type: "success", text: response.data?.message || "Donut was created successfully." });
      navigate("/donutsv");
    } catch (error: unknown) {
      setMessage({ type: "error", text: getErrorMessage(error, "Donut could not be created.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="donutAdminPage">
      <form className="donutFormCard" onSubmit={handleSubmit}>
        <p className="adminTitle">Admin</p>
        <h1>Add A New Donut</h1>
        <p className="adminLead">Create a new donut directly in your SQL database.</p>
        {message && <div className={`adminMessage ${message.type}`} role="alert">{message.text}</div>}
        <input required type="text" placeholder="Name" onChange={handleChange} name="name" value={donut.name} />
        <input required type="number" min="0" step="0.01" placeholder="Price (₪)" onChange={handleChange} name="price" value={donut.price} />
        <textarea required placeholder="Description" onChange={handleChange} name="description" value={donut.description} />
        <input required type="text" placeholder="Ingredients (comma separated)" onChange={handleChange} name="ingredients" value={donut.ingredients} />
        <input required type="number" min="0" step="1" placeholder="Calories" onChange={handleChange} name="calories" value={donut.calories} />
        <input required type="text" placeholder="Image Url" onChange={handleChange} name="image" value={donut.image} />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Add Donut"}</button>
      </form>
    </div>
  );
};

export default DonutsAdd;
