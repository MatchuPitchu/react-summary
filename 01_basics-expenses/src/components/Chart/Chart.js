import ChartBar from './ChartBar';
import './Chart.css';

const Chart = ({ dataPoints }) => {
  // transform dataPoints arr of obj into arr of numbers with map method
  const dataPointValues = dataPoints.map((dataPoint) => dataPoint.value);
  // find maxValue of all data points in chart;
  // use spread operator to pull out all arr elements and add them at standalone arguments to max method
  const totalMax = Math.max(...dataPointValues);

  return (
    <div className='chart'>
      {dataPoints.map((dataPoint) => (
        // value should be plotted in relation to the maxValue of entire chart
        <ChartBar
          key={dataPoint.label} // use label as unique identifier
          value={dataPoint.value}
          maxValue={totalMax}
          label={dataPoint.label}
        />
      ))}
    </div>
  );
};

export default Chart;
