"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Form, FormProps, Input, message, Modal } from "antd";
import axios from "axios";
import { api } from "@/auth";

type FieldType = {
  id?: string;
  storeName?: string;
  countryCode?: string;
  storeDomain?: string;
  accessToken?: string;
  admin?: string;
};

const SelectStore = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const [stores, setStores] = useState<FieldType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    setIsLoading(true);
    const res = await api.post("/addStore", values);
    console.log(res, "res");
    if (res.data.code !== 0) {
      messageApi.open({
        type: "error",
        content: res.data.message || "Creation failed",
      });
    } else {
      messageApi.open({
        type: "success",
        content: "Created successfully",
      });
      setShowAddModal(false);
      fetchData();
    }
    setIsLoading(false);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const fetchData = async () => {
    const res = await api.get("/getStores");

    if (res.data.code === 0) {
      setStores(res.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}

      <div className="flex flex-col items-center h-full">
        <div className="mb-[35px] text-[30px] font-bold mt-[10%]">
          Select a store
        </div>
        <div className="flex">
          {stores.map((item) => {
            return (
              <Card
                key={item.id}
                className="w-[260px] h-[180px] mr-[15px]! flex justify-center items-center text-2xl!"
                hoverable
              >
                {item.storeName}
              </Card>
            );
          })}
          <Card
            className="w-[260px] h-[180px] flex justify-center items-center cursor-pointer text-2xl!"
            onClick={async () => {
              setShowAddModal(true);
            }}
          >
            + Add a store
          </Card>
        </div>
      </div>

      <Modal
        title="Add a store"
        closable={{ "aria-label": "Custom Close Button" }}
        open={showAddModal}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setShowAddModal(false)}
        okButtonProps={{ loading: isLoading }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="StoreName"
            name="storeName"
            rules={[
              { required: true, message: "Please input your storeName!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="CountryCode"
            name="countryCode"
            rules={[
              { required: true, message: "Please input your CountryCode!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="StoreDomain"
            name="storeDomain"
            rules={[
              { required: true, message: "Please input your StoreDomain!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="AccessToken"
            name="accessToken"
            rules={[
              { required: true, message: "Please input your AccessToken!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Admin"
            name="admin"
            rules={[{ required: true, message: "Please input your Admin!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SelectStore;
