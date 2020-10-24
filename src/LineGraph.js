import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    diplay: false,
                },
                ticks: {
                    //Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}

const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;

    // to get the number of new cases
    for(let date in data.cases) {
        if(lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};

function LineGraph({ casesType, ...props }) {
    const [data, setData] = useState({});

    //url here to fetch the data eg for 120 is
    //"https://disease.sh/v3/covid-19/historical/all?lastdays=120"

    useEffect(() => {
        // in other to using fetch inside an useEffect
        const fetchData = async () => {
            //making a call
           await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then((response)  => response.json())
            .then((data) => {
            console.log(data);
            const chartData = buildChartData(data, casesType);
            setData(chartData);
            console.log(chartData);
            });
        };

        fetchData();
        
    }, [casesType]);



    return (
        <div className={props.className}>
            {/* there's a time there's no data, so we have to protect it*/}
            {/* this data? is optional chaining it check if data exist */}
            {data?.length > 0 && (
                
                <Line 
                    options={options}
                    data= {{
                        datasets: [
                            {
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            data: data
                            },
                        ]
                    }} 
                />
            )}
        </div>
    )
}

export default LineGraph
