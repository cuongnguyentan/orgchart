import { v4 as uuidv4 } from 'uuid';

function Employee(id, name) {
  this.id = id || uuidv4();
  this.name = name || 'unnamed';
  this.subordinates = [];
}

Employee.prototype.addSurbodinate = function addSurbodinate(e) {
  this.subordinates.push(e);
};


export default Employee;
