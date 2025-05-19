"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchDestinations } from "@/sanity/lib/fetch";
import { Destination } from "@/types";
import {
    Button,
    Menu,
    MenuItem,
    ListItemText,
    ClickAwayListener,
    Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function DestinationDropdown() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [destinations, setDestinations] = useState<Destination[]>([]);

    useEffect(() => {
        fetchDestinations().then(setDestinations);
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box>
                <Button
                    onClick={handleClick}
                    endIcon={<ExpandMoreIcon />}
                    variant="text"
                    sx={{
                        textTransform: "none",
                        fontSize: "0.9rem",
                        color: "#000",
                        "&:hover": { backgroundColor: "grey.100" },
                    }}
                >
                    Destinations
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    MenuListProps={{
                        sx: {
                            minWidth: 300,
                        },
                    }}>
                    {destinations.map((dest) => (
                        <MenuItem
                            key={dest._id}
                            component={Link}
                            href={`/destinations/${dest.slug.current}`}
                            onClick={handleClose}
                        >
                            <ListItemText>{dest.name}</ListItemText>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </ClickAwayListener>
    );
}
