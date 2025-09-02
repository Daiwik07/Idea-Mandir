import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ideas = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Categories from database
  const categories = ['All', 'Technology', 'Food', 'Education', 'Environment', 'Social', 'Health'];

  useEffect(() => {
    const loadIdeas = async () => {
      setIsLoading(true);
      try {
        // Fetch ideas from database
        let url = 'http://localhost:3000/get-ideas';
        if (selectedCategory !== 'All') {
          url = `http://localhost:3000/get-ideas/${selectedCategory}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch ideas');
        }
        
        const data = await response.json();
        
        if (data.success && data.ideas && data.ideas.length > 0) {
          setIdeas(data.ideas);
        } else {
          // If no ideas found in database, show empty state
          setIdeas([]);
          toast.info('No ideas found. Be the first to share your idea!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
          });
        }
      } catch (error) {
        console.error('Error loading ideas:', error);
        toast.error('Failed to load ideas', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Bounce,
        });
        // Set empty ideas array when there's an error
        setIdeas([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadIdeas();
  }, [selectedCategory]);

  // No need to filter ideas as we're fetching filtered data from API
  const filteredIdeas = ideas;

  // Function to handle card click and open modal
  const handleIdeaClick = (idea) => {
    setSelectedIdea(idea);
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Add keyboard listener for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

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
                Discover Young Entrepreneurs' Ideas
              </h1>
              <p className="text-gray-200 text-lg mt-2 max-w-2xl">
                Explore amazing business ideas created by young minds. Get inspired and connect with fellow kidspreneurs!
              </p>
            </div>
          </div>
          <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gray-100 transform rotate-2 scale-110"></div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-8 pt-6 pb-16 relative z-10">
          {/* Category filter */}
          <div className="mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <div className="inline-flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === category
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  } transition-colors font-medium text-sm`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

         
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredIdeas.length > 0 ? (
                filteredIdeas.map(idea => (
                  <div 
                    key={idea.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
                    onClick={() => handleIdeaClick(idea)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                          {idea.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{idea.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No ideas found</h3>
                  <p className="text-gray-600 text-center max-w-md mb-8">
                    There are no ideas in this category yet. Be the first to share your innovative business idea!
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Create New Idea
                  </button>
                </div>
              )}
            </div>

          {/* Return to dashboard */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Modal for idea details */}
      {showModal && selectedIdea && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="relative">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-800 rounded-full">
                  {selectedIdea.category}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-gray-900">{selectedIdea.title}</h2>
              
              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {selectedIdea.description}
                </p>
              </div>
              
              {/* Potential benefits */}
              <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Potential Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Develop entrepreneurial skills at a young age</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Learn business planning and execution</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Gain practical experience in problem-solving</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex space-x-2">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Report
                  </button>
                </div>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ideas;
