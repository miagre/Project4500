// ContributionsAnalysis.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const TableHeader = styled.th`
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: #e9e9e9;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const FilterControls = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ContributionsAnalysis = () => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState('total_contributions');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterAmount, setFilterAmount] = useState('');
  const [filterType, setFilterType] = useState('greater');

  useEffect(() => {
    // Fetch data from your API
    fetchContributionData();
  }, []);

  const fetchContributionData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contributions');
      const contributionData = await response.json();
      setData(contributionData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredData = data
    .filter(item => {
      if (!filterAmount) return true;
      const amount = parseFloat(filterAmount);
      return filterType === 'greater' 
        ? item.total_contributions > amount 
        : item.total_contributions < amount;
    })
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return multiplier * (a[sortField] - b[sortField]);
    });

  return (
    <TableContainer>
      <FilterControls>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="greater">Greater Than</option>
          <option value="less">Less Than</option>
        </select>
        <input
          type="number"
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
          placeholder="Enter amount..."
        />
      </FilterControls>

      <Table>
        <thead>
          <tr>
            <TableHeader onClick={() => handleSort('employer')}>
              Company
            </TableHeader>
            <TableHeader onClick={() => handleSort('total_contributions')}>
              Total Contributions
            </TableHeader>
            <TableHeader onClick={() => handleSort('num_contributors')}>
              #of Contributors
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.employer}</TableCell>
              <TableCell>{formatCurrency(item.total_contributions)}</TableCell>
              <TableCell>{formatCurrency(item.num_contributors)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ContributionsAnalysis;
