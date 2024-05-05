import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
//styles
import './index.scss';
//components
import App from './App';
import reportWebVitals from './reportWebVitals';
//redux
import { appStore } from './redux/appStore';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={appStore}>
    <App />
  </Provider>
);

reportWebVitals();
