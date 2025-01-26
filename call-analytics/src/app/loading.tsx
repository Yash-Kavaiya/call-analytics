// app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }