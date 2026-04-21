import { useEffect, useState, type ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchAuthStatus } from '../../Utils/authStatus';

type AuthSnapshot = {
  isLoading: boolean;
  isAuthenticated: boolean;
  role: string;
};

function useAuthSnapshot() {
  const [authState, setAuthState] = useState<AuthSnapshot>({
    isLoading: true,
    isAuthenticated: false,
    role: ''
  });

  const { pathname } = useLocation();

    useEffect(() => {
        let isMounted = true;

        async function loadAuthState() {
            const res = await fetchAuthStatus();

            if (!isMounted) {
                return;
            }

            setAuthState({
                isLoading: false,
                isAuthenticated: Boolean(res.authenticated),
                role: res.role || ''
            });
        }

        loadAuthState();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return authState;
}

export function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, role } = useAuthSnapshot();

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/donutsv' : '/my-perks'} replace />;
  }

  return children;
}

export function AdminRoute({ children }: { children: ReactElement }) {
  const { isLoading, isAuthenticated, role } = useAuthSnapshot();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/my-perks" replace />;
  }

  return children;
}

export function MemberRoute({ children }: { children: ReactElement }) {
  const { isLoading, isAuthenticated } = useAuthSnapshot();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isLoading, isAuthenticated } = useAuthSnapshot();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
