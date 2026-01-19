import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MenuItem } from '../components/template/types';

/**
 * Resolves route parameters in menu item paths.
 * Replaces :param placeholders with actual values from the current route.
 *
 * @param menuItems - Record of menu item arrays, keyed by section name
 * @returns Resolved menu items with parameters replaced in paths
 *
 * @example
 * ```typescript
 * // Route: /projects/:projectId/suites/:suiteId
 * // Current params: { projectId: '123', suiteId: '456' }
 *
 * const menuItems = {
 *   main: [
 *     { label: 'Overview', path: '/projects/:projectId' },
 *     { label: 'Suites', path: '/projects/:projectId/suites' },
 *     { label: 'Current Suite', path: '/projects/:projectId/suites/:suiteId' }
 *   ]
 * };
 *
 * const resolved = useResolvedMenu(menuItems);
 * // Result:
 * // {
 * //   main: [
 * //     { label: 'Overview', path: '/projects/123' },
 * //     { label: 'Suites', path: '/projects/123/suites' },
 * //     { label: 'Current Suite', path: '/projects/123/suites/456' }
 * //   ]
 * // }
 * ```
 */
export function useResolvedMenu(
	menuItems: Record<string, MenuItem[]>
): Record<string, MenuItem[]> {
	const params = useParams();

	return useMemo(() => {
		// If no params, return as-is
		if (!params || Object.keys(params).length === 0) {
			return menuItems;
		}

		// Resolve params in all menu items
		return Object.entries(menuItems).reduce(
			(acc, [sectionKey, items]) => {
				acc[sectionKey] = items.map((item) => ({
					...item,
					path: resolvePathParams(item.path, params),
				}));
				return acc;
			},
			{} as Record<string, MenuItem[]>
		);
	}, [menuItems, params]);
}

/**
 * Replaces :param placeholders in a path with actual values from params object.
 *
 * @param path - Path string with :param placeholders
 * @param params - Object containing parameter values
 * @returns Path with placeholders replaced
 *
 * @internal
 */
function resolvePathParams(
	path: string,
	params: Record<string, string | undefined>
): string {
	let resolvedPath = path;

	// Replace each param placeholder with its value
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined) {
			// Match :paramName with word boundaries to avoid partial replacements
			const regex = new RegExp(`:${key}\\b`, 'g');
			resolvedPath = resolvedPath.replace(regex, value);
		}
	});

	return resolvedPath;
}

