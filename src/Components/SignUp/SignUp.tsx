import { useState, type FormEvent } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Utils/apiClient';
import type { AuthMessage } from './authTypes';

type SignUpFormData = {
    username: string;
    email: string;
    password: string;
    passwordcheck: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIGNUP_REDIRECT_DELAY_MS = 900;
const EMPTY_FORM: SignUpFormData = {
    username: '',
    email: '',
    password: '',
    passwordcheck: ''
};

export default function SignUp() {
    const [formData, setFormData] = useState<SignUpFormData>(EMPTY_FORM);
    const [authMessage, setAuthMessage] = useState<AuthMessage | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const isValidEmail = (email: string) => {
        return EMAIL_REGEX.test(email);
    };

    const validateForm = () => {
        const username = formData.username.trim();
        const email = formData.email.trim();

        if (!username || !email) {
            setAuthMessage({ type: 'error', text: 'Username and email cannot be empty.' });
            return false;
        }

        if (!isValidEmail(email)) {
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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password
            };
            const res = await api.post('/register', payload);

            if (res.data.status === 'Success') {
                setAuthMessage({ type: 'success', text: res.data.message || 'Your account has been created successfully.' });
                window.setTimeout(() => navigate('/login'), SIGNUP_REDIRECT_DELAY_MS);
                return;
            }

            setAuthMessage({ type: 'error', text: 'We could not create your account right now.' });
        } catch (error: any) {
            setAuthMessage({
                type: 'error',
                text: error?.response?.data?.error || 'We could not create your account right now.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='SignUp'>
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
                                type="email"
                                id='email'
                                placeholder='Email'
                                autoComplete='email'
                                autoCapitalize='none'
                                spellCheck={false}
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            />
                            <input
                                type="password"
                                id='password'
                                placeholder='Password'
                                autoComplete='new-password'
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                            />
                            <input
                                type="password"
                                id='passwordcheck'
                                placeholder='Repeat Password'
                                autoComplete='new-password'
                                value={formData.passwordcheck}
                                onChange={(e) => setFormData((prev) => ({ ...prev, passwordcheck: e.target.value }))}
                            />
                            <input type="submit" value={isSubmitting ? 'Creating...' : 'Sign Up'} disabled={isSubmitting} />
                        </form>
                        <Link to="/login" className="authSwitch">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
