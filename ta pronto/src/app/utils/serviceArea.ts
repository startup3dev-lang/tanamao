export const DEFAULT_LOCATION = 'Teresina - PI';

const normalizeLocation = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR');

export const isLocationSupported = (location: string) =>
  /(?:^|[,\s])teresina(?:\s*-\s*pi)?$/.test(normalizeLocation(location).trim());
