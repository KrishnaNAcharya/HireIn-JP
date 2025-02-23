import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Add this import
import { db } from '../firebase'; // Add this import
import { FaBars, FaTimes } from 'react-icons/fa'; // Add this import

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const contactUsRef = useRef(null);
  const [pageState, setPageState] = useState("Sign in")
  const auth = getAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add this state
  const [userType, setUserType] = useState(null); // Add new state for user role

  useEffect(()=>{
    onAuthStateChanged(auth, async (user)=>{
     if(user){
       setPageState("Profile");
       // Get user role from Firestore
       const userRef = doc(db, "users", user.uid);
       const userSnap = await getDoc(userRef);
       if (userSnap.exists()) {
         setUserType(userSnap.data().accountType);
       }
     }
     else{
       setPageState("Sign In");
       setUserType(null);
     } 
    })
  }, [auth])

  const handleSearch = async (event) => {
    setSearchQuery(event.target.value);
  };

  const handleContactClick = () => {
  // Navigate to the home page
  navigate('/');

  // After the navigation is complete, scroll to the contact section
  const handleScroll = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Wait for the next render cycle before trying to scroll
  setTimeout(handleScroll, 0);
};
  const handleSubmitSearch = async (event) => {
    event.preventDefault();
    // Always navigate to find-jobs, even with empty query
    navigate('/find-jobs', { 
      state: { 
        searchQuery: searchQuery.toLowerCase().trim()
      }
    });
  };

  const pathMatchRoute = (route) => location.pathname === route;

  useEffect(() => {
    if (location.pathname === '/contact') {
      contactUsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname]);

  const handleHomeClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (action) => {
    setIsMenuOpen(false); // Close menu
    action(); // Execute the passed action (navigation or scroll)
  };

  return (
    <div className="bg-black/80 backdrop-filter backdrop-blur-lg sticky top-0 z-40 shadow-lg">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto relative">
        {/* Logo */}
        <div 
          className="flex justify-between items-center text-white text-2xl md:text-3xl cursor-pointer" 
          onClick={handleHomeClick}
        >
          HireIn
        </div>

        {/* Search Bar - Hide on mobile */}
        <div className="hidden md:block w-full md:w-[67%] lg:w-[40%] lg:ml-20 pt-4 pb-4">
          <form onSubmit={handleSubmitSearch} className="w-full">
            <input
              type="text"
              id="search"
              placeholder="Search Opportunities..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-full text-x1 text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out"
            />
          </form>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Navigation Menu */}
        <nav className={`
          ${isMenuOpen ? 'flex' : 'hidden'} 
          md:flex absolute md:relative 
          top-full right-0 
          md:top-auto md:right-auto 
          flex-col md:flex-row 
          w-full md:w-auto 
          bg-black md:bg-transparent 
          mt-2 md:mt-0
          p-4 md:p-0
          space-y-4 md:space-y-0
          md:items-center
          rounded-lg
          shadow-lg md:shadow-none
        `}>
          {/* Search Bar - Show only on mobile */}
          <div className="md:hidden w-full mb-4">
            <form onSubmit={handleSubmitSearch}>
              <input
                type="text"
                placeholder="Search Opportunities..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 rounded-full text-gray-700 bg-white border border-gray-300"
              />
            </form>
          </div>

          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 lg:space-x-10">
            <li
              className={`rounded-box rounded-full p-3 text-center cursor-pointer bg-black hover:bg-purple-400 text-sm font-semibold text-white 
                ${pathMatchRoute("/") ? "text-purple-300 shadow-[0_0_20px_purple]" : ""}`}
              onClick={() => handleMenuItemClick(handleHomeClick)}
            >
              Home
            </li>
            <li
              className={`rounded-box rounded-full p-3 text-center cursor-pointer bg-black hover:bg-purple-400 text-sm font-semibold text-white 
                text-purple-300 shadow-[0_0_20px_purple]`}
              onClick={() => handleMenuItemClick(handleContactClick)}
            >
              Contact
            </li>
            {/* Only show Upload Job for recruiters */}
            {userType === 'recruiter' && (
              <li
                className="rounded-box rounded-full p-4 cursor-pointer bg-black hover:bg-purple-400 py-3 text-sm font-semibold text-white"
                onClick={() => handleMenuItemClick(() => navigate("/upload-job"))}
              >
                Upload Job
              </li>
            )}
            <li
              className={`rounded-box rounded-full p-3 text-center cursor-pointer bg-black hover:bg-purple-400 text-sm font-semibold text-white 
                ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) ? "text-purple-300 shadow-[0_0_20px_purple]" : ""}`}
              onClick={() => handleMenuItemClick(() => navigate("/profile"))}
            >
              {pageState}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
