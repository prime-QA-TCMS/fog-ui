import React, { useState, useEffect } from "react";
import { Box, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Topbar } from "./Topbar";
import Breadcrumbs from "./Breadcrumbs";
import { MenuItem, PageWrapperProps as PageWrapperPropsType } from "./types";
import { pageContainer, DrawerContainer } from "../../style/muiComponentStyles/containerStyles";
import { useResolvedMenu } from "../../hooks/useResolvedMenu";

export const PageWrapper: React.FC<PageWrapperPropsType> = ({
  children,
  menuItems,
  logo = "FOG-UI LOGO",
  drawerFooterComponent,
  topbarMenu,
  topbarUserMenu,
  breadcrumbsConfig,
}) => {
  const theme = useTheme();
  const styles = pageContainer(theme);
  const drawerStyles = DrawerContainer();
  const navigate = useNavigate();

  const [pageTitle, setPageTitle] = useState(
    () => localStorage.getItem("pageTitle") || "Projects Overview"
  );

  // ✅ Automatically replace :params with real URL values
  const resolvedMenu = useResolvedMenu(menuItems);

  const handleNavigation = (menu: MenuItem) => {
    setPageTitle(menu.label);
    localStorage.setItem("pageTitle", menu.label);
    navigate(menu.path);
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "pageTitle" && event.newValue) {
        setPageTitle(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Box sx={styles.root} data-testid="page-wrapper">
      <Drawer
        variant="permanent"
        sx={drawerStyles.root}
        data-testid="page-wrapper-drawer"
        role="navigation"
        aria-label="Main navigation"
      >
        <Toolbar data-testid="page-wrapper-toolbar">
          <a href="/dashboard" data-testid="page-wrapper-logo-link" aria-label="Go to dashboard">
            <Typography variant="h6">
              {typeof logo === "string" ? logo : logo}
            </Typography>
          </a>
        </Toolbar>

        <List
          data-testid="page-wrapper-menu-list"
          role="menu"
          aria-label="Navigation menu"
        >
          {Object.entries(resolvedMenu).map(([section, items], sectionIndex) => (
            <Box
              key={sectionIndex}
              sx={{ mb: 2 }}
              data-testid={`page-wrapper-menu-section-${sectionIndex}`}
              role="group"
              aria-label={section}
            >
              <Typography data-testid={`page-wrapper-section-title-${sectionIndex}`}>
                {section}
              </Typography>
              {items.map((menu: MenuItem, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  data-testid={`page-wrapper-menu-item-${menu.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <ListItemButton
                    onClick={() => handleNavigation(menu)}
                    sx={{ pl: 4 }}
                    data-testid={`page-wrapper-menu-button-${menu.label.toLowerCase().replace(/\s+/g, '-')}`}
                    role="menuitem"
                    aria-label={menu.label}
                  >
                    <ListItemText primary={menu.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </Box>
          ))}
        </List>
        {drawerFooterComponent && (
          <Box data-testid="page-wrapper-drawer-footer">
            {drawerFooterComponent}
          </Box>
        )}
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, marginTop: "80px" }}
        data-testid="page-wrapper-main-content"
        role="main"
        aria-label="Main content"
      >
        <Topbar
          pageTitle={pageTitle}
          menu={topbarMenu ? topbarMenu : []}
          userMenu={topbarUserMenu ? topbarUserMenu : undefined}
          data-testid="page-wrapper-topbar"
        />
        {breadcrumbsConfig && (
          <Box sx={{ p: 2 }} data-testid="page-wrapper-breadcrumbs-container">
            <Breadcrumbs config={breadcrumbsConfig} />
          </Box>
        )}
        <Box sx={{ flexGrow: 1, p: 0, marginTop: "0px" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

