const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`loading-spinner ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;