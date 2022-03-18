import TimeManagement from '../system/TimeManagement.system.js';

const invoke = ({ callback, time }) => {
	TimeManagement.registerCallback({ callback, time });
};
export default invoke;
