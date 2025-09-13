export const dynamic = 'force-dynamic'

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">500 - Server Error</h1>
      <p className="text-gray-600">Something went wrong on our end. Please try again later.</p>
    </div>
  );
}
