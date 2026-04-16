import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import Dashboard from '@/pages/Dashboard';
import Editor from '@/pages/Editor';
import Templates from '@/pages/Templates';
import Settings from '@/pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
