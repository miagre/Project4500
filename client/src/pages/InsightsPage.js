import React from 'react';
import ContributionsAnalysis from './ContributionsAnalysis';

const InsightsPage = () => {
  return (
    <div className="campaign-finance-page">
      <h1>Campaign Finance Analysis</h1>
      <p>Explore campaign contributions and spending data for the 2020 election.</p>
      <ContributionsAnalysis />
    </div>
  );
};

export default InsightsPage;
