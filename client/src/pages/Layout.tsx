import { Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import Footer from "../components/Footer";

const Layout = () => (
  <div>
    <Navigation />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
