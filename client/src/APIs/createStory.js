import Cookies from "js-cookie";

const createStory = async (slides) => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      return { success: false, error: 'User not authenticated' };
    }

    const res = await fetch(`${process.env.REACT_APP_BACKEND}/create_story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ slides }),
    });

    const data = await res.json();

    if (res.status === 201) {
      return { success: true, data };
    } else {
      return { success: false, error: 'Failed to create story' };
    }
  } catch (error) {
    console.error('Error during story creation:', error);
    return { success: false, error: 'Server error' };
  }
};

export default createStory;
