import React, { useState, useEffect, useRef } from 'react';

import defaultData from 'assets/json/defaultData.json';
import Employee from 'models/Employee';
import Leaf from 'components/Leaf';

import './App.scss';

const App = () => {
  const [data] = useState(defaultData);
  const [employees, setEmployees] = useState([]);
  const chartRef = useRef();
  const appRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;
    const parseOrganizationData = (item) => {
      const e = new Employee(item.uniqueId, item.name);
      if (item.subordinates && item.subordinates.length) {
        item.subordinates.forEach((sub) => e.addSurbodinate(parseOrganizationData(sub)));
      }

      return e;
    };

    const org = data.map((item) => parseOrganizationData(item));
    setEmployees(org);
  }, [data]);

  useEffect(() => {
  }, [employees]);

  useEffect(() => {
    if (!appRef || !appRef.current) return;
    if (!chartRef || !chartRef.current) return;

    setTimeout(() => {
      appRef.current.scrollLeft = (chartRef.current.scrollWidth - window.innerWidth) / 2;
      appRef.current.scrollTop = (chartRef.current.scrollHeight - window.innerHeight) / 2;
    }, 0);
  }, [appRef]);

  return (
    <div id="app" ref={appRef}>
      <header>Organization Chart</header>

      <div className="chart-wrapper" ref={chartRef}>
        { employees.map((e, i) => (
          <Leaf label={e.name} key={e.id} subordinates={e.subordinates} level={0} />
        )) }
      </div>
    </div>
  );
}

export default App;
