import Link from 'next/link'

export const runtime = 'edge';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 font-sans p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-2">404 - Not Found</h2>
                <p className="text-slate-500 font-medium mb-8">The page you are looking for does not exist or has been moved.</p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-200"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}
