const getStoryById = async (id, callback) => {
    try {
      const reqUrl = `${process.env.REACT_APP_BACKEND}/get_story_by_id/${id}`;
  
      const response = await fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        const data = await response.json();
        callback({ success: true, data });
      } else {
        callback({ success: false, message: 'Get story data failed' });
      }
    } catch (error) {
      console.error('Error getting story data:', error);
      callback({ success: false, message: 'An error occurred' });
    }
  };
  
  export default getStoryById;
  




// const getStoryById = async (params) => {
//     try {
//       const reqUrl = `${process.env.REACT_APP_BACKEND}/get_story_by_id/${params}`;
  
//       const response = await fetch(reqUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
  
//       if (response.status === 200) {
//         const data = await response.json();
//         return { success: true, data };
//       } else {
//         return { success: false, message: 'Get job description data failed' };
//       }
//     } catch (error) {
//       console.error('Error getting job data:', error);
//       return { success: false, message: 'An error occurred' };
//     }
//   };
  
//   export default getStoryById;
  