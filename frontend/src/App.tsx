import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AnnouncementDetailPage from "./pages/AnnouncementDetailPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/announcements" replace />} />
                    <Route path="/announcements" element={<AnnouncementsPage />} />
                    <Route path="/announcements/new" element={<AnnouncementDetailPage />} />
                    <Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
