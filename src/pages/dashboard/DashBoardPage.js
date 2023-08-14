import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { listDashboard, orderStatus, revenueWeek } from '../../api/dashboard';

const DashBoardPage = () => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [revenueByMonth, setRevenueByMonth] = useState(null);
    const [orderStatusChart, setOrderStatusChart] = useState(null)

    useEffect(() => {
        searchAll();
    }, []);
    const searchAll = () => {
        setLoading(true);
        listDashboard().then((res) => {
            const _data = res?.data.data
            setDashboard(_data);
            setLoading(false);
        });
        revenueWeek().then((res) => {
            const _data = res?.data.data
            console.log(_data, 'Week');
            setRevenueByMonth(_data);
            setLoading(false);
        });
        orderStatus().then((res) => {
            const _data = res?.data.data
            setOrderStatusChart(_data)
            setLoading(false);
        });
    };
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
        labels: orderStatusChart ? Object.keys(orderStatusChart) : [],
        datasets: [
            {
                data: orderStatusChart ? Object.values(orderStatusChart) : []
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
    const dataChartBar = {
        labels: revenueByMonth ? revenueByMonth.map(item => item.week) : [],
        datasets: [
            {
                label: 'Week',
                data: revenueByMonth ? revenueByMonth.map(item => item.revenue) : [],
            }
        ]
    };
    return (
        <div className='my-6'>
            <div className="flex justify-content-between mx-6 mb-5">
                <div className="col-3">
                    <Card className='text-center bg-cyan-50' title="Tổng số đơn hàng" >
                        <p className="m-0 text-center font-bold text-2xl" >
                            {dashboard?.totalOrder}
                        </p>
                    </Card>
                </div>
                <div className="col-3">
                    <Card className='text-center bg-cyan-50' title="Tổng số sản phẩm đã bán" >
                        <p className="m-0 text-center font-bold text-2xl" >
                            {dashboard?.totalProduct}
                        </p>
                    </Card>
                </div>
                <div className="col-3">
                    <Card className='text-center bg-cyan-50' title="Doanh thu theo ngày" >
                        <p className="m-0 text-center font-bold text-2xl" >
                            {dashboard?.totalRevenueByDay?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                        </p>
                    </Card>
                </div>
                <div className="col-3">
                    <Card className='text-center bg-cyan-50' title="Doanh thu theo tháng" >
                        <p className="m-0 text-center font-bold text-2xl" >
                            {dashboard?.totalRevenueByMonth?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                        </p>
                    </Card>
                </div>
            </div>
            <div className="grid crud-demo mx-6 mb-8">
                <div className="col-8">
                    <div className="card">
                        <Card className='text-center' title="Doanh thu theo tuần">
                            <Chart type="bar" data={dataChartBar} />
                        </Card>

                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <Card className='text-center' title='Số lượng đơn hàng theo trạng thái'>
                            <Chart type="pie" data={data} />
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default DashBoardPage