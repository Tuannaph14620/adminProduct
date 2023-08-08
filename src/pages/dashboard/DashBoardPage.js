import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'primereact/chart';

const DashBoardPage = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    tension: 0.4,
                    borderColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderDash: [5, 5],
                    tension: 0.4,
                    borderColor: documentStyle.getPropertyValue('--teal-500')
                },
                {
                    label: 'Third Dataset',
                    data: [12, 51, 62, 33, 21, 62, 45],
                    fill: true,
                    borderColor: documentStyle.getPropertyValue('--orange-500'),
                    tension: 0.4,
                    backgroundColor: 'rgba(255,167,38,0.2)'
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
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