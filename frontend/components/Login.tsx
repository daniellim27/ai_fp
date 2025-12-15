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
        <div className="min-h-screen flex items-center px-6 md:px-12 relative overflow-hidden bg-[#050505]">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <div className="space-y-8 animate-fade-in-up">
                    <Button variant="ghost" onClick={onCancel} className="pl-0 hover:bg-transparent hover:text-white text-gray-500 mb-4">
                        ← Back to Home
                    </Button>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] text-white">
                        Access your <br />
                        <span className="text-gray-500">repositories.</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-light">
                        Sign in with GitHub to scan your private repositories and save your vulnerability scan history.
                    </p>

                    <div className="pt-4">
                        <button
                            onClick={handleGitHubLogin}
                            className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 font-semibold rounded-lg transition-all flex items-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 text-sm text-gray-500 font-mono pt-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Read-only access to code</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Secure OAuth authentication</span>
                        </div>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="hidden lg:block relative h-full min-h-[400px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/5"></div>
                    <div className="relative z-10 text-center space-y-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white">GitHub Integration</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Seamlessly connect your workflow and scan repositories with one click.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
