import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { login } from '../../services/user';
import { tokenPresent } from '../../services/services';
import Cookies from 'js-cookie';
import { RouteResponse, LoginUserResponse } from "../../types/user";
import Loader from '../../components/loader/Loader';
import { delay } from '../../utils/delay';

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const valid = await tokenPresent();
                if (valid) {
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkToken();
    })

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            if (!username) {
                setUsernameError("Username is required");
                return;
            }
            if (!password) {
                setPasswordError("Password is required");
                return;
            }
            const [loginResponse] = await Promise.all([login(username, password), delay(1500)]);
            const response: LoginUserResponse | RouteResponse = loginResponse;
            if ('user' in response) {
                Cookies.set('token', "Bearer " + response.token);
                navigate('/');
                return;
            }
            const data: any = response;
            setLoginError(data.error);
            setIsLoading(false);
        } catch (error: any) {
            console.error(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }

    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
        setUsernameError("");
        setLoginError("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError("");
        setLoginError("");
    };

    return (
        <Container maxWidth="sm">
            {isLoading ? (
                <Loader />
            ) :
                (<Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "40vh",
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "5px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        marginTop: "25vh"
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Login
                    </Typography>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        error={!!usernameError}
                        onChange={handleUsernameChange}
                    />
                    <Typography color="error" gutterBottom>
                        {usernameError}
                    </Typography>
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={password}
                        error={!!passwordError}
                        onChange={handlePasswordChange}
                    />
                    <Typography color="error" gutterBottom>
                        {passwordError}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleLogin()}
                        sx={{ marginTop: "20px" }}
                    >
                        Login
                    </Button>
                    <Typography color="error" gutterBottom sx={
                        {
                            marginTop: "10px"
                        }
                    }>
                        {loginError}
                    </Typography>
                </Box>
                )}
        </Container>
    )
}