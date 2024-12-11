import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BlogPage from "./pages/BlogPage";
import AdminListPage from "./pages/AdminListPage";
import Layout from "./Layouts/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import "./App.css";
import BlogDetailPage from "./pages/BlogDetailPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<PublicRoute />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<BlogPage />} />
          {/* <Route
            path="blog/create"
            element={<BlogDetailPage isEditing={false} />}
          /> */}
          <Route path="blog/:id" element={<BlogDetailPage />} />
          <Route element={<SuperAdminRoute />}>
            <Route path="admins" element={<AdminListPage />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
