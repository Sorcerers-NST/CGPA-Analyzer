import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!agreedToTerms) {
      alert('Please agree to the Terms and Privacy Policy');
      return;
    }
    
    // Add your signup logic here
    console.log('Signup attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center group">
              <span className="text-xl font-semibold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors">
                CGPA Calculator
              </span>
            </Link>
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Branding */}
            <div className="hidden lg:block space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                  Start your journey
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join thousands of students who track their academic success with our platform.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                  </div>
                  <div className="text-white">
                    <div className="font-semibold">10,000+ Students</div>
                    <div className="text-sm text-gray-300">Trust our platform</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <p className="text-gray-300 italic leading-relaxed">
                    "This calculator completely transformed how I track my grades. The visualizations are incredible!"
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></div>
                    <div className="text-white">
                      <div className="font-medium">Sarah Chen</div>
                      <div className="text-sm text-gray-400">Computer Science, MIT</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600 mt-1">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600 mt-1">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">Free</div>
                  <div className="text-sm text-gray-600 mt-1">Forever</div>
                </div>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 sm:p-12">
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center lg:text-left space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Create account
                    </h2>
                    <p className="text-gray-600">
                      Get started with your free account today
                    </p>
                  </div>

                  {/* Social Signup */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Google</span>
                    </button>
                    
                    <button
                      type="button"
                      className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">GitHub</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="name" 
                        className="block text-sm font-medium text-gray-900"
                      >
                        Full name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-gray-900"
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-900"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          required
                          minLength={6}
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400 pr-12 text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="confirmPassword" 
                        className="block text-sm font-medium text-gray-900"
                      >
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter your password"
                          required
                          minLength={6}
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400 pr-12 text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                        I agree to the{' '}
                        <a href="#" className="font-medium text-gray-900 hover:text-gray-600 transition-colors">
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="#" className="font-medium text-gray-900 hover:text-gray-600 transition-colors">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-medium hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Create account
                    </button>
                  </form>
                </div>
              </div>

              {/* Mobile Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6 lg:hidden">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
