import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);

// React 挂载完成后移除 HTML 内联的首屏加载动画（淡出）
requestAnimationFrame(() => {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
  const loader = document.getElementById('boot-loader');
  if (loader) {
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 400);
  }
});
