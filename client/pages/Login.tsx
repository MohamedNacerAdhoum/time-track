import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/contexts/UserContext";
import { useToast } from "@/hooks/useToast";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loading, error, clearError, isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle error state changes
  useEffect(() => {
    if (error) {
      // Only show error if it's not already being handled by the login function
      if (!loading) {
        let errorTitle = "Login Failed";
        let errorMessage = error;

        // Map common error messages to more user-friendly ones
        if (error.includes("Unable to log in")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.includes("not found")) {
          errorMessage = "No account found with this email address. Please check your email or sign up for a new account.";
        } else if (error.includes("network")) {
          errorTitle = "Connection Error";
          errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
        } else if (error.includes("timeout")) {
          errorTitle = "Request Timeout";
          errorMessage = "The server is taking too long to respond. Please try again in a moment.";
        } else if (error.includes("400") || error.includes("Bad Request")) {
          errorMessage = "Invalid request. Please check your input and try again.";
        } else if (error.includes("500") || error.includes("Server Error")) {
          errorTitle = "Server Error";
          errorMessage = "Something went wrong on our end. Our team has been notified. Please try again later.";
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
          duration: 8000, // Longer duration for error messages
        });

        // Clear the error after showing it
        clearError();
      }
    }
  }, [error, loading, toast, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Show loading state
    const loadingToast = toast({
      title: "Signing in...",
      description: "Please wait while we log you in.",
      variant: "default",
      duration: 30000, // Long duration in case of slow network
    });

    try {
      // Call the login function from the auth store
      const user = await login(email, password);

      // Dismiss loading toast
      loadingToast.dismiss();

      if (user) {
        // Show success message
        toast({
          title: "Success!",
          description: `Welcome back, ${user.name || user.email}!`,
          variant: "default",
          duration: 3000,
        });
      }
      // Note: Navigation is handled by the isAuthenticated effect
    } catch (error) {
      // Dismiss loading toast
      loadingToast.dismiss();

      // Show error message if not already shown by the error effect
      if (!error) {
        toast({
          title: "Login Failed",
          description: "We encountered an issue while processing your request. Please check your connection and try again. If the problem persists, contact support.",
          variant: "destructive",
          duration: 8000,
        });
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 max-w-2xl">
        <div className="w-full max-w-md space-y-12">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-14 flex items-center justify-center">
              <svg
                width="50"
                height="60"
                viewBox="0 0 50 60"
                fill="none"
                className="text-blue-600"
              >
                <path
                  d="M5 5h10v50H5V5zm15 0h10v50H20V5zm15 0h10v50H35V5z"
                  fill="currentColor"
                />
                <path
                  d="M10 10h5v40h-5V10zm15 0h5v40h-5V10zm15 0h5v40h-5V10z"
                  fill="#63CDFA"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-normal text-[#1E2772]">Time Tracking</h1>
          </div>

          {/* Login Title */}
          <div>
            <h2 className="text-3xl font-bold text-[#0A0A0A]">Login</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-8">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[#0A0A0A] text-lg font-bold"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 px-4 text-xl border-[#CCDFFF] bg-[#F2FBFF] rounded-lg text-[#5F5F5F] font-medium"
                  placeholder="alex@gmail.com"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[#0A0A0A] text-lg font-bold"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 px-4 pr-14 text-xl border-[#CCDFFF] bg-[#F2FBFF] rounded-lg text-[#5F5F5F] font-medium"
                    placeholder="Password xxxx"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71839B]"
                  >
                    {showPassword ? (
                      <Eye className="w-7 h-7" />
                    ) : (
                      <EyeOff className="w-7 h-7" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div>
                <button
                  type="button"
                  className="text-[#77838F] text-base font-normal underline hover:text-[#5F5F5F] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-14 bg-[#63CDFA] hover:bg-[#4CB8E8] text-white text-xl font-bold rounded-xl shadow-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-[#B1E6FD] items-center justify-center p-8">
        <div className="max-w-lg">
          <img
            src="../assets/auth-page-image.png"
            alt="Time tracking illustration with clock, calendar and coins"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
