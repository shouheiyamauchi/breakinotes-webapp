const development = {
  API_URL: 'http://localhost:3001/'
};

const production = {
  API_URL: 'https://103.230.158.66:3001/'
};

let config;

if (process.env.REACT_APP_STAGE === 'development') {
  config = development;
} else if (process.env.REACT_APP_STAGE === 'production') {
  config = production;
};

export { config }
