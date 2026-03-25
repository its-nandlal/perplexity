import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
    email: z.string().email("Please enter a valid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must be at most 50 characters"),
});

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        // reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const navigate = useNavigate()
    const { handleRegister } = useAuth()

    const { user, error, message } = useSelector(state => state.auth)

    if (user) {
        navigate(-1)
        toast.error("Invalied request you are logiden.")
    }

    const onSubmit = async (data) => {
        setApiError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            await handleRegister(data)
            if (error) return toast.error(error)
              navigate("/login")
              toast.success(message || "register successfully verify email.")
              return;
        } catch (error) {
            setApiError(
                error.response?.data?.message || "Registration failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a]">
            {/* Left Column - Visual */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-r border-[#1a1a1a]">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold text-white">Perplexity</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <blockquote className="text-2xl font-light text-gray-300 leading-relaxed">
                        "Success is not final, failure is not fatal: it is the courage to continue that counts."
                    </blockquote>
                    <p className="text-gray-500">— Winston Churchill</p>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>© 2024 Perplexity</span>
                    <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
                    <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold text-white">Perplexity</span>
                    </div>

                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
                        <p className="text-gray-400">Start your journey with us today</p>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#141414] border border-[#2a2a2a] rounded-lg text-gray-300 hover:bg-[#1a1a1a] hover:border-[#333333] transition-all">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#141414] border border-[#2a2a2a] rounded-lg text-gray-300 hover:bg-[#1a1a1a] hover:border-[#333333] transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            <span className="text-sm font-medium">GitHub</span>
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#2a2a2a]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#0a0a0a] text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {successMessage && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                {successMessage}
                            </div>
                        )}

                        {apiError && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {apiError}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="johndoe"
                                {...register("username")}
                                className={`w-full px-4 py-3 bg-[#141414] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.username
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-[#2a2a2a] focus:border-teal-500 hover:border-[#333333]"
                                    }`}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                {...register("email")}
                                className={`w-full px-4 py-3 bg-[#141414] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.email
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-[#2a2a2a] focus:border-teal-500 hover:border-[#333333]"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={`w-full px-4 py-3 bg-[#141414] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${errors.password
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-[#2a2a2a] focus:border-teal-500 hover:border-[#333333]"
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
                            Sign in
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="text-center text-xs text-gray-500">
                        By creating an account, you agree to our{" "}
                        <Link to="/terms" className="text-teal-400 hover:text-teal-300">Terms</Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="text-teal-400 hover:text-teal-300">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
