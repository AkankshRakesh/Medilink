export function LoadingSpinner({ size = "md" }) {
    const sizeClasses = {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-3",
    }
  
    return (
      <div className="flex justify-center items-center">
        <div
          className={`${sizeClasses[size]} rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin`}
        />
      </div>
    )
  }
  
  