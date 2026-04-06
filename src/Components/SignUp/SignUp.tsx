import React, { useState } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordcheck: ''
    });
    const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignUp = () => {
        if (!formData.username || !formData.email) {
            setAuthMessage({ type: 'error', text: 'Username and email cannot be empty.' });
            return false; 
        }

        if (!isValidEmail(formData.email)) {
            setAuthMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return false;
        }

        if (formData.password !== formData.passwordcheck) {
            setAuthMessage({ type: 'error', text: 'Passwords do not match. Please enter matching passwords.' });
            return false;
        }

        if (formData.password === '') {
            setAuthMessage({ type: 'error', text: 'Please enter a valid password.' });
            return false;
        }

        setAuthMessage(null);
        return true; 
    };
    
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (handleSignUp()) {
            try {
                setIsSubmitting(true);
                const res = await axios.post('http://localhost:8800/register', formData);

                if (res.data.status === "Success") {
                    setAuthMessage({ type: 'success', text: res.data.message || 'Your account has been created successfully.' });
                    window.setTimeout(() => navigate('/login'), 900);
                } else {
                    setAuthMessage({ type: 'error', text: 'We could not create your account right now.' });
                }
            } catch (error: any) {
                setAuthMessage({
                    type: 'error',
                    text: error?.response?.data?.error || 'We could not create your account right now.'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className='SignUp'>
            <div className="authShell">
                <div className="authIntro">
                    <h1>Create your account</h1>
                    <p>Create an account to start your day the right way with fresh donuts.</p>
                </div>
                <div className="form authCard">
                <form onSubmit={handleSubmit}>
                    {authMessage && (
                        <div className={`authMessage ${authMessage.type}`}>
                            {authMessage.text}
                        </div>
                    )}
                    <input type="text" id='userName' placeholder='UserName' onChange={e => setFormData({...formData, username: e.target.value})} />
                    <input type="text" id='email' placeholder='Email'  onChange={e => setFormData({...formData, email: e.target.value})}/>
                    <input type="password" id='password' placeholder='Password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    <input type="password" id='passwordcheck' placeholder='Repeat Password' value={formData.passwordcheck} onChange={(e) => setFormData({ ...formData, passwordcheck: e.target.value })} />
                    <input type="submit" value={isSubmitting ? "Creating..." : "Sign Up"} disabled={isSubmitting} />
                </form>
                <Link to="/login" className="authSwitch">Login</Link>
                </div>
            </div>
        </div>
    );
}
