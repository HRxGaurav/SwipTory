import Cookies from "js-cookie";

const editStory = async (id, slides) => {
    try {
      const token = Cookies.get('token'); 
      const reqUrl = `${process.env.REACT_APP_BACKEND}/edit_story`;
  
      const response = await fetch(reqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ id, slides }),
      });
  
      if (response.status === 200) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, message: 'Edit story data failed' };
      }
    } catch (error) {
      console.error('Error editing story:', error);
      return { success: false, message: 'An error occurred' };
    }
  };
  
  export default editStory;
  