export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>

            <div className="bg-white rounded-lg border p-6 space-y- 4">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
