
export interface MenuItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}

export interface UserMenuConfig {
    profilePath?: string;
    accountPath?: string;
    onLogout: () => void;
}

export interface BreadcrumbsConfig {
    parameterNames?: string[];
}

export interface TopBarProps {
    pageTitle: string;
    menu?: MenuItem[];
    userMenu?: UserMenuConfig;
}

export interface PageWrapperProps {
    children: React.ReactNode;
    menuItems: Record<string, MenuItem[]>;
    logo?: string | React.ReactNode;
    drawerFooterComponent?: React.ReactNode;
    topbarMenu?: MenuItem[];
    topbarUserMenu?: UserMenuConfig;
    breadcrumbsConfig?: BreadcrumbsConfig;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
    menuItems?: Record<string, MenuItem[]>;
    logo?: string | React.ReactNode;
    drawerFooterComponent?: React.ReactNode;
    topbarMenu?: MenuItem[];
    topbarUserMenu?: UserMenuConfig;
    breadcrumbsConfig?: BreadcrumbsConfig;
    requireAuth?: boolean;
    requiredRoles?: string[];
    fallbackPath?: string;
    isAuthenticated?: () => boolean;
    userRoles?: string[];
    usePageWrapper?: boolean;
}