let API_URL;

if (process.env.REACT_APP_STAGE === 'development') {
  API_URL = 'http://localhost:3001/';
} else if (process.env.REACT_APP_STAGE === 'production') {
  API_URL = 'http://54.252.149.34:3001/';
};

export { API_URL };
