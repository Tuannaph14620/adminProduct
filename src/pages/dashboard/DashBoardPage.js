import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'primereact/chart';

const DashBoardPage = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <>
            <div className="flex justify-content-between mx-8 mb-8">
                <div className="col-5">
                    <Chart type="bar" data={chartData} options={chartOptions} />
                </div>
                <div className="col-5">
                    <Chart type="pie" data={chartData} options={chartOptions} />
                </div>
            </div>
            <div className="grid crud-demo">
                <div className="col-4">
                    <div className="card">
                        <Chart type="line" data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <Chart type="doughnut" data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <Chart type="polarArea" data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </>
    )

}

export default DashBoardPage