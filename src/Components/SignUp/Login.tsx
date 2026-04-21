import { useState, type FormEvent } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Utils/apiClient';
import { fetchAuthStatus } from '../../Utils/authStatus';
import type { AuthMessage } from './authTypes';

type LoginFormData = {
    username: string;
    password: string;
};

const EMPTY_FORM: LoginFormData = {
    username: '',
    password: ''
};
const LOGIN_REDIRECT_DELAY_MS = 700;

export default function Login() {
    const [formData, setFormData] = useState<LoginFormData>(EMPTY_FORM);
    const [authMessage, setAuthMessage] = useState<AuthMessage | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAuthMessage(null);

        const username = formData.username.trim();

        if (!username || !formData.password) {
            setAuthMessage({ type: 'error', text: 'Please enter both username and password.' });
            return;
        }

        try {
            setIsSubmitting(true);
            const credentials = {
                username,
                password: formData.password
            };

            const res = await api.post('/login', credentials);

            if (res.data.status === 'Logged in successfully') {
                setAuthMessage({ type: 'success', text: 'Welcome back. Redirecting you now.' });
                let nextRoute = '/my-perks';

                try {
                    const authStatus = await fetchAuthStatus();
                    nextRoute = authStatus.role === 'admin' ? '/donutsv' : '/my-perks';
                } catch {
                    nextRoute = '/';
                }

                window.setTimeout(() => navigate(nextRoute), LOGIN_REDIRECT_DELAY_MS);
                return;
            }

            setAuthMessage({ type: 'error', text: res.data.error || 'We could not sign you in right now.' });
        } catch (error: any) {
            setAuthMessage({
                type: 'error',
                text: error?.response?.data?.error || 'We could not sign you in right now.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='Login'>
            <div className="authShell">
                <div className="authStage">
                    <div className="form authCard">
                        <form onSubmit={handleSubmit}>
                            {authMessage && (
                                <div className={`authMessage ${authMessage.type}`}>
                                    {authMessage.text}
                                </div>
                            )}
                            <input
                                type="text"
                                id='username'
                                placeholder='UserName'
                                autoComplete='username'
                                autoCapitalize='none'
                                spellCheck={false}
                                value={formData.username}
                                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                            />
                            <input
                                type="password"
                                id='password'
                                placeholder='Password'
                                autoComplete='current-password'
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                            />
                            <input type="submit" value={isSubmitting ? 'Signing in...' : 'Login'} disabled={isSubmitting} />
                        </form>
                        <Link to="/signup" className="authSwitch">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
