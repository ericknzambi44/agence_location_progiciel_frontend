import { Routes, Route } from 'react-router-dom';
import { StatistiquesPage } from './StatistiquesPage';

export const StatistiquesModule = () => {
  return (
    <Routes>
      <Route index element={<StatistiquesPage />} />
    </Routes>
  );
};