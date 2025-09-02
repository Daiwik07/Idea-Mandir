import { useEffect, useRef, useState } from "react"
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const Signup = () => {
    const location = useLocation()
    const [isActive, setIsActive] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [showLoginPassword, setShowLoginPassword] = useState(false)
    const [showSignupPassword, setShowSignupPassword] = useState(false)
    const [otpValue, setOtpValue] = useState('')
    const [tempUserData, setTempUserData] = useState(null)
    const { register: registerLogin, handleSubmit: handleSubmitLogin } = useForm()
    const { register: registerSignup, handleSubmit: handleSubmitSignup } = useForm()
    const navigate = useNavigate()
    const ref = useRef()

    useEffect(() => {
        if (location.state?.showLogin !== undefined) {
            setIsActive(!location.state.showLogin)
        }
    }, [location.state])

    const handleRegisterClick = (e) => {
        e.preventDefault()
        setIsActive(true)
    }

    const handleLoginClick = (e) => {
        e.preventDefault()
        setIsActive(false)
    }
    
    const onSubmitLogin = async (data) => {
        try {
            console.log("Login attempt with:", data);
            const r = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    pass: data.pass
                }),
            });
            let res = await r.json()
            console.log("Login response:", res);
            if (res.message === "Exist") {
                localStorage.setItem('userEmail', data.email);
                
                try {
                    const userInfoResponse = await fetch(`http://localhost:3000/get-user-info`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: data.email }),
                    });
                    const userData = await userInfoResponse.json();
                    if (userData.success && userData.name) {
                        localStorage.setItem('userName', userData.name);
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
                
                toast.success('Login Successful', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else if (res.message === "No Exist") {
                toast.error('Invalid Credentials', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "dark",
transition: Bounce,
});
            }
        } catch (error) {
            console.error("Login error:", error)
        }
    }

    const handleOtpSubmit = async () => {
        try {
            const r = await fetch("http://localhost:3000/otpcheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    otp: otpValue,
                    email: tempUserData.email 
                })
            });
            const res = await r.json();
            
            if (res.message === "True") {
                console.log('Sending signup data:', tempUserData);
                const signupRes = await fetch("http://localhost:3000/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(tempUserData)
                });
                const signupData = await signupRes.json();
                
                if (signupData.message === "User created successfully") {
                    // Save email and name to localStorage
                    localStorage.setItem('userEmail', tempUserData.email);
                    localStorage.setItem('userName', tempUserData.name);
                    
                    toast.success('User Created Successfully');
                    setShowOtp(false);
                    setIsActive(false);
                    // Navigate to dashboard or home after successful signup
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    toast.error('User Registration Failed');
                }
            } else {
                toast.error('Invalid OTP');
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error('OTP Verification Failed');
        }
    };

    const onSubmit = async (data) => {
        try {
            console.log("Signup attempt with:", data);
            const userData = {
                name: data.name,
                email: data.email,
                pass: data.pass
            };
            
            const checkUser = await fetch("http://localhost:3000/check-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email })
            });
            const checkResult = await checkUser.json();
            
            if (checkResult.exists) {
                toast.error('User Already Exists');
                return;
            }

            setTempUserData(userData);
            const r = await fetch("http://localhost:3000/otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email })
            });
            let res = await r.json();
            if (res.otp) {
                setShowOtp(true);
                toast.info('Please enter OTP sent to your email', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "dark",
transition: Bounce,
});
            } else {
                toast.error('User Already Exist ', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "dark",
transition: Bounce,
});
            }
        } catch (error) {
            console.error("Signup error:", error)
        }
    }

    return (
        <div className="bg-white flex items-center justify-center h-screen relative">
            <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss={false}
draggable
pauseOnHover
theme="dark"
transition={Bounce}
/>
            <div className={`wrapper ${isActive ? 'active' : ''}`}>
                <span className="rotate-bg"></span>
                <span className="rotate-bg2"></span>

                <div className="form-box login">
                    <h2 className="title animation" style={{ "--i": 0, "--j": 21 }}>Login</h2>
                    <form onSubmit={handleSubmitLogin(onSubmitLogin)} ref={ref}>
                        <div className="input-box animation" style={{ "--i": 1, "--j": 22 }}>
                            <input 
                                type="email" 
                                {...registerLogin('email', { required: true })}
                            />
                            <label>Email</label>
                            <i className='bx bxs-user'></i>
                        </div>
                        <div className="input-box animation" style={{ "--i": 2, "--j": 23 }}>
                            <input 
                                type={showLoginPassword ? "text" : "password"}
                                {...registerLogin('pass', { required: true })}
                            />
                            <label>Password</label>
                            <i 
                                className={`bx ${showLoginPassword ? 'bxs-show' : 'bxs-hide'} absolute right-6 cursor-pointer`}
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                            ></i>
                        </div>
                        <button 
                            type="submit" 
                            className="btn animation" 
                            style={{ "--i": 3, "--j": 24 }}
                        >
                            Login
                        </button>
                        <div className="linkTxt animation" style={{ "--i": 4, "--j": 25 }}>
                            <p>Don't have an account? <a href="#" onClick={handleRegisterClick} className="register-link">Sign Up</a></p>
                        </div>
                    </form>
                </div>

                <div className="info-text login">
                    <h2 className="animation" style={{ "--i": 0, "--j": 20 }}>Welcome Back!</h2>
                </div>

                <div className="form-box register">
                    <h2 className="title animation" style={{ "--i": 17, "--j": 0 }}>Sign Up</h2>
                    <form onSubmit={handleSubmitSignup(onSubmit)} ref={ref}>
                        <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
                            <input 
                                type="text"
                                {...registerSignup('name', { required: true })}
                            />
                            <label>Username</label>
                            <i className='bx bxs-user'></i>
                        </div>
                        <div className="input-box animation" style={{ "--i": 19, "--j": 2 }}>
                            <input 
                                type="email"
                                {...registerSignup('email', { required: true })}
                            />
                            <label>Email</label>
                            <i className='bx bxs-envelope'></i>
                        </div>
                        <div className="input-box animation" style={{ "--i": 20, "--j": 3 }}>
                            <input 
                                type={showSignupPassword ? "text" : "password"}
                                {...registerSignup('pass', { required: true })}
                            />
                            <label>Password</label>
                            <i 
                                className={`bx ${showSignupPassword ? 'bxs-show' : 'bxs-hide'} absolute right-6 cursor-pointer`}
                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                            ></i>
                        </div>
                        <button 
                            type="submit" 
                            className="btn animation" 
                            style={{ "--i": 21, "--j": 4 }}
                        >
                            Sign Up
                        </button>
                        
                        <div className="linkTxt animation" style={{ "--i": 22, "--j": 5 }}>
                            <p>Already have an account? <a href="#" onClick={handleLoginClick} className="login-link">Login</a></p>
                        </div>
                    </form>
                </div>

                <div className="info-text register">
                    <h2 className="animation" style={{ "--i": 17, "--j": 0 }}>Welcome Back!</h2>
                </div>

                {showOtp && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-96 animation" style={{ "--i": 0, "--j": 0 }}>
                            <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={otpValue}
                                    onChange={(e) => setOtpValue(e.target.value)}
                                    className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500 outline-none"
                                    placeholder="Enter OTP"
                                    required
                                />
                            </div>
                            <button
                                onClick={handleOtpSubmit}
                                className="w-full bg-black text-white py-2 rounded-full hover:shadow-lg transition-shadow"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Signup
