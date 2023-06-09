import React, { useEffect, useRef, useState } from "react";
import { TabPanel, TabView } from "primereact/tabview";
import OrderPage from "./OrderPage";
import OrderPendingPage from "./OrderPendingPage";
import OrderVerifyPage from "./OrderVerifyPage";
import OrderRejectPage from "./OrderRejectPage";
import OrderCompletePage from "./OrderCompletePage";
import OrderShippingPage from "./OrderShippingPage";
import OrderUnreceivedPage from "./OrderUnreceivedPage";


export default function OrderManager(props, ref) {
    const [activeTab, setActiveTab] = useState({ index: 0, code: null });
    const [changeTabData, setChangeTabData] = useState(false);
    const refTabs = useRef(null);

    useEffect(() => {
        changeTab(0, buildTabs());
    }, []);

    const modules = ['all_order', 'order_pending', 'verify', 'delivery', 'failed_delivery', 'complete', 'reject'];
    const modulesDefinition = {
        all_order: {
            title: 'Tất cả',
            renderer: () => <OrderPage setChangeTabData={setChangeTabData}></OrderPage>,
        },
        order_pending: {
            title: 'Chờ xác nhận',
            renderer: () => <OrderPendingPage setChangeTabData={setChangeTabData}></OrderPendingPage>,
        },
        verify: {
            title: 'Xác nhận',
            renderer: () => <OrderVerifyPage setChangeTabData={setChangeTabData}></OrderVerifyPage>,
        },
        delivery: {
            title: 'Giao hàng',
            renderer: () => <OrderShippingPage setChangeTabData={setChangeTabData}></OrderShippingPage>,
        },
        failed_delivery: {
            title: 'Giao hàng thất bại',
            renderer: () => <OrderUnreceivedPage setChangeTabData={setChangeTabData}></OrderUnreceivedPage>,
        },
        complete: {
            title: 'Hoàn tất',
            renderer: () => <OrderCompletePage setChangeTabData={setChangeTabData}></OrderCompletePage>,
        },
        reject: {
            title: 'Từ chối',
            renderer: () => <OrderRejectPage setChangeTabData={setChangeTabData}></OrderRejectPage>,
        },
    };

    const changeTab = (index, tabs) => {
        if (changeTabData) {
            setChangeTabData(false);
            setActiveTab({ index: index, code: tabs[index].code });
        } else {
            setChangeTabData(false);
            setActiveTab({ index: index, code: tabs[index].code });
        }
    };

    const renderTabContent = (_module) => {
        if (modulesDefinition && modulesDefinition[_module] && modulesDefinition[_module].renderer && typeof modulesDefinition[_module].renderer === "function") {
            return modulesDefinition[_module].renderer();
        } else {
            return <></>;
        }
    };

    const buildTabs = () => {
        if (!refTabs.current) {
            let tabs = refTabs.current || [];
            modules.forEach((_module) => {
                if (_module) {
                    switch (_module) {
                        case "personal_info":
                            tabs.push({ label: "thông tin cá nhân", code: _module });
                            break;
                        default:
                            if (modulesDefinition && modulesDefinition[_module]) {
                                tabs.push({ label: modulesDefinition[_module].title || "...", code: _module });
                            }
                            break;
                    }
                }
            });
            refTabs.current = tabs;
        }
        return refTabs.current;
    };

    const render = () => {
        if (modules.length > 0) {
            let tabs = buildTabs();
            return (
                <>
                    <div className="pt-2 px-2">
                        <TabView
                            scrollable
                            onTabChange={(e) => changeTab(e.index, tabs)}
                            activeIndex={activeTab.index}
                            className="tabview-without-content"
                        >
                            {tabs.map((tab, index) => (
                                <TabPanel key={index} header={tab.label}></TabPanel>
                            ))}
                        </TabView>
                    </div>
                    {renderTabContent(activeTab.code)}
                </>
            );
        } else {
            return <></>;
        }
    };

    return render();
}
