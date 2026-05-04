const Spinner = ({ size = 'md' }) => {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div
      className={`${sizeMap[size]} border-2 border-white/10 border-t-rose-500 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
