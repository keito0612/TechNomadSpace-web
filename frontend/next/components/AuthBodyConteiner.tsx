interface AuthBodyConteinerProps {
    children: React.ReactNode
}


const AuthBodyConteiner = ({ children }: AuthBodyConteinerProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-900 rounded-2xl shadow-lg p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthBodyConteiner;