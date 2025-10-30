const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div 
        className={`loading-spinner ${sizeClasses[size]}`}
      ></div>
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;