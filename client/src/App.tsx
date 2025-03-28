// src/App.tsx

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Layout from "./pages/Layout.js";
import Home from "./pages/Home.js";
import Upload from "./pages/Upload.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="upload" element={<Upload />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
