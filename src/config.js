const dev = {
  API_URL: "localhost:3001/"
};

const prod = {
  API_URL: "https://api.breakinotes.com/"
};

const config = (process.env.REACT_APP_STAGE === 'production') ? prod : dev

export { config }
