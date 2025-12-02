const Skeleton = ({
  className = '',
  variant = 'text',
  width,
  height
}) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    button: 'h-10 rounded-lg',
    card: 'h-32 rounded-xl',
    circle: 'rounded-full'
  };

  const style = {
    ...(width && { width }),
    ...(height && { height })
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 space-y-4">
    <Skeleton variant="title" className="w-1/3" />
    <Skeleton variant="text" className="w-full" />
    <Skeleton variant="text" className="w-2/3" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton variant="circle" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
