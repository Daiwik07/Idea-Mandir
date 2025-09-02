import gsap from 'gsap';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  const isDarkMode = ['/home', '/feedback'].includes(location.pathname);

  useEffect(() => {
    const checkLoginStatus = () => {
      const email = localStorage.getItem('userEmail');
      console.log("Current email in localStorage:", email);
      if (email) {
        setIsLoggedIn(true);
        const storedName = localStorage.getItem('userName');
        console.log("Stored name in localStorage:", storedName);
        if (storedName) {
          setUserName(storedName);
        } else {
          fetchUserName(email);
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };

    const fetchUserName = async (email) => {
      try {
        console.log("Fetching user name for email:", email);
        const response = await fetch(`http://localhost:3000/get-user-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        console.log("User info response:", data);
        if (data.success && data.name) {
          setUserName(data.name);
          localStorage.setItem('userName', data.name);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    checkLoginStatus();
    
    // GSAP animations
    gsap.fromTo("#navbar", 
      { 
        y: -100, 
        opacity: 0 
      }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        ease: 'power3.out',
        delay: 0.5
      }
    );

    // GSAP animations for the rest of the elements
    gsap.fromTo("#logo", 
      { 
        scale: 0, 
        rotation: -180 
      }, 
      { 
        scale: 1, 
        rotation: 0, 
        duration: 1, 
        ease: 'back.out(1.7)',
        delay: 1
      }
    );

    gsap.fromTo(".nav-item", 
      { 
        y: -50, 
        opacity: 0 
      }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power2.out',
        delay: 1.2,
        stagger: 0.1
      }
    );

    gsap.fromTo(".nav-button", 
      { 
        scale: 0, 
        opacity: 0 
      }, 
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.6, 
        ease: 'back.out(1.7)',
        delay: 1.5,
        stagger: 0.1
      }
    );
  }, [location.pathname]);

  return (
    <div className='absolute w-full z-50'>
      <header id='navbar' className={`w-full ${isDarkMode ? 'bg-black border-b border-gray-800' : 'bg-white border-b border-gray-200'} shadow-lg`}>
        <nav className='max-w-7xl mx-auto flex items-center justify-between px-8 h-20'>
          <div className='flex items-center gap-4'>
            
            <div className='nav-item'>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Idea Mandir
              </h1>
            </div>
          </div>

          <ul className={`flex items-center gap-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
            <li className='nav-item'>
              <Link to='/home' className={`relative ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-all duration-300 group`}>
                Home
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} group-hover:w-full transition-all duration-300`}></span>
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/feedback' className={`relative ${isDarkMode ? 'hover:text-green-400' : 'hover:text-green-600'} transition-all duration-300 group`}>
                Feedback
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkMode ? 'bg-green-400' : 'bg-green-600'} group-hover:w-full transition-all duration-300`}></span>
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/ai' className={`relative ${isDarkMode ? 'hover:text-yellow-400' : 'hover:text-yellow-600'} transition-all duration-300 group`}>
                AI Assistant
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkMode ? 'bg-yellow-400' : 'bg-yellow-600'} group-hover:w-full transition-all duration-300`}></span>
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/ideas' className={`relative ${isDarkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'} transition-all duration-300 group`}>
                Ideas
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'} group-hover:w-full transition-all duration-300`}></span>
              </Link>
            </li>
          </ul>

          <div className='flex items-center gap-4'>
            {isLoggedIn ? (
              <div className="relative group">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className='nav-button flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                >
                  <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-white text-blue-600'} flex items-center justify-center font-bold`}>
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>{userName || 'User'}</span>
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/signup', { state: { showLogin: true } })} 
                  className={`nav-button px-6 py-2.5 rounded-xl ${
                    isDarkMode 
                      ? 'border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white' 
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  } text-sm font-medium transition-all duration-300`}
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup', { state: { showLogin: false } })} 
                  className='nav-button px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Navbar
