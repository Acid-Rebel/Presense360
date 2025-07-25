const CircularProgressBar = (props) => {
  const INTERNAL_SQ_SIZE = 100;
  const INTERNAL_STROKE_WIDTH = 8;

  const { percentage, color = 'black', sizeClass = 'w-20 h-20' } = props;

  const radius = (INTERNAL_SQ_SIZE - INTERNAL_STROKE_WIDTH) / 2;
  const viewBox = `0 0 ${INTERNAL_SQ_SIZE} ${INTERNAL_SQ_SIZE}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * (percentage || 0)) / 100;
  const statusMessage = `${percentage}%`;

  return (
    <svg className={sizeClass} viewBox={viewBox}>
      <circle
        className="fill-none stroke-gray-200"
        cx={INTERNAL_SQ_SIZE / 2}
        cy={INTERNAL_SQ_SIZE / 2}
        r={radius}
        strokeWidth={`${INTERNAL_STROKE_WIDTH}px`}
      />
      <circle
        className="fill-none transition-all delay-200 ease-in"
        cx={INTERNAL_SQ_SIZE / 2}
        cy={INTERNAL_SQ_SIZE / 2}
        r={radius}
        strokeLinecap="round"
        strokeWidth={`${INTERNAL_STROKE_WIDTH}px`}
        transform={`rotate(-90 ${INTERNAL_SQ_SIZE / 2} ${INTERNAL_SQ_SIZE / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
          stroke: color,
        }}
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fill="#172554"
        // UPDATED: Font size adjusted for smaller circles
        // text-xs (12px) for default/XS (48px circle)
        // sm:text-xs (12px) for SM (56px circle) - keeps it smaller for this size
        // md:text-sm (14px) for MD (64px circle)
        // lg:text-base (16px) for LG and up (80px circle)
        className="text-xs sm:text-xs md:text-sm lg:text-base font-semibold"
      >
        {statusMessage}
      </text>
    </svg>
  );
};

export default CircularProgressBar;