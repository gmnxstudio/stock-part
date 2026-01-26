export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>

            <div className="bg-white rounded-lg border p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <div className="h-12 bg-gray-100"></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 border-t bg-gray-50 animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
