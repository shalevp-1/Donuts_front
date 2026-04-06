import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './UsersPage.css';
import { error } from 'node:console';

type UserRow = {
    id: number;
    username: string;
    email: string;
    role: string;
    points: number;
    purchaseCount: number;
    totalSpent: number;
};

type PendingRoleChange = {
    userId: number;
    username: string;
    nextRole: string;
} | null;

export default function UsersPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [accountName, setAccountName] = useState('');
    const [accountRole, setAccountRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [actionMessage, setActionMessage] = useState('');
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null);
    const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange>(null);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        let isMounted = true;

        async function loadUsers() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const authRes = await axios.get('http://localhost:8800/me');
                const usersRes = await axios.get('http://localhost:8800/users');

                if (!isMounted) {
                    return;
                }

                setAccountName(authRes.data.name || 'Connected');
                setAccountRole(authRes.data.role || 'user');
                setUsers(usersRes.data.users || []);
            } catch (error: any) {
                if (!isMounted) {
                    return;
                }

                setErrorMessage(
                    error?.response?.data?.error || 'You need to be logged in to view users.'
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDeleteUser = async (userId: number, username: string) => {
        const shouldDelete = window.confirm(`Delete user "${username}" from the database?`);

        if (userId === 24 || userId === 25) {
            setActionMessage('This User Cannot Be Deleted');
            return;

        }

        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingUserId(userId);
            setActionMessage('');
            await axios.delete(`http://localhost:8800/users/${userId}`);
            setUsers((prev) => prev.filter((user) => user.id !== userId));
            setActionMessage(`"${username}" was deleted successfully.`);
        } catch (error: any) {
            setActionMessage(
                error?.response?.data?.error || 'We could not delete that user right now.'
            );
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleRoleChange = async (userId: number, username: string, nextRole: string) => {
        try {
            setUpdatingRoleId(userId);
            setActionMessage('');

            const res = await axios.put(`http://localhost:8800/users/${userId}/role`, { role: nextRole });

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, role: res.data.role || nextRole } : user
                )
            );
            setActionMessage(`${username} is now set as ${res.data.role || nextRole}.`);
        } catch (error: any) {
            setActionMessage(
                error?.response?.data?.error || 'We could not update that role right now.'
            );
        } finally {
            setUpdatingRoleId(null);
        }
    };

    const confirmRoleChange = () => {
        if (!pendingRoleChange || pendingRoleChange.userId === 24 || pendingRoleChange.userId === 25) {
            setActionMessage('This User Cannot Be Updated');
            setPendingRoleChange(null);
            return;
        }

        handleRoleChange(
            pendingRoleChange.userId,
            pendingRoleChange.username,
            pendingRoleChange.nextRole
        );
        setPendingRoleChange(null);
    };

    if (isLoading) {
        return (
            <div className="UsersPage">
                <div className="usersCard">
                    <h1>Loading users...</h1>
                    <p>Just a second while we load the user list from MySQL.</p>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="UsersPage">
                <div className="usersCard">
                    <h1>Users page is protected</h1>
                    <p>{errorMessage}</p>
                    <Link to="/login" className="usersPrimaryAction">Go to login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="UsersPage">
            {pendingRoleChange && (
                <div className="usersConfirmOverlay" onClick={() => setPendingRoleChange(null)}>
                    <div
                        className="usersConfirmDialog"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <p className="usersConfirmEyebrow">Confirm role change</p>
                        <h2>
                            {pendingRoleChange.nextRole === 'admin'
                                ? `Make ${pendingRoleChange.username} an admin?`
                                : `Make ${pendingRoleChange.username} a normal user?`}
                        </h2>
                        <p>
                            {pendingRoleChange.nextRole === 'admin'
                                ? 'This user will be able to access management pages, update donuts, and manage other users.'
                                : 'This user will lose admin-only access and go back to the normal member experience.'}
                        </p>
                        <div className="usersConfirmActions">
                            <button
                                type="button"
                                className="usersConfirmSecondary"
                                onClick={() => setPendingRoleChange(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="usersConfirmPrimary"
                                onClick={confirmRoleChange}
                            >
                                Confirm change
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="usersShell">
                <section className="usersHero">
                    <div>
                        <p className="usersEyebrow">Members</p>
                        <h1>All signed-up users in one place.</h1>
                        <p className="usersLead">
                            Logged in as <strong>{accountName}</strong> with the role of <strong>{accountRole}</strong>. This page shows the accounts currently stored in your SQL login table.
                        </p>
                    </div>
                    <div className="usersHeroStat">
                        <span>Total users</span>
                        <strong>{users.length}</strong>
                    </div>
                </section>

                <section className="usersTableCard">
                    {actionMessage && <div className="usersActionMessage">{actionMessage}</div>}
                    <div className="usersTableHead">
                        <span>ID</span>
                        <span>Username</span>
                        <span>Email</span>
                        <span>Role</span>
                        <span>Points</span>
                        <span>Purchases</span>
                        <span>Spent</span>
                        <span>Actions</span>
                    </div>
                    <div className="usersTableBody">
                        {users.map((user) => (
                            <div className="usersTableRow" key={user.id}>
                                <span>{user.id}</span>
                                <span>{user.username}</span>
                                <span>{user.email}</span>
                                <span className="usersRoleBadge">{user.role}</span>
                                <span>{user.points}</span>
                                <span>{user.purchaseCount}</span>
                                <span>${Number(user.totalSpent).toFixed(2)}</span>
                                <div className="usersActionGroup">
                                    <button
                                        type="button"
                                        className="usersRoleToggleBtn"
                                        onClick={() =>
                                            setPendingRoleChange({
                                                userId: user.id,
                                                username: user.username,
                                                nextRole: user.role === 'admin' ? 'user' : 'admin'
                                            })
                                        }
                                        disabled={updatingRoleId === user.id || user.id === 24 || user.id === 25}
                                        style={{ display: (user.id === 24 || user.id === 25) ? 'none' : 'inline-block' }}
                                    >
                                        {updatingRoleId === user.id
                                            ? 'Saving...'
                                            : user.role === 'admin'
                                                ? 'Make user'
                                                : 'Make admin'}
                                    </button>
                                    <button
                                        type="button"
                                        className="usersDeleteBtn"
                                        onClick={() => handleDeleteUser(user.id, user.username)}
                                        disabled={deletingUserId === user.id || user.id === 24 || user.id === 25}
                                        style={{ display: (user.id === 24 || user.id === 25) ? 'none' : 'inline-block' }}
                                    >
                                        {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
