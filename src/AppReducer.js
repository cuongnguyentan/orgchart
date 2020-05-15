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
  activeModal: null,
  data: defaultData,
  employees: [],
  target: null,
  endCoords: {
    x: null,
    y: null
  },
  lastTerminal: null,
  lastDetach: null
};

const reducer = (state = initState, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_ACTIVE_MODAL: {
      const { name, val } = action;
      let obj = { ...state };

      if (state.activeModal === name) {
        if ((typeof val === 'undefined')
        || ((typeof val === 'boolean') && !val)) {
          obj = {
            ...state,
            activeModal: null
          };
        }
      } else {
        if ((typeof val === 'undefined')
        || ((typeof val === 'boolean') && val)) {
          obj = {
            ...state,
            activeModal: name
          };
        }
      }
      return obj;
    }

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

      const detach = bfs(employees_, (t) => {
        const i = t.subordinates.findIndex((e) => e.id === target);
        return (i >= 0);
      });

      if (!detach) return state;
      if (terminal === detach) {
        return {
          ...state,
          target: null
        };
      }

      const i = detach.subordinates.findIndex((e) => e.id === target);
      const cargo = detach.subordinates[i];

      detach.subordinates = [
        ...detach.subordinates.slice(0, i),
        ...detach.subordinates.slice(i + 1, detach.subordinates.length)
      ];

      terminal.subordinates.push(cargo);

      return {
        ...state,
        employees: employees_,
        target: null,
        lastTerminal: terminal.id,
        lastDetach: detach.id
      };
    }

    case ACTION_TYPES.DETACH: {
      const target = action.target || state.target;
      const { employees } = state;
      const employees_ = [...employees];

      const detach = bfs(employees_, (t) => {
        const i = t.subordinates.findIndex((e) => e.id === target);
        return (i >= 0);
      });

      if (!detach) return state;

      const i = detach.subordinates.findIndex((e) => e.id === target);

      detach.subordinates = [
        ...detach.subordinates.slice(0, i),
        ...detach.subordinates.slice(i + 1, detach.subordinates.length)
      ];

      return {
        ...state,
        employees: employees_,
        target: null,
        lastDetach: detach.id
      };
    }

    case ACTION_TYPES.ADD_LEAF: {
      const target = action.terminal || state.target;
      const { employee } = action;
      const { employees } = state;
      const employees_ = [...employees];

      const terminal = bfs(employees_, (t) => (t.id === target));
      terminal.subordinates.push(employee);

      return {
        ...state,
        employees: employees_,
        target: employee.id,
        lastTerminal: terminal.id
      };
    }

    case ACTION_TYPES.EDIT_LEAF: {
      const target = action.target || state.target;
      const { name } = action;
      const { employees } = state;
      const employees_ = [...employees];

      const leaf = bfs(employees_, (t) => (t.id === target));
      if (!leaf) return state;

      leaf.name = name;

      return {
        ...state,
        employees: employees_,
      };
    }

    default:
      return state;
  }
};

export default reducer;
