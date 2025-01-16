import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createWeb3Modal } from '@web3modal/wagmi/react'
import App from './App';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
