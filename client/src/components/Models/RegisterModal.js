import React, { useState, useEffect, useContext } from "react";
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import registerApi from "../../APIs/registerAPI";
import loginModal from './LoginModal.module.css';
import openEye from '../../assets/icons/eye.png';
import closedEye from '../../assets/icons/closed-eyes.png';
import toast from 'react-hot-toast';
import LogContext from '../../Utilities/LogContext.js'
import IsMobileView from "../../Utilities/IsMobileView.js";


const EyeIcons = ({ isPasswordVisible, togglePasswordVisibility }) => {
    return (

        <>
        { !IsMobileView() ? <div className={loginModal.eyeIcons}>
            {isPasswordVisible ? (
                <img src={openEye} alt="Open Eye" onClick={togglePasswordVisibility} />
            ) : (
                <img src={closedEye} alt="Closed Eye" onClick={togglePasswordVisibility} />
            )}
        </div>

        :

        <div className={loginModal.eyeIconsMobile}>
            {isPasswordVisible ? (
                <img src={openEye} alt="Open Eye" onClick={togglePasswordVisibility} />
            ) : (
                <img src={closedEye} alt="Closed Eye" onClick={togglePasswordVisibility} />
            )}
        </div>}
        </>
    );
};

function RegisterModal({ closeModalState, closeModalMobileState }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showError, setShowError] = useState();    
    const [isUserLoggedin , setIsUserLoggedin] = useContext(LogContext);
    const navigate = useNavigate();

    const handleContainerClick = (event) => {
        event.stopPropagation();
    };

    const closeModal = () => {
        closeModalState(false);
        closeModalMobileState(false)
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    // Stop scrolling when modal is open
    useEffect(() => {
        const body = document.body;

        if (closeModalState) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }

        return () => {
            body.style.overflow = 'auto';
        };
    }, [closeModalState]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const registerButton = async () => {
        const { username, password } = formData;
        setShowError()
        if (!username && !password) {
            setShowError("Please fill all input");
            return;
        }
        const result = await registerApi(username, password);

        if (result.success) {
            closeModalState();
            toast.success("Registered successfully");            
            setIsUserLoggedin(true);
            Cookies.set('token', result.data.token, { expires: 7 });
            Cookies.set('username', result.data.username, { expires: 7 });
            Cookies.set('id', result.data.id, { expires: 7 });
              navigate('/');
        } else {
            toast.error(result.error);
        }
    };

    return ReactDOM.createPortal(
        <>
            {!IsMobileView ? <div className={loginModal.modalBackground} onClick={closeModal}>
                <div className={loginModal.modalContainer} onClick={handleContainerClick}>
                    <div className={loginModal.crossButton} onClick={closeModal}>X</div>
                    <div className={loginModal.heading}>Register to SwipTory</div>
                    <div className={loginModal.inputFields}>
                        <div className={loginModal.inputDiv}>
                            <label className={loginModal.username}>UserName</label>
                            <input className={loginModal.usernameInput} type="name" name="username" placeholder='Enter username' value={formData.name} onChange={handleChange} autoComplete='off'></input>
                        </div>

                        <div className={loginModal.passwordDiv}>
                            <label className={loginModal.password}>Password</label>
                            <input className={loginModal.passwordInput} type={isPasswordVisible ? "text" : "password"} name="password" placeholder='Enter password' value={formData.password} onChange={handleChange} autoComplete='off' />
                            <EyeIcons
                                isPasswordVisible={isPasswordVisible}
                                togglePasswordVisibility={togglePasswordVisibility}
                            />
                        </div>
                        {showError && <div className={loginModal.invalidDetails}>{showError}</div>}
                    </div>
                    <div className={loginModal.registerButton} onClick={registerButton}>Register</div>
                </div>
            </div>

            :

            <div className={loginModal.modalBackground} onClick={closeModal}>
                <div className={loginModal.modalContainerMobile} onClick={handleContainerClick}>
                <div className={loginModal.crossButtonMobile} onClick={closeModal}>X</div>
                    <div className={loginModal.headingMobile}>Register to SwipTory</div>
                    <div className={loginModal.inputFields}>
                        <div className={loginModal.inputDiv}>
                            <label className={loginModal.usernameMobile}>UserName</label>
                            <input className={loginModal.usernameInputMobile} type="name" name="username" placeholder='Enter username' value={formData.name} onChange={handleChange} autoComplete='off'></input>
                        </div>

                        <div className={loginModal.passwordDiv}>
                            <label className={loginModal.passwordMobile}>Password</label>
                            <input className={loginModal.passwordInputMobile} type={isPasswordVisible ? "text" : "password"} name="password" placeholder='Enter password' value={formData.password} onChange={handleChange} autoComplete='off' />
                            <EyeIcons
                                isPasswordVisible={isPasswordVisible}
                                togglePasswordVisibility={togglePasswordVisibility}
                            />
                        </div>
                        {showError && <div className={loginModal.invalidDetails}>{showError}</div>}
                    </div>
                    <div className={loginModal.loginButtonMobile} onClick={registerButton}>Register</div>
                </div>
            </div>}
        </>,
        document.getElementById('portal')
    );
}

export default RegisterModal;
