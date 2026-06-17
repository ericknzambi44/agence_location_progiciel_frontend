import { Routes, Route } from 'react-router-dom';
import { BienList } from './BienList';
import { BienCreate } from './BienCreate';
import { BienDetail } from './BienDetail';

/**
 * Module Stock – routes imbriquées.
 * Utilisé dans le routeur principal.
 */
export const StockModule = () => {
  return (
    <Routes>
      <Route index element={<BienList />} />
      <Route path="nouveau" element={<BienCreate />} />
      <Route path=":id" element={<BienDetail />} />
    </Routes>
  );
};