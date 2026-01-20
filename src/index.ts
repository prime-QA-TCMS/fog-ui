export * from './theme';

// API utilities
export { AxiosHelper } from './api/axiosHelper';
export { createAuthenticatedClient } from './api/createAuthenticatedClient';
export { AxiosProvider, useAxios, useService } from './api/AxiosProvider';
export * from './api/types';

// Hooks
export { useApi } from './hooks/useApi';
export { useNavigationWithContext } from './hooks/useNavigationWithContext';
export type { NavigationContext, NavigationWithContextReturn } from './hooks/useNavigationWithContext';

// Public component exports (named) - re-exporting from component files so
// consumers can import from 'fog-ui'. These use named exports at the package
// boundary even if component source files currently use default exports.
export { ErrorBoundary } from './components/errorBoundary/ErrorBoundary';
export type { ErrorBoundaryProps } from './components/errorBoundary/ErrorBoundary';

export { ToastProvider, ToastContext } from './components/toast/ToastProvider';
export type { ToastProviderProps } from './components/toast/ToastProvider';
export { Toast } from './components/toast/Toast';
export type { ToastProps } from './components/toast/Toast';
export { ToastContainer } from './components/toast/ToastContainer';
export { useToast } from './components/toast/useToast';
export type { Toast as ToastType, ToastVariant, ToastPosition, ToastOptions, ToastContextValue } from './components/toast/types';

export { PageWrapper } from './components/template/PageWrapper';
export { Topbar } from './components/template/Topbar';
export { ProtectedRoute } from './components/template/ProtectedRoute';
export type { MenuItem, UserMenuConfig, BreadcrumbsConfig, TopBarProps, PageWrapperProps, ProtectedRouteProps } from './components/template/types';

export { GenericTabs as Tabs } from './components/tabs/Tabs';

export { DataTable } from './components/table/DataTable';
export { DataRow } from './components/table/DataRow';
export { DataLoading } from './components/table/DataLoading';
export { NestedTable } from './components/table/NestedTable';
export { TableHeader } from './components/table/TableHeader';
export { NoDataTableRow } from './components/table/NoDataTableRow';

export { Popup } from './components/popup/popup';

export { GenericList as List } from './components/lists/List';
export { CircularProgressList } from './components/lists/CircularProgressList';
export { AccordionList } from './components/lists/AccordionList';
export { GenericListView } from './components/lists/GenericListView';
export type { GenericListViewProps } from './components/lists/GenericListView';

export { GenericForm as Form } from './components/forms/Form';
export { PopUpForm } from './components/forms/PopUpForm';
export { SearchForm } from './components/forms/SearchForm';

export { TrendAnalyticsChart } from './components/charts/TrendAnalyticsChart/TrendAnalyticsChart';
export { GenericPieChart } from './components/charts/pieChart/GenericPieChart';

export { CardListContainer } from './components/cards/CardListContainer';
export { CardView } from './components/cards/CardView';
export { FilterFormCard } from './components/cards/FilterFormCard';
export { PermissionCard } from './components/cards/PermissionCard';
export { UserGroupCard } from './components/cards/UserGroupCard';
export { MetricCardGrid } from './components/cards/metricCard/MetricCardGrid';

// Export shared types
export * from './types';

// Style utilities
export {
	pageContainer,
	DrawerContainer,
	loginContainer,
	contentContainer,
	wrapContainer,
	halfScreenContainer,
} from './style/muiComponentStyles/containerStyles';
export {
	pageTitle,
	sectionTitle,
	bodyText,
	captionText,
} from './style/muiComponentStyles/typographyStyles';

