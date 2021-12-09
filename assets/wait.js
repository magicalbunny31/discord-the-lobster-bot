/**
 * @param {number} delay ms to wait for in code execution
 */
export default delay => new Promise(resolve => setTimeout(resolve, delay));