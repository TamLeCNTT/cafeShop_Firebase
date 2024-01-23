import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify';
import {
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom";
import Login from './component/user/Login';
import Home from './component/Home';
import Thongke from './component/admin/Thongke';
import ListProduct from './component/nhaphang/ListProduct';
function App() {

  return (
    <Router>
      <div className="App">

        <header className="App-header">


          <Routes>
          <Route path="/admin/thongke" element={<Thongke />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/product/list" element={<ListProduct />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </header>

      </div>
    </Router>
  );
}

export default App;
