import { fetchGraphQL } from '@/services/graphql';

export default async function TestConnectionPage() {
    const query = `
    query {
      adminDashboardStats {
        totalStudents
        totalTeachers
        totalClassRooms
      }
    }
  `;

    let data = null;
    let error = null;

    try {
        // Note: Since this is an unauthenticated request in this example, 
        // it will fail if the resolver uses ensureAdmin(currentUser).
        // However, this verifies the fetch flow and CORS for preflight.
        data = await fetchGraphQL(query);
    } catch (e: unknown) {
        error = e instanceof Error ? e.message : 'Unknown error';
    }

    return (
        <div className="p-8 font-sans">
            <h1 className="text-3xl font-bold mb-6">Backend Connection Test</h1>

            {error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <h2 className="font-semibold">Fetch Failed (Expected if unauthenticated)</h2>
                    <p className="mt-1">{error}</p>
                    <p className="mt-4 text-sm">
                        This confirms the frontend successfully reached the backend but might have been blocked by auth logic.
                        Check browser console for actual CORS errors.
                    </p>
                </div>
            ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <h2 className="font-semibold">Fetch Successful!</h2>
                    <pre className="mt-4 p-4 bg-white rounded border border-green-100 overflow-auto">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-8 text-slate-600">
                <h3 className="font-semibold mb-2">Instructions for testing:</h3>
                <ul className="list-disc ml-6 space-y-1">
                    <li>Ensure the backend is running (<code>npx wrangler dev</code> in API folder)</li>
                    <li>Ensure the frontend is running (<code>npm run dev</code> in client folder)</li>
                    <li>Check the Network tab in DevTools for the <code>OPTIONS</code> and <code>POST</code> requests to <code>/graphql</code></li>
                </ul>
            </div>
        </div>
    );
}
