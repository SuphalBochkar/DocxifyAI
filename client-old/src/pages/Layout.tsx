import { Outlet } from "react-router-dom";
import Footer from "../components/Main/Footer";
import { Navbar } from "../components/Main/Navbar";

const Layout = () => (
  <div>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
