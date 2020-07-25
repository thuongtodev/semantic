// React
import React, { Component, useEffect, useState } from 'react';
import Chart from 'react-google-charts';

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [dataLoadingStatus, setDataLoadingStatus] = useState('loading');

  useEffect(() => {
    async function fetchData() {
      const COUNTRY_CODE = 'lb';
      const INDICATOR = 'DT.DOD.DECT.CD';
      const response = await fetch(
        'https://api.worldbank.org/v2/countries/' +
          COUNTRY_CODE +
          '/indicators/' +
          INDICATOR +
          '?format=json'
      );
      const json = await response.json();
      const [metadata, data] = json;
      console.log(json);
      const columns = [
        { type: 'date', label: 'Year' },
        { type: 'number', label: 'Debt' },
      ];
      let rows = [];
      const nonNullData = data.filter((row) => row.value !== null);
      for (let row of nonNullData) {
        const { date, value } = row;
        rows.push([new Date(Date.parse(date)), value]);
      }

      setChartData([columns, ...rows]);
      setDataLoadingStatus('ready');
    }
    fetchData();
  }, []);
  return (
    <div className="App">
      {dataLoadingStatus === 'ready' && (
        <Chart
          chartType="LineChart"
          data={chartData}
          options={{
            hAxis: {
              format: 'yyyy',
            },
            vAxis: {
              format: 'short',
            },
            title: 'Debt incurred over time.',
            animation: {
              duration: 1000,
              easing: 'out',
              startup: true,
            }
          }}
          rootProps={{ 'data-testid': '2' }}
        />
      )}
      {dataLoadingStatus !== 'ready' && <div>Fetching data from API</div>}
    </div>
  );
};

export default App;
