import React, { useState, ChangeEvent, useEffect } from 'react';
import {
    Button,
    TextField,
    Typography,
    Box,
    Container,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/user';
import { RouteResponse, LoginUserResponse } from "../../types/user";
import Cookies from 'js-cookie';
import { tokenPresent } from '../../services/services';
import { useChatState } from '../../context/chat';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(dayjs(new Date()));
    const [imageUrl, setImageUrl] = useState<File | null>(null);
    const [registerError, setRegisterError] = useState('');
    const { setUser } = useChatState();

    const [errors, setErrors] = useState<{
        username: string;
        password: string;
        email: string;
        name: string;
        dateOfBirth: string;
    }>({
        username: '',
        password: '',
        email: '',
        name: '',
        dateOfBirth: '',
    });

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

    const handleRegister = async () => {
        let hasError = false;
        const newErrors: Record<string, string> = {};

        if (!username) {
            newErrors.username = "Username is required";
            hasError = true;
        }
        if (!password) {
            newErrors.password = "Password is required";
            hasError = true;
        }
        if (!email) {
            newErrors.email = "Email is required";
            hasError = true;
        }
        if (!name) {
            newErrors.name = "Name is required";
            hasError = true;
        }
        if (!dateOfBirth) {
            newErrors.dateOfBirth = "Date of Birth is required";
            hasError = true;
        }

        setErrors({
            ...newErrors,
            username: newErrors.username || '',
            password: newErrors.password || '',
            email: newErrors.email || '',
            name: newErrors.name || '',
            dateOfBirth: newErrors.dateOfBirth || '',
        });

        if (hasError) return;

        try {
            const response = await register(username, password, name, email, imageUrl as File, dateOfBirth?.format('YYYY-MM-DD') as string);
            const res: LoginUserResponse | RouteResponse = response;
            if ('user' in res) {
                Cookies.set('token', "Bearer " + res.token);
                setUser(JSON.parse(localStorage.getItem('user') || 'null'));
                navigate('/');
                return;
            }
            const data: RouteResponse = res;
            setRegisterError(data.message);
        } catch (error: unknown) {
            console.error(error);
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImageUrl(event.target.files[0]);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "70vh",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "5px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    marginTop: "3vh"
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
                </Typography>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    error={!!errors.name}
                    onChange={(e) => { setName(e.target.value) }}
                />
                <Typography color="error" gutterBottom>
                    {errors.name}
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    error={!!errors.username}
                    onChange={(e) => { setUsername(e.target.value) }}
                />
                <Typography color="error" gutterBottom>
                    {errors.username}
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    error={!!errors.email}
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <Typography color="error" gutterBottom>
                    {errors.email}
                </Typography>
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    error={!!errors.password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <Typography color="error" gutterBottom>
                    {errors.password}
                </Typography>
                <Button variant="contained" component="label">
                    Upload Profile Picture
                    <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {imageUrl && (
                    <Box component="img" src={URL.createObjectURL(imageUrl)} alt="User Image" sx={{ width: 100, height: 100, borderRadius: 1, border: '1px solid #ccc' }} />
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChange={(newValue) => setDateOfBirth(newValue)}
                        sx={{ marginTop: "20px" }}
                    />
                </LocalizationProvider>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleRegister()}
                    sx={{ marginTop: "30px" }}
                >
                    Register
                </Button>
                <Typography color="error" gutterBottom sx={{
                    marginTop: "20px"
                }}>
                    {registerError}
                </Typography>
                <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    onClick={() => navigate('/login')}
                    sx={{ marginTop: "10px", width: "50%" }}
                >
                    Already have an account? Login
                </Button>
            </Box>
        </Container>
    )
}