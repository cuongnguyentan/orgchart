import React, { useState, useEffect, useRef } from 'react';
import { gsap, TweenMax } from 'gsap';
import { Draggable } from 'gsap/all';

import defaultData from 'assets/json/defaultData.json';
import Employee from 'models/Employee';
import Leaf from 'components/Leaf';

import './App.scss';

gsap.registerPlugin(Draggable);

const App = () => {
  const [data] = useState(defaultData);
  const [employees, setEmployees] = useState([]);
  const chartRef = useRef();

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
    if (!chartRef || !chartRef.current) return;

    Draggable.create(chartRef.current, {
      type: 'x, y',
    });

    setTimeout(() => {
      TweenMax.set(chartRef.current, { x: (window.innerWidth - chartRef.current.scrollWidth) / 2 });
    }, 0);
  }, [chartRef]);

  return (
    <div id="app">
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
