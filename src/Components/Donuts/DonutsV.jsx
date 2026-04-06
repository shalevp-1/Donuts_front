import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Donuts.css';

const DonutsV = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [donuts, setDonuts] = useState([]);
  const navigate = useNavigate(); 

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8800/donutsv')
      .then(res => {
        if (res.data.status === "Success") {
          setAuth(true);
          setName(res.data.name);
          setRole(res.data.role || 'admin');
          //navigate('/login'); 
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      })
      .catch(error => console.log(error)); 
  }, [navigate]);

  useEffect(() => {
    const fetchAllDonuts = async () => {
      try {
        const res = await axios.get("http://localhost:8800/donuts");
        setDonuts(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchAllDonuts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/donuts/${id}`);
      setDonuts(donuts.filter(donut => donut.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteCookie = () => {
    axios.get("http://localhost:8800/logout")
    .then(res=>{
      navigate('/login');
    }).catch(err => console.log(err))
  };

  return (
    <div className="donutAdminPage">
      {
        auth ? 
          <div className="adminShell">
            <section className="adminTopbar">
              <div>
                <p className="adminEyebrow">Dashboard</p>
                <h1>Hello {name}!</h1>
                <p className="adminLead">Manage your donut collection, refresh listings, and keep your bakery inventory polished as an <strong>{role}</strong>.</p>
              </div>
              <div className="adminTopbarActions">
                <Link to="/donutsadd" className='adminPrimaryAction'>Add new donut</Link>
                <button className='logout' onClick={handleDeleteCookie}>Log out</button>
              </div>
            </section>

            <section className="adminStatsRow">
              <div className="adminStatCard">
                <span>Total donuts</span>
                <strong>{donuts.length}</strong>
              </div>
              <div className="adminStatCard">
                <span>Average price</span>
                <strong>
                  ${donuts.length ? (donuts.reduce((sum, donut) => sum + Number(donut.price || 0), 0) / donuts.length).toFixed(2) : '0.00'}
                </strong>
              </div>
            </section>

            <div className="donuts adminDonutsGrid">
              {donuts.map(donut => (
                <div className="donut" key={donut.id}>
                  {donut.image && <img src={donut.image} alt="" />}
                  <h2>{donut.name}</h2>
                  <p>{donut.description}</p>
                  <div className="adminDonutMeta">
                    <span>${Number(donut.price).toFixed(2)}</span>
                    <span>{donut.calories} cal</span>
                  </div>
                  <div className="adminDonutActions">
                    <button className="delete" onClick={() => handleDelete(donut.id)}>Delete</button>
                    <Link className="update" to={`/donutsupdate/${donut.id}`}>Update</Link>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
         : (
          <div className="adminDeniedCard"><h2>Not authorised</h2>
          <h3>{message}</h3>
          <p>Please log in to manage the donut collection.</p>
          <Link to="/login" className="adminPrimaryAction">Login</Link>
          </div>
          
        )
      }
    </div>
  )
};

export default DonutsV;
