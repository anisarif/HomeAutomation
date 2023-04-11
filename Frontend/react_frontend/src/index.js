//import react into the bundle
import React from "react";
import { createRoot } from 'react-dom/client';

//include your index.scss file into the bundle
import "./index.css";

//import your own components
import Layout from "./layout";
const root = createRoot(document.getElementById("root"))
root.render(<Layout />);
