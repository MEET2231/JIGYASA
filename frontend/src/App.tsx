import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SurveyList from './pages/surveys/SurveyList';
import SurveyBuilder from './pages/surveys/SurveyBuilder';
import SurveyResponse from './pages/surveys/SurveyResponse';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="surveys" element={<SurveyList />} />
          <Route path="surveys/new" element={<SurveyBuilder />} />
          <Route path="surveys/:id" element={<SurveyResponse />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;