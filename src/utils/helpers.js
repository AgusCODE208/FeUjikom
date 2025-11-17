import { STORAGE_URL } from '../config/constants';

export const getStorageUrl = (path) => {
  if (!path) return '';
  return `${STORAGE_URL}/${path}`;
};
