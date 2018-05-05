import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BrowserRouter><Route path="/" component={routerParams => <App {...routerParams} />} /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
