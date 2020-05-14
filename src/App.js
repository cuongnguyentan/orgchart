import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/all';

import Employee from 'models/Employee';
import Leaf from 'components/Leaf';

import { getJSON } from 'helpers';

import appActions from './AppActions';
import './App.scss';

gsap.registerPlugin(Draggable);

const App = () => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.app);
  const { employees } = useSelector((state) => state.app);

  const chartRef = useRef();
  const appRef = useRef();
  const fileInputRef = useRef();

  const browseFile = () => {
    if (!fileInputRef || !fileInputRef.current) return;

    fileInputRef.current.click();
  };

  const loadData = async (e) => {
    const file = e.target.files[0];
    try {
      const json = await getJSON(file);
      const load = JSON.parse(json);
      dispatch(appActions.setData(load));
    } catch(err) {
      alert(err.toString());
    }
  };

  useEffect(() => {
    if (!data) return;

    const parseOrganizationData = (item) => {
      const e = new Employee(item.uniqueId, item.name);
      if (item.subordinates && item.subordinates.length) {
        item.subordinates.forEach((sub) => e.addSurbodinate(parseOrganizationData(sub)));
      }

      return e;
    };

    const org = data.map((item) => parseOrganizationData(item));
    dispatch(appActions.setEmployees(org));
  }, [data, dispatch]);

  useEffect(() => {
    if (!appRef || !appRef.current) return;
    if (!chartRef || !chartRef.current) return;

    setTimeout(() => {
      appRef.current.scrollLeft = (chartRef.current.scrollWidth - window.innerWidth) / 2;
      appRef.current.scrollTop = (chartRef.current.scrollHeight - window.innerHeight) / 2;
    }, 0);
  }, [appRef, employees]);

  return (
    <div id="app" ref={appRef}>
      <header>Organization Chart</header>

      <div className="chart-wrapper" ref={chartRef}>
        { employees.map((e) => (
          <Leaf label={e.name} id={e.id} key={e.id} subordinates={e.subordinates} level={0} />
        )) }
      </div>

      <div className="controls">
        <FontAwesomeIcon icon={faFolderOpen} onClick={() => browseFile()} />
        <input type="file" ref={fileInputRef} accept=".json" onChange={(e) => loadData(e)} />
      </div>
    </div>
  );
};

export default App;
