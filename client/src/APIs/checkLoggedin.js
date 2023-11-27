import Cookies from "js-cookie";

const checkLoggedin = async () => {
    try {
        // eslint-disable-next-line
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/loggedin`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${Cookies.get('token')}`
        },
      });
    //   const data = await response.json();
    if(response.status!==200){
        Cookies.remove('token');
        Cookies.remove('username')
        Cookies.remove('id')
    }
      return response.status;
    } catch (error) {
      return (false);
    }
  };

  export default checkLoggedin;