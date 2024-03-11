import config from '../config';

const getApiUrl = () => {
  const environment = process.env.NODE_ENV || 'development';
  return config[environment].apiUrl;
};

export { getApiUrl };