export const ACTION_TYPES = {
  SET_ACTIVE_MODAL: 'SET_ACTIVE_MODAL',
  SET_DATA: 'SET_DATA',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  SET_TARGET: 'SET_TARGET',
  SET_END_COORDS: 'SET_END_COORDS',
  ATTACH: 'ATTACH',
  DETACH: 'DETACH',
  ADD_LEAF: 'ADD_LEAF',
  EDIT_LEAF: 'EDIT_LEAF'
};

const toggleModal = (name, val) => ({
  type: ACTION_TYPES.SET_ACTIVE_MODAL,
  name,
  val
});

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

const attach = (terminal) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.ATTACH,
    terminal
  });
};

const detach = (target) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.DETACH,
    target
  });
};

const addLeaf = (terminal, employee) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.ADD_LEAF,
    terminal,
    employee
  });
};

const editLeaf = (target, name) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.EDIT_LEAF,
    target,
    name
  });
};

export default {
  toggleModal,
  setData,
  setEmployees,
  setTarget,
  setEndCoords,
  attach,
  detach,
  addLeaf,
  editLeaf
};
