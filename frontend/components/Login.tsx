import React from 'react';
import { supabase } from '../services/supabaseClient';
import Button from './Button';

interface LoginProps {
    onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onCancel }) => {
    const handleGitHubLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                scopes: 'repo', // Request repo scope for private repos
                redirectTo: window.location.origin
            }
        });

        if (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-md w-full space-y-8 animate-fade-in-up">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to access your scan history and connect your GitHub repositories.</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl space-y-6">
                    <button
                        onClick={handleGitHubLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 font-semibold py-4 px-6 rounded-xl transition-all shadow-lg"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        Sign in with GitHub
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#0a0a0a] text-gray-500">Why GitHub?</span>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-400">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Scan your private and public repositories</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Save your scan history for future reference</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>No password to remember - secure OAuth login</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button variant="ghost" onClick={onCancel}>
                        ← Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login;
