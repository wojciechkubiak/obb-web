import React, {useEffect} from "react";
import Chart from "chart.js";

const GlobalChart = props => {
  const ref = React.createRef();

  useEffect(() => {  
    const _ref = ref.current.getContext("2d");
    new Chart(_ref, {
      type: props.mode,
      data: {
        labels: Object.values(props.dates),
        datasets: [
          {
            label: props.chartLabel,
            data: Object.values(props.data),       
            borderColor: "#30d158",
            pointBackgroundColor: "rgba(255,255,255, 0.87)",
            pointBorderColor: "#424242",
            hoverBackgroundColor: "#30d158"
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
              ticks: {
                  suggestedMin: props.miny,
                  suggestedMax: props.maxy,
                  stepSize: props.step
              }
          }]
      }
      }
    });
  }, [ref, props.chartLabel, props.data, props.dates, props.mode, props.miny, props.maxy, props.reload]);


  return (
        <div className={props.chartClass}>
          <canvas ref={ref} />
        </div>
    )
}

export default GlobalChart;