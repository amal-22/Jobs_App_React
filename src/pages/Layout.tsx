
import { memo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
//components
import SideMenu from "../components/sidemenu/SideMenu";
import Header from "../components/header/Header";
import JobList from "./home/JobList";

const Layout = () => {

    return (
        <div>
            <Header />
            <SideMenu />
            <Routes>
                <Route path="/" element={<Navigate to="/jobs" replace />} />
                <Route path="/jobs" element={<JobList />} /> 
                <Route path="/*"element={<Navigate to="/jobs" replace />} /> 
            </Routes>
        </div>
    );
};

export default memo(Layout);
