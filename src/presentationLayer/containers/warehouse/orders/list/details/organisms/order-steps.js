import React, { useEffect, useState } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { OrderDetailProducts } from "./order-detail-products";
import { ContractDetails } from "./contract-details";
import { InvoicePayment } from "./invoice-payment";
import { PowerOfAttorney } from "./power-of-attorney";
import { Invoice } from "./invoice";

export const OrderSteps = ({ orderDetailsData }) => {
  const [ activeTab, setActiveTab ] = useState(null);

  useEffect(() => {
    switch (orderDetailsData.status.code) {
      case "WAITING_FOR_CONTRACT_ATTACHMENT":
        setActiveTab({
          defaultStep: 0,
          currentStep: 0
        });
        break;
      case "CONTRACT_ATTACHED":
        setActiveTab({
          defaultStep: 1,
          currentStep: 1
        });
        break;
      case "CONTRACT_REJECTED":
        setActiveTab({
          defaultStep: 1,
          currentStep: 1
        });
        break;
      case "WAITING_FOR_INVOICE_PAYMENT_APPROVE":
        setActiveTab({
          defaultStep: 2,
          currentStep: 2
        });
        break;
      case "WAITING_FOR_FILLING_POWER_OF_ATTORNEY":
        setActiveTab({
          defaultStep: 3,
          currentStep: 3
        });
        break;
      case "WAITING_FOR_POWER_OF_ATTORNEY_APPROVE":
        setActiveTab({
          defaultStep: 3,
          currentStep: 3
        });
        break;
      case "WAITING_FOR_CONFIRM_PRODUCT_RECEIVE":
        setActiveTab({
          defaultStep: 3,
          currentStep: 3
        });
        break;
      case "XFILE_REJECTED":
      case "XFILE_AGENT_REJECTED":
      case "XFILE_CANCELLED":
      case "XFILE_DRAFT":
      case "XFILE_PENDING":
        setActiveTab({
          defaultStep: 4,
          currentStep: 4
        });
        break;
      case "XFILE_AGENT_ACCEPTED":
      case "XFILE_APPROVED":
        setActiveTab({
          defaultStep: 4,
          currentStep: 0
        });
        break;
      case "COMPLETED_AND_GOOD_RECEIVED":
        setActiveTab({
          defaultStep: 4,
          currentStep: 4
        });
        break;
      default:
        setActiveTab({
          defaultStep: 0,
          currentStep: 0
        });
    }
  }, [orderDetailsData]);

  const handleChange = (event, value) => {
    setActiveTab({
      defaultStep: activeTab.defaultStep,
      currentStep: value
    });
  };

  return (
    <>
      {activeTab &&
        <>
          <Tabs
            value={activeTab.currentStep}
            onChange={handleChange}
            variant="fullWidth"
            scrollButtons="auto"
            className="order-detail__tabs"
          >
            <Tab key={0} label={'Заказ'} />
            <Tab key={1} label={'Договор'} disabled={activeTab.defaultStep < 1} />
            <Tab key={2} label={'Счет на оплату'} disabled={activeTab.defaultStep < 2} />
            <Tab key={3} label={'Доверенность'} disabled={activeTab.defaultStep < 3} />
            <Tab key={4} label={'Счет фактура'} disabled={activeTab.defaultStep < 4} />
          </Tabs>
          {activeTab.currentStep === 0 &&
            <div className="order-detail__tabs__item" key={0}>
              <OrderDetailProducts orderDetailsData={orderDetailsData} />
            </div>
          }
          {activeTab.currentStep === 1 &&
            <div className="order-detail__tabs__item" key={1}>
              <ContractDetails orderId={orderDetailsData.id} />
            </div>
          }
          {activeTab.currentStep === 2 &&
            <div className="order-detail__tabs__item" key={2}>
              <InvoicePayment orderId={orderDetailsData.id} />
            </div>
          }
          {activeTab.currentStep === 3 &&
            <div className="order-detail__tabs__item" key={3}>
              <PowerOfAttorney orderDetailsData={orderDetailsData} />
            </div>
          }
          {activeTab.currentStep === 4 &&
            <div className="order-detail__tabs__item" key={4}>
              <Invoice orderId={orderDetailsData.id} />
            </div>
          }
        </>
      }
    </>
  )
};