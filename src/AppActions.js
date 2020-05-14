export const ACTION_TYPES = {
  SET_DATA: 'SET_DATA',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  SET_TARGET: 'SET_TARGET',
  SET_END_COORDS: 'SET_END_COORDS',
  SET_ATTACHING: 'SET_ATTACHING',
  ATTACH: 'ATTACH'
};

const setData = (data) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.SET_DATA,
    data
  });
};

const setEmployees = (employees) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.SET_EMPLOYEES,
    employees
  });
};

const setTarget = (target) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.SET_TARGET,
    target
  });
};

const setEndCoords = (coords) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.SET_END_COORDS,
    coords
  });
};

const setAttaching = (attaching) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.SET_ATTACHING,
    attaching
  });
};

const attach = (terminal) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.ATTACH,
    terminal
  });

  dispatch(setAttaching(true));
};

export default {
  setData,
  setEmployees,
  setTarget,
  setEndCoords,
  setAttaching,
  attach
};
