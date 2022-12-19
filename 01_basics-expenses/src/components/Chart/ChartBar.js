import './ChartBar.css';

const ChartBar = ({ value, maxValue, label }) => {
  let barFillHeight = '0%';
  if (maxValue > 0) {
    // calculate percentage how bar should be filled with rounding to nearest integer
    barFillHeight = Math.round((value / maxValue) * 100) + '%';
  }

  return (
    <div className='chart-bar'>
      <div className='chart-bar__inner'>
        <div
          className='chart-bar__fill'
          style={{ height: barFillHeight }}
        ></div>
      </div>
      <div className='chart-bar__label'>{label}</div>
    </div>
  );
};

export default ChartBar;
