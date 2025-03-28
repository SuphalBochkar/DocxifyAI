import { Outlet } from "react-router-dom";

const Layout = () => (
  <div>
    <header>My App</header>
    <main>
      <Outlet />
    </main>
    <footer>Footer</footer>
  </div>
);

export default Layout;
