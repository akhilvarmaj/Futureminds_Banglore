import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { pageFromPath, type PageTab } from './data/siteSeo';

const root = document.getElementById('root')!;
const initialPage = (root.dataset.page as PageTab) || pageFromPath(window.location.pathname) || 'home';
const application = (
  <StrictMode>
    <App initialPage={initialPage} />
  </StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, application);
else createRoot(root).render(application);
