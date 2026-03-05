import { useState, useEffect } from 'react';
import { searchIcons, IconSearchResult } from '../utils/iconify';

export interface GroupedIcons {
  prefix: string;
  libraryName: string;
  icons: IconSearchResult[];
}

export function useIconSearch(enabledPrefixes?: string[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IconSearchResult[]>([]);
  const [groups, setGroups] = useState<GroupedIcons[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setGroups([]);
      setActiveFilter(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchIcons(query, 96, enabledPrefixes);
        setResults(data);

        // Group by prefix, sorted by group size descending
        const map = new Map<string, GroupedIcons>();
        for (const icon of data) {
          if (!map.has(icon.prefix)) {
            map.set(icon.prefix, {
              prefix: icon.prefix,
              libraryName: icon.libraryName,
              icons: [],
            });
          }
          map.get(icon.prefix)!.icons.push(icon);
        }
        const sorted = Array.from(map.values()).sort(
          (a, b) => b.icons.length - a.icons.length
        );
        setGroups(sorted);
        setActiveFilter((prev) => {
          const exists = prev !== null && sorted.some((g) => g.prefix === prev);
          return exists ? prev : null;
        });
      } catch {
        setError('Failed to search icons. Check your connection.');
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, JSON.stringify(enabledPrefixes)]);

  const visibleIcons = activeFilter
    ? groups.find((g) => g.prefix === activeFilter)?.icons ?? []
    : results;

  return {
    query,
    setQuery,
    groups,
    activeFilter,
    setActiveFilter,
    visibleIcons,
    isLoading,
    error,
  };
}
