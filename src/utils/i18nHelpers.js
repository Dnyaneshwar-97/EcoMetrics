/** Convert kebab-case id to camelCase for i18n keys */
export const kebabToCamel = (value) =>
  value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
