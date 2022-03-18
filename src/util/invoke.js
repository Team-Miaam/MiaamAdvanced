import InvokeSystem from '../system/Invoke.system.js';

const invoke = ({ callback, time }) => {
	InvokeSystem.registerCallback({ callback, time });
};
export default invoke;
