// import { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../contexts/AuthContext';


// const DashboardHeader = () => {
//   const { user, logout } = useAuth();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close drop-down
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const getUserInitials = () => {
//     if (!user?.username) return 'U';
//     return user.username.charAt(0).toUpperCase();
//   };

//   const handleLogout = async () => {
//     await logout();
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo / Brand */}
//           <div className="flex items-center">
//             <h1 className="text-xl font-semibold text-black tracking-tight">
//               CGPA Analyzer
//             </h1>
//           </div>

//           {/* User Menu */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-3 focus:outline-none group"
//             >
//               {/* User Avatar */}
//               <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-medium text-sm transition-transform group-hover:scale-105">
//                 {getUserInitials()}
//               </div>
              
//               {/* Username (hidden on mobile) */}
//               <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
//                 {user?.username || 'User'}
//               </span>

//               {/* Dropdown Arrow */}
//               <svg
//                 className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
//                   isDropdownOpen ? 'rotate-180' : ''
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>

//             {/* Dropdown Menu */}
//             <AnimatePresence>
//               {isDropdownOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.2 }}
//                   className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
//                 >
//                   {/* User Info */}
//                   <div className="px-4 py-3 border-b border-gray-100">
//                     <p className="text-sm font-medium text-black">
//                       {user?.username || 'User'}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-0.5 truncate">
//                       {user?.email || 'user@example.com'}
//                     </p>
//                   </div>

//                   {/* Menu Items */}
//                   <div className="py-1">
//                     <button
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                       onClick={() => {
//                         setIsDropdownOpen(false);
//                         // Navigate to profile
//                       }}
//                     >
//                       Profile
//                     </button>
//                     <button
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                       onClick={() => {
//                         setIsDropdownOpen(false);
//                         // Navigate to settings
//                       }}
//                     >
//                       Settings
//                     </button>
//                   </div>

//                   {/* Logout */}
//                   <div className="border-t border-gray-100 py-1">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default DashboardHeader;
