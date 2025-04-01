// src/App.tsx

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Layout from "./pages/Layout.js";
import Upload from "./pages/Upload.js";
import Home from "./pages/Home.js";
import { Agent } from "./pages/Agent.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="upload" element={<Upload />} />
      <Route path="agent" element={<Agent />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
