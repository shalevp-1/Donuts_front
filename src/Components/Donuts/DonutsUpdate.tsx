import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Donuts.css";
import api from "../../Utils/apiClient";
import type { Donut } from "../../Models/Donuts";
import { normalizeDonut } from "../../Utils/donutsApi";

type DonutForm = Omit<Donut, "id" | "price" | "calories" | "ingredients"> & {
  price: string;
  calories: string;
  ingredients: string;
};
type FormMessage = { type: "success" | "error"; text: string };
type ApiMessage = { message?: string; error?: string };
const emptyDonut: DonutForm = { name: "", price: "", description: "", ingredients: "", calories: "", image: "" };

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiMessage>(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

function parseDonut(value: unknown): Donut | null {
  if (!Array.isArray(value) || value.length === 0 || !value[0] || typeof value[0] !== "object") return null;
  const donut = normalizeDonut(value[0]);
  return Number.isFinite(donut.id) && Number.isFinite(donut.price) && Number.isFinite(donut.calories)
    ? donut
    : null;
}

const DonutsUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [donut, setDonut] = useState<DonutForm>(emptyDonut);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoadedDonut, setHasLoadedDonut] = useState(false);

  useEffect(() => {
    let active = true;
    if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
      setMessage({ type: "error", text: "That donut ID is not valid." });
      setIsLoading(false);
      return () => { active = false; };
    }
    setIsLoading(true);
    api.get<unknown>(`/donut/${id}`)
      .then((response) => {
        if (!active) return;
        const value = parseDonut(response.data);
        if (!value) {
          setMessage({ type: "error", text: "That donut could not be found." });
          return;
        }
        setDonut({
          name: value.name, price: String(value.price), description: value.description,
          ingredients: value.ingredients.join(", "), calories: String(value.calories), image: value.image
        });
        setHasLoadedDonut(true);
      })
      .catch((error: unknown) => {
        if (active) setMessage({ type: "error", text: getErrorMessage(error, "Could not load donut data.") });
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setDonut((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
      setMessage({ type: "error", text: "That donut ID is not valid." });
      return;
    }
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
      const response = await api.put<ApiMessage>(`/donuts/${id}`, { ...donut, price, calories, ingredients });
      setMessage({ type: "success", text: response.data?.message || "Donut has been updated successfully." });
      navigate("/donutsv");
    } catch (error: unknown) {
      setMessage({ type: "error", text: getErrorMessage(error, "Error updating donut data.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="donutAdminPage">
      <form className="donutFormCard" onSubmit={handleSubmit}>
        <p className="adminTitle">Admin</p>
        <h1>Update The Donut</h1>
        <p className="adminLead">Edit the donut details and save them back to MySQL.</p>
        {message && <div className={`adminMessage ${message.type}`} role="alert">{message.text}</div>}
        {isLoading ? <p>Loading donut...</p> : hasLoadedDonut ? <>
          <input required type="text" placeholder="Name" value={donut.name} onChange={handleChange} name="name" />
          <input required type="number" min="0" step="0.01" placeholder="Price" value={donut.price} onChange={handleChange} name="price" />
          <textarea required placeholder="Description" value={donut.description} onChange={handleChange} name="description" />
          <input required type="text" placeholder="Ingredients (comma separated)" value={donut.ingredients} onChange={handleChange} name="ingredients" />
          <input required type="number" min="0" step="1" placeholder="Calories" value={donut.calories} onChange={handleChange} name="calories" />
          <input required type="text" placeholder="Image Url" value={donut.image} onChange={handleChange} name="image" />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Update Donut"}</button>
        </> : null}
      </form>
    </div>
  );
};

export default DonutsUpdate;
