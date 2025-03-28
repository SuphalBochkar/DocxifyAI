import { Outlet } from "react-router-dom";

const Layout = () => (
  <div>
    <header>My App</header>
    <main>
      <Outlet />
    </main>
    <footer>My Footer</footer>
  </div>
);

export default Layout;
