import defaultData from 'assets/json/defaultData.json';

import { ACTION_TYPES } from './AppActions';

const bfs = (employees = [], condition = () => {}) => {
  if (!employees.length || (typeof condition !== 'function')) return false;

  const queue = [...employees];
  let front = 0;
  let rear = employees.length;

  while (front < rear) {
    const t = queue[front];
    if (condition(t)) return t;

    front += 1;

    if (t.subordinates && t.subordinates.length) {
      for (let i = 0; i < t.subordinates.length; i += 1) {
        queue.push(t.subordinates[i]);
        rear += 1;
      }
    }
  }

  return false;
};

export const initState = {
  data: defaultData,
  employees: [],
  target: null,
  endCoords: {
    x: null,
    y: null
  }
};

const reducer = (state = initState, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_DATA: {
      let { data } = action;
      if (data && !data.length) {
        data = [data];
      }

      return {
        ...state,
        data
      };
    }

    case ACTION_TYPES.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.employees
      };

    case ACTION_TYPES.SET_TARGET:
      return {
        ...state,
        target: action.target
      };

    case ACTION_TYPES.SET_END_COORDS:
      return {
        ...state,
        endCoords: action.coords
      };

    case ACTION_TYPES.ATTACH: {
      const { employees, target } = state;
      if (!target) return state;
      if (action.terminal === target) return state;

      const employees_ = [...employees];

      const terminal = bfs(employees_, (t) => (t.id === action.terminal));

      const origin = bfs(employees, (t) => {
        const i = t.subordinates.findIndex((e) => e.id === target);
        return (i >= 0);
      });

      if (!origin) return state;
      if (terminal === origin) {
        return {
          ...state,
          target: null
        };
      }

      const i = origin.subordinates.findIndex((e) => e.id === target);
      const cargo = origin.subordinates[i];

      origin.subordinates = [
        ...origin.subordinates.slice(0, i),
        ...origin.subordinates.slice(i + 1, origin.subordinates.length)
      ];

      terminal.subordinates.push(cargo);

      return {
        ...state,
        // data: JSON.parse(JSON.stringify(employees_)),
        employees: employees_,
        attaching: false,
        target: null
      };
    }

    default:
      return state;
  }
};

export default reducer;
