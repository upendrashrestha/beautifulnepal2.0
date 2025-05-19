"use client";

import { useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Alert,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import { Person, Email, Message } from "@mui/icons-material";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        website: "",
    });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to submit");

            setFormData({ name: "", email: "", message: "", website: "" });
            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            maxWidth="600px"
            mx="auto"
            px={3}
            py={3}
            display="flex"
            flexDirection="column"
            gap={3}
        >
            <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                textAlign="center"
                gutterBottom
            >
                Contact Us
            </Typography>

            <form onSubmit={handleSubmit} noValidate>
                <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    style={{ display: "none" }}
                    autoComplete="off"
                    tabIndex={-1}
                />

                <TextField
                    label="Your Name"
                    name="name"
                    fullWidth
                    required
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Your Email"
                    name="email"
                    type="email"
                    fullWidth
                    required
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Your Message"
                    name="message"
                    multiline
                    rows={5}
                    fullWidth
                    required
                    variant="outlined"
                    value={formData.message}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Message />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box mt={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : undefined}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </Button>
                </Box>
            </form>

            {status === "success" && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Thank you! Your message has been sent.
                </Alert>
            )}
            {status === "error" && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    Something went wrong. Please try again.
                </Alert>
            )}
        </Box>
    );
}
