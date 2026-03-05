const BASE_URL = 'https://api.iconify.design';

const PREFIX_NAMES: Record<string, string> = {
  mdi: 'Material Design',
  'material-symbols': 'Material Symbols',
  lucide: 'Lucide',
  ph: 'Phosphor',
  ri: 'Remix Icons',
  bi: 'Bootstrap',
  fa: 'Font Awesome',
  fa6: 'Font Awesome 6',
  tabler: 'Tabler',
  ion: 'Ionicons',
  heroicons: 'Heroicons',
  octicon: 'Octicons',
  feather: 'Feather',
  'ant-design': 'Ant Design',
  carbon: 'Carbon',
  clarity: 'Clarity',
  majesticons: 'Majesticons',
  bx: 'Boxicons',
};

export interface IconSearchResult {
  prefix: string;
  name: string;
  fullName: string;
  libraryName: string;
}

/**
 * Search icons via the Iconify REST API.
 */
export async function searchIcons(
  query: string,
  limit = 96,
  enabledPrefixes?: string[]
): Promise<IconSearchResult[]> {
  let url = `${BASE_URL}/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  if (enabledPrefixes && enabledPrefixes.length > 0) {
    url += `&prefixes=${enabledPrefixes.join(',')}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Iconify API error: ${res.status}`);
  const data = await res.json();

  const icons: string[] = data.icons ?? [];
  return icons.map((fullName: string) => {
    const colonIdx = fullName.indexOf(':');
    const prefix = fullName.substring(0, colonIdx);
    const name = fullName.substring(colonIdx + 1);
    return {
      prefix,
      name,
      fullName,
      libraryName: PREFIX_NAMES[prefix] ?? prefix,
    };
  });
}

/**
 * Fetch raw SVG for an icon. Returns SVG with currentColor so tint can be
 * applied at render time via react-native-svg's `color` prop.
 */
export async function fetchIconSvg(prefix: string, name: string): Promise<string> {
  const url = `${BASE_URL}/${prefix}/${name}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Cannot fetch icon: ${prefix}:${name}`);
  return await res.text();
}
