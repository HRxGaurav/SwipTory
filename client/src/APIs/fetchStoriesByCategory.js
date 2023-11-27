import Cookies from "js-cookie";

const fetchStoriesByCategory = async ( category, page) => {
    try {
      const userId = Cookies.get('id')
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/get_story_by_category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({category, page, userId}),
      });

  
      const data = await res.json();
  
      if (res.status === 200) {
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch stories' };
      }
    } catch (error) {
      console.error('Error during story fetch:', error);
      console.log("here");
      return { success: false, error: 'Server error' };
    }

  };
  
  export default fetchStoriesByCategory;
  