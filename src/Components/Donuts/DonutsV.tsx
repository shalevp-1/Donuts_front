import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Donuts.css";
import api from "../../Utils/apiClient";
import type { Donut } from "../../Models/Donuts";
import { normalizeDonut } from "../../Utils/donutsApi";
import { formatShekel } from "../../Utils/formatShekel";

type AdminResponse = { status?: string; name?: string; role?: string; error?: string };
function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
const DonutsV = () => {
  const [auth, setAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [donuts, setDonuts] = useState<Donut[]>([]);
  const [isLoadingDonuts, setIsLoadingDonuts] = useState(true);
  const [actionError, setActionError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get<AdminResponse>("/donutsv")
      .then((response) => {
        if (!active) return;
        if (response.data.status === "Success") {
          setAuth(true);
          setName(response.data.name || "Admin");
          setRole(response.data.role || "admin");
        } else {
          setMessage(response.data.error || "Your admin session could not be verified.");
        }
      })
      .catch((error: unknown) => { if (active) setMessage(getErrorMessage(error, "Could not verify admin access.")); })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!auth) return;
    let active = true;
    api.get<unknown>("/donuts")
      .then((response) => {
        if (!active) return;
        if (!Array.isArray(response.data)) throw new Error("The server returned an invalid donut list.");
        const loadedDonuts = response.data.map(normalizeDonut);
        if (loadedDonuts.some((donut) => !Number.isFinite(donut.id) || !Number.isFinite(donut.price) || !Number.isFinite(donut.calories))) {
          throw new Error("The server returned invalid donut data.");
        }
        setDonuts(loadedDonuts);
      })
      .catch((error: unknown) => { if (active) setActionError(getErrorMessage(error, "Could not load donuts.")); })
      .finally(() => { if (active) setIsLoadingDonuts(false); });
    return () => { active = false; };
  }, [auth]);

  const handleDelete = async (id: number) => {
    try {
      setActionError("");
      await api.delete(`/donuts/${id}`);
      setDonuts((currentDonuts) => currentDonuts.filter((donut) => donut.id !== id));
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, "Could not delete this donut."));
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/login");
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, "Could not log out. Please try again."));
    }
  };

  if (authLoading) return <div className="donutAdminPage"><p>Checking admin access...</p></div>;

  return (
    <div className="donutAdminPage">
      {auth ? <div className="adminShell">
        <section className="adminTopbar">
          <div>
            <p className="adminTitle">Dashboard</p>
            <h1>Hello {name}!</h1>
            <p className="adminLead">Add Donuts or update them as you wish. You are logged in with the role of <strong>{role}</strong>.</p>
          </div>
          <div className="adminTopbarActions">
            <Link to="/donutsadd" className="adminPrimaryAction">Add new donut</Link>
            <button className="logout" onClick={handleLogout}>Log out</button>
          </div>
        </section>
        {actionError && <div className="adminMessage error" role="alert">{actionError}</div>}
        <section className="adminStatsRow">
          <div className="adminStatCard"><span>Total donuts</span><strong>{donuts.length}</strong></div>
          <div className="adminStatCard"><span>Average price</span><strong>{formatShekel(donuts.length ? donuts.reduce((sum, donut) => sum + (Number.isFinite(donut.price) ? donut.price : 0), 0) / donuts.length : 0)}</strong></div>
        </section>
        {isLoadingDonuts ? <p>Loading donuts...</p> : <div className="donuts adminDonutsGrid">
          {donuts.map((donut) => <div className="donut" key={donut.id}>
            {donut.image && <img src={donut.image} alt={donut.name} />}
            <h2>{donut.name}</h2><p>{donut.description}</p>
            <div className="adminDonutMeta"><span>{formatShekel(Number.isFinite(donut.price) ? donut.price : 0)}</span><span>{donut.calories} cal</span></div>
            <div className="adminDonutActions">
              <button className="delete" onClick={() => handleDelete(donut.id)}>Delete</button>
              <Link className="update" to={`/donutsupdate/${donut.id}`}>Update</Link>
            </div>
          </div>)}
        </div>}
      </div> : <div className="adminDeniedCard"><h2>Not authorised</h2><h3>{message}</h3><p>Please log in to manage the donut collection.</p><Link to="/login" className="adminPrimaryAction">Login</Link></div>}
    </div>
  );
};

export default DonutsV;
