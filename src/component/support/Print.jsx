import React, { useRef, useEffect, useState } from "react";
import ReactToPrint from "react-to-print";

import { Content } from "./Content";
import productService from "../../service/productService";

const Print = (props) => {
  const componentRef = useRef();
  const [data, setdata] = useState([]);
  console.log(componentRef);
  const [listproduct, setListProduct] = useState([]);
  useEffect(() => {
    productService.getAllfirebase().then((res) => {
      setListProduct(Object.values(res.data).filter((e) => e != null));
    });
  }, []);
  const setData = () => {
    console.log(props.content, props.id);
    productService.getAllfirebase().then((res) => {
      setListProduct(Object.values(res.data).filter((e) => e != null));
    });
    setdata(props.content);
  };

  const handleBeforePrint = () => {
    console.log("dd");
    props.OnclickCash();
  };

  return (
    <div onClick={() => setData()}>
      <ReactToPrint
        trigger={() => <button className="btn btn-danger">Thanh Toán</button>}
        content={() => componentRef.current}
        onAfterPrint={() => handleBeforePrint()}
      />
      <div hidden>
        <Content
          ref={componentRef}
          content={props.content}
          listproduct={listproduct}
        />
      </div>
    </div>
  );
};
export default Print;
