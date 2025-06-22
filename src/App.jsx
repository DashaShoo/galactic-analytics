import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header'
import { AnalyticsPage } from './pages/AnalyticsPage/AnalyticsPage';
import { GeneratePage } from './pages/GeneratePage/GeneratePage';
import { HistoryPage } from './pages/HistoryPage/HistoryPage';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<AnalyticsPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </>
  );
}
export default App
