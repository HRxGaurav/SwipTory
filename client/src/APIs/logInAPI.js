const loginApi = async (username, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username, password,
        }),
      });
  
      const data = await res.json();
  
      if (res.status === 200) {
        return { success: true, data };
      } else {
        return { success: false, error: 'Invalid Details' };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Server error' };
    }
  };
  
  export default loginApi;
  