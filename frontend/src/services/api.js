import axios from 'axios';

export const executeQuery = async (query) => {
  try {
    const response = await axios.post('https://stadvdb-mco2-g11.onrender.com/query', { query });
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Unable to connect to the server');
      alert('Unable to connect to the server. Please try again later.');
    }
    throw error; // Re-throw the error if necessary
  }
};


export const executeRedirect = async () => {
  try {
    const response = await axios.get('https://stadvdb-mco2-g11.onrender.com/redirect-node');
    if (response.data.status === 'error') {
      // Display an alert for node failure
      alert(response.data.message);
    } else {
      console.log(response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error('Error checking node status:', error);
    throw error;
  }
};

export const checkNode1 = async () => {
  try {
    const response = await axios.get('https://stadvdb-mco2-g11.onrender.com/check-node1');
    
    if (response.data.status === 'error') {
      // Instead of alerting here, just return the error response
      return { status: 'error', message: response.data.message };
    } else {
      console.log(response.data.message);
      return { status: 'success', message: response.data.message };
    }
  } catch (error) {
    console.error('Error checking node status:', error);
    return { status: 'error', message: 'An error occurred while checking node status.' };
  }
};
