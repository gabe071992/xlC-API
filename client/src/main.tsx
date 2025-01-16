import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Web3Modal } from '@web3modal/wagmi/react'
import App from './App';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
    <Web3Modal />
  </StrictMode>,
);
