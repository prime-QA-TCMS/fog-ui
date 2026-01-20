import React from 'react';
import {
    AppBar,
    Box,
    Button,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { TopBarProps } from './types';
import { useNavigate, useLocation } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';

export const Topbar: React.FC<TopBarProps> = ({ pageTitle, menu, userMenu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserMenuItemClick = (callback: () => void) => {
        callback();
        handleUserMenuClose();
    };

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <AppBar
            position="absolute"
            style={{ width: "calc(100vw - 300px)", left: "300px" }}
            data-testid="topbar"
            role="banner"
        >
            <Toolbar
                sx={{ justifyContent: 'space-between' }}
                data-testid="topbar-toolbar"
            >
                <Typography
                    variant="h6"
                    component="div"
                    data-testid="topbar-title"
                    aria-label={`Current page: ${pageTitle}`}
                >
                    {pageTitle}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    {menu && menu.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {menu.map((item) => (
                                <Button
                                    key={item.path}
                                    startIcon={item.icon}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        color: isActive(item.path) ? 'primary.main' : 'text.primary',
                                        borderBottom: isActive(item.path)
                                            ? '2px solid'
                                            : '2px solid transparent',
                                        borderRadius: 0,
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    }}
                                    data-testid={`topbar-menu-${item.path}`}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                    data-testid="topbar-actions"
                    role="toolbar"
                    aria-label="User actions"
                >
                    {userMenu && (
                        <>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account"
                                aria-controls="user-menu"
                                aria-haspopup="true"
                                onClick={handleUserMenuOpen}
                                color="inherit"
                                data-testid="topbar-user-menu-button"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="user-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleUserMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                data-testid="topbar-user-menu"
                            >
                                {userMenu.profilePath && (
                                    <MenuItem
                                        onClick={() =>
                                            handleUserMenuItemClick(() =>
                                                navigate(userMenu.profilePath!)
                                            )
                                        }
                                        data-testid="topbar-user-menu-profile"
                                    >
                                        Profile
                                    </MenuItem>
                                )}
                                {userMenu.accountPath && (
                                    <MenuItem
                                        onClick={() =>
                                            handleUserMenuItemClick(() =>
                                                navigate(userMenu.accountPath!)
                                            )
                                        }
                                        data-testid="topbar-user-menu-account"
                                    >
                                        My Account
                                    </MenuItem>
                                )}
                                <MenuItem
                                    onClick={() =>
                                        handleUserMenuItemClick(() => userMenu.onLogout())
                                    }
                                    data-testid="topbar-user-menu-logout"
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

