"use client";

import { useState } from "react";
import {
    Button,
    CircularProgress,
    TextField,
    Typography,
    List,
    ListItem,
    Link as MuiLink,
    Container,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchQueryResult } from "@/types";
import Link from "next/link";

export default function SearchBox() {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState<SearchQueryResult>();
    const [loading, setLoading] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!term.trim()) return;

        setLoading(true);
        setResults(undefined);

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
            const data: SearchQueryResult = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search blog, destination or guides..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    color="primary"
                    sx={{ whiteSpace: "nowrap", minWidth: 40 }}
                >
                    {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                </Button>
            </form>

            {loading && <Typography color="text.secondary">Searching...</Typography>}

            {results && (
                <List>
                    {results.posts.map((item) => (
                        <ListItem key={item._id}>
                            <MuiLink component={Link} href={`/${item.type}/${item.slug.current}`} underline="hover">
                                {item.title}
                            </MuiLink>{" "}
                            <Typography variant="body2" color="text.secondary" ml={1}>
                                ({item.type})
                            </Typography>
                        </ListItem>
                    ))}

                    {results.guides.map((item) => (
                        <ListItem key={item._id}>
                            <MuiLink component={Link} href={`/${item.type}/${item.slug.current}`} underline="hover">
                                {item.title}
                            </MuiLink>{" "}
                            <Typography variant="body2" color="text.secondary" ml={1}>
                                ({item.type})
                            </Typography>
                        </ListItem>
                    ))}

                    {results.destinations.map((item) => (
                        <ListItem key={item._id}>
                            <MuiLink component={Link} href={`/${item.type}/${item.slug.current}`} underline="hover">
                                {item.name}
                            </MuiLink>{" "}
                            <Typography variant="body2" color="text.secondary" ml={1}>
                                ({item.type})
                            </Typography>
                        </ListItem>
                    ))}

                    {results.categories.map((item) => (
                        <ListItem key={item._id}>
                            <MuiLink component={Link} href={`/${item.type}/${item.slug.current}`} underline="hover">
                                {item.title}
                            </MuiLink>{" "}
                            <Typography variant="body2" color="text.secondary" ml={1}>
                                ({item.type})
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
}
