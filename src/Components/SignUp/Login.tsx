import React, { useState } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Utils/apiClient';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''     
    });
    const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loggedInRole, setLoggedInRole] = useState('');
   
    const navigate = useNavigate();

    React.useEffect(() => {
        let isMounted = true;

        async function checkLoggedInState() {
            try {
                const res = await api.get('/me');

                if (!isMounted || res.data.status !== 'Success') {
                    return;
                }

                setLoggedInRole(res.data.role || 'user');
                setAuthMessage({
                    type: 'success',
                    text: 'You are already signed in. Use the account menu if you want to log out.'
                });
            } catch {
                if (isMounted) {
                    setLoggedInRole('');
                }
            }
        }

        checkLoggedInState();

        return () => {
            isMounted = false;
        };
    }, []);

    
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setAuthMessage(null);

        if (loggedInRole) {
            navigate(loggedInRole === 'admin' ? '/donutsv' : '/my-perks');
            return;
        }

        if (!formData.username || !formData.password) {
            setAuthMessage({ type: 'error', text: 'Please enter both username and password.' });
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await api.post('/login', formData);
            if(res.data.status === "Logged in successfully") {
                setAuthMessage({ type: 'success', text: 'Welcome back. Redirecting you now.' });
                let nextRoute = '/my-perks';

                try {
                    const meRes = await api.get('/me');
                    nextRoute = meRes.data.role === 'admin' ? '/donutsv' : '/my-perks';
                } catch {
                    // If the backend was not restarted yet and /me is missing,
                    // still let the user move forward after a successful login.
                    nextRoute = '/';
                }

                window.setTimeout(() => navigate(nextRoute), 700);
            }
            else {
                setAuthMessage({ type: 'error', text: res.data.error || 'We could not sign you in right now.' });
            }
        } catch (error: any) {
            setAuthMessage({
                type: 'error',
                text: error?.response?.data?.error || 'We could not sign you in right now.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleLogin= () => {
       
    //     window.alert('You\'ve Logged In!');
    // };

    return (
        <div className='Login'>
            <div className="authShell">
                <div className="authIntro">
                    <h1>Welcome!</h1>
                    <p>Sign in to manage your bakery space and keep things moving!</p>
                </div>
                <div className="form authCard">
                <form onSubmit={handleSubmit}>
                {authMessage && (
                    <div className={`authMessage ${authMessage.type}`}>
                        {authMessage.text}
                    </div>
                )}
                <input type="text" id='username' placeholder='UserName' onChange={(e) => setFormData({ ...formData, username: e.target.value })}/>
                <input type="password" id='password' placeholder='Password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <input type="submit" value={isSubmitting ? "Signing in..." : "Login"} disabled={isSubmitting}/>
                </form>
                <Link to="/signup" className="authSwitch">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
