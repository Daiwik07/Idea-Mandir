import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [ideaData, setIdeaData] = useState({
    title: '',
    description: '',
    category: 'Technology'
  });
  

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          // Redirect to login if not logged in
          navigate('/signup', { state: { showLogin: true } });
          return;
        }
        
        const userResponse = await fetch('http://localhost:3000/get-user-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        const userData = await userResponse.json();
        if (userData.success) {
          setUserName(userData.name);
          localStorage.setItem('userName', userData.name);
        } else {
          const storedName = localStorage.getItem('userName');
          if (storedName) {
            setUserName(storedName);
          } else {
            navigate('/signup', { state: { showLogin: true } });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user data', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Bounce,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/');
    toast.success('Logged out successfully', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Here you would typically make an API call to change the password
    // For now, we'll just show a success message
    toast.success('Password changed successfully', {
      position: "top-right",
      autoClose: 3000,
    });
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleShareIdea = async (e) => {
    e.preventDefault();
    if (!ideaData.title || !ideaData.description || !ideaData.category) {
      toast.error('Please fill in all required fields', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error('You must be logged in to share an idea', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const response = await fetch('http://localhost:3000/create-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          description: ideaData.description,
          category: ideaData.category,
          email
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Your idea has been shared!', {
          position: "top-right",
          autoClose: 3000,
        });
        setIdeaData({
          title: '',
          description: '',
          category: 'Technology'
        });
      } else {
        toast.error(data.message || 'Failed to share idea', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error sharing idea:', error);
      toast.error('Failed to share your idea. Please try again later.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-black h-64 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-900 opacity-20"></div>
          <div className="max-w-7xl mx-auto px-8 h-full flex items-center relative z-10">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome back, <span className="text-gray-300">{userName || 'Young Entrepreneur'}</span>!
              </h1>
              <p className="text-gray-200 text-lg mt-2 max-w-2xl">
                Your journey as a young entrepreneur continues! Share your ideas and manage your profile.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gray-100 transform rotate-2 scale-110"></div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Profile Actions */}
            <div className="space-y-8">
              {/* User Profile Card */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gray-200 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{userName || 'Young Entrepreneur'}</h2>
                    <p className="text-gray-500">Kidspreneur Member</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setShowChangePassword(true)}
                    className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-4 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="font-medium">Change Password</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between bg-gray-800 hover:bg-black p-4 rounded-lg transition-colors text-white"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/ideas')}
                    className="w-full flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>View All Ideas</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate('/ai')}
                    className="w-full flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>AI Assistant</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Back to Home</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Share Idea */}
            <div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-6">Share Your Business Idea</h3>
                <p className="text-gray-600 mb-6">
                  Have a great business idea? Share it with the Kidspreneur community and get feedback from other young entrepreneurs!
                </p>
                <form onSubmit={handleShareIdea}>
                  <div className="mb-4">
                    <label htmlFor="idea-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Idea Title
                    </label>
                    <input
                      id="idea-title"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Name your business idea"
                      value={ideaData.title}
                      onChange={(e) => setIdeaData({...ideaData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="idea-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="idea-category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      value={ideaData.category}
                      onChange={(e) => setIdeaData({...ideaData, category: e.target.value})}
                      required
                    >
                      <option value="Technology">Technology</option>
                      <option value="Food">Food</option>
                      <option value="Education">Education</option>
                      <option value="Environment">Environment</option>
                      <option value="Social">Social</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="idea-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="idea-description"
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Describe your business idea in detail. What problem does it solve? Who is it for?"
                      value={ideaData.description}
                      onChange={(e) => setIdeaData({...ideaData, description: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Share Your Idea
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Change Your Password</h3>
                <button onClick={() => setShowChangePassword(false)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors focus:outline-none"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
