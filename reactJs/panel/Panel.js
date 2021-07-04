import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Home from "./screens/Home";
import AdminRequireLoginMiddleware from "../helper/AdminRequireLoginMiddleware";

export default function Panel() {
    return AdminRequireLoginMiddleware(<Router>
        <Navbar/>
        <Sidebar/>
        <Route path="/panel" exact><Home/></Route>
    </Router>)
}
