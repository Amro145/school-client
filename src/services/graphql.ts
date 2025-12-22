export const fetchGraphQL = async (query: string, variables = {}, token?: string) => {
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://schoolapi.amroaltayeb14.workers.dev/graphql';

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables,
            }),
            // Using cache: 'no-store' for fresh data (Next.js 15 default is often 'auto' but explicit is better for dynamic data)
            cache: 'no-store',
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error(result.errors[0]?.message || 'GraphQL Request Failed');
        }

        return result.data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
