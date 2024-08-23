import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { tokenPresent } from '../../services/services';
import { CircularProgress } from '@mui/material';

const AuthRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const valid = await tokenPresent();
                setIsAuthenticated(valid);
            } catch (error) {
                console.error('Failed to check authentication');
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, []);

    return (
        <>
            {isLoading ? <div style={{ margin: 'auto' }}><CircularProgress /></div> : isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
        </>
    )
};

export default AuthRoute;