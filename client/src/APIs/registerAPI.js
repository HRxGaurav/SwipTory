const registerApi = async (username, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username, password,
        }),
      });
  
      const data = await res.json();
  
      if (res.status === 201) {
        return { success: true, data };
      } else {
        return { success: false, error: data ? data.error : 'Invalid Details' };
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, error: 'Server error' };
    }
  };
  
  export default registerApi;
  