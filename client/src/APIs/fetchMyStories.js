import Cookies from "js-cookie";

const fetchMyStories = async ( page) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/get_my_story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${Cookies.get('token')}`
        },
        body: JSON.stringify({page}),
      });

  
      const data = await res.json();
  
      if (res.status === 200) {
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch stories' };
      }
    } catch (error) {
      console.error('Error during story fetch:', error);
      return { success: false, error: 'Server error' };
    }
  };
  
  export default fetchMyStories;
  