import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Radio, Space, Typography } from 'antd';
import { config } from '../config';

const { Title } = Typography;
const { Option } = Select;

const InsightsPage = () => {
  const [employerData, setEmployerData] = useState([]);
  const [occupationData, setOccupationData] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [filterAmount, setFilterAmount] = useState('');
  const [comparisonType, setComparisonType] = useState('greater');
  const [employerSortField, setEmployerSortField] = useState('total_contributions');
  const [occupationSortField, setOccupationSortField] = useState('total_contributions');

  const columns = [
    {
      title: 'Name',
      dataIndex: 'employer',
      key: 'employer',
    },
    {
      title: 'Total Contributions ($)',
      dataIndex: 'total_contributions',
      key: 'total_contributions',
      sorter: true,
      render: (value) => value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    },
    {
      title: 'Number of Contributors',
      dataIndex: 'num_contributors',
      key: 'num_contributors',
      sorter: true,
    },
    {
      title: 'Average Contribution ($)',
      dataIndex: 'avg_contribution',
      key: 'avg_contribution',
      sorter: true,
      render: (value) => value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    },
    {
      title: 'Max Contribution ($)',
      dataIndex: 'max_contribution',
      key: 'max_contribution',
      sorter: true,
      render: (value) => value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    },
    {
      title: 'Min Contribution ($)',
      dataIndex: 'min_contribution',
      key: 'min_contribution',
      sorter: true,
      render: (value) => value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    },
  ];

  const occupationColumns = [...columns].map(col => ({
    ...col,
    dataIndex: col.dataIndex === 'employer' ? 'occupation' : col.dataIndex,
  }));

  useEffect(() => {
    fetchData();
  }, [filterAmount, comparisonType, employerSortField, occupationSortField]);

  const fetchData = async () => {
    let employerUrl = `${config.server_url}/all_employer_stats?sort_by=${employerSortField}`;
    let occupationUrl = `${config.server_url}/all_occupation_stats?sort_by=${occupationSortField}`;

    if (filterAmount) {
      employerUrl = `${config.server_url}/filtered_employer_stats?amount=${filterAmount}&comparison=${comparisonType}`;
      occupationUrl = `${config.server_url}/filtered_occupation_stats?amount=${filterAmount}&comparison=${comparisonType}`;
    }

    const [employerRes, occupationRes] = await Promise.all([
      fetch(employerUrl),
      fetch(occupationUrl)
    ]);

    const [employerData, occupationData] = await Promise.all([
      employerRes.json(),
      occupationRes.json()
    ]);

    setEmployerData(employerData);
    setOccupationData(occupationData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Contribution Insights</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space>
          <Input
            placeholder="Filter by amount"
            type="number"
            value={filterAmount}
            onChange={(e) => setFilterAmount(e.target.value)}
            style={{ width: 200 }}
          />
          <Radio.Group value={comparisonType} onChange={(e) => setComparisonType(e.target.value)}>
            <Radio.Button value="greater">Greater Than</Radio.Button>
            <Radio.Button value="less">Less Than</Radio.Button>
          </Radio.Group>
        </Space>

        <div>
          <Title level={3}>Employer Contributions</Title>
          <Select
            style={{ width: 300, marginBottom: 16 }}
            placeholder="Select an employer to view details"
            onChange={setSelectedEmployer}
            allowClear
          >
            {employerData.map(emp => (
              <Option key={emp.employer} value={emp.employer}>{emp.employer}</Option>
            ))}
          </Select>
          <Table
            columns={columns}
            dataSource={employerData}
            rowKey="employer"
            onChange={(pagination, filters, sorter) => {
              setEmployerSortField(sorter.field || 'total_contributions');
            }}
            pagination={{ pageSize: 10 }}
          />
        </div>

        <div>
          <Title level={3}>Occupation Contributions</Title>
          <Select
            style={{ width: 300, marginBottom: 16 }}
            placeholder="Select an occupation to view details"
            onChange={setSelectedOccupation}
            allowClear
          >
            {occupationData.map(occ => (
              <Option key={occ.occupation} value={occ.occupation}>{occ.occupation}</Option>
            ))}
          </Select>
          <Table
            columns={occupationColumns}
            dataSource={occupationData}
            rowKey="occupation"
            onChange={(pagination, filters, sorter) => {
              setOccupationSortField(sorter.field || 'total_contributions');
            }}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Space>
    </div>
  );
};

export default InsightsPage;
