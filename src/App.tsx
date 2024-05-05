import { BrowserRouter } from "react-router-dom";
//styles
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from "./pages/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
