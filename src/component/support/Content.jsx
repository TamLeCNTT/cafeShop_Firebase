// Using a functional component, you must wrap it in React.forwardRef, and then forward the ref to
// the node you want to be the root of the print (usually the outer most node in the ComponentToPrint)
// https://reactjs.org/docs/refs-and-the-dom.html#refs-and-function-components
import React, { useRef, useEffect, useState } from "react";
import logo from "../../Asset/img/logo.png";
import "./content.scss";
import productService from "../../service/productService";

export const Content = React.forwardRef((props, ref) => {
  const [data, setdata] = useState([]);
  const [listproduct, setListProduct] = useState([]);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  let [tong, settong] = useState(0);
  useEffect(() => {
    setdata(props.content);

    productService.getAllfirebase().then((res) => {
      let tong = 0;
      props.content.map((item, index) => {
        let product = Object.values(res.data).filter(
          (e) => e != null && e.productID == item.productId
        )[0];
        if (product != null) {
          console.log("hll");
          tong += Number(product.price) * Number(item.soluong);
        }
      });
      settong(tong);
    });
  }, [props.content]);
  const getProductById = (id) => {
    // console.log(listproduct.filter(e=>e.productID==id)[0])

    return props.listproduct.filter((e) => e.productID == id)[0];
  };
  const getttime = () => {
    const date = new Date();
    const time = date.getHours() + ":" + date.getMinutes();
    return time;
  };
  function makeid(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  return (
    <div ref={ref} id="hoadon" className="to-print">
      <div className="container">
        <div className="header">
          <div className="img-logo">
            <img src={logo} />
          </div>
          <div className="company">
            <span className="header-title">Cafe công đoàn Hưng Thịnh</span>
            <span className="address">
              <span>ĐC: 41-43 Đường số 12, Khu dân cư 5A</span>
              <span>ĐT: 0845388889</span>
            </span>
          </div>
        </div>
        <br />
        <div className="bill-title">
          <div className="title">
            HÓA ĐƠN THANH TOÁN
            <br />
            -------oOo-------
          </div>

          <div className="bill-time">
            <div className="bill-time-left">
              <span className="day">
                Ngày:{" "}
                {data[0]
                  ? new Date(data[0].ngay).toLocaleDateString("en-GB")
                  : ""}{" "}
              </span>
              <span className="cashier">Thu ngân: Thu ngân 1</span>
              <span className="time-in">
                Giờ vào: {data[0] ? data[0].gio : ""}{" "}
              </span>
            </div>

            <div className="bill-time-right">
              <span className="bill-number">Số: {makeid(4)}</span>
              <span className="print-at">In lúc: {getttime()}</span>
              <span className="time-out">Giờ ra: {getttime()}</span>
            </div>
          </div>
        </div>
        <table className="bill-table" style={{ width: "98mm" }}>
          <tr>
            <th style={{ width: "270%" }}>Sản phẩm</th>
            <th>Giá </th>
            <th style={{ width: "50%" }}>SL</th>
            <th>Tổng </th>
          </tr>
          {data &&
            data.map((item, index) => {
              return (
                <tr>
                  <td style={{ width: "270%" }}>
                    {getProductById(item.productId)
                      ? getProductById(item.productId).name
                      : ""}
                  </td>
                  <td>
                    {getProductById(item.productId)
                      ? getProductById(item.productId).price
                      : ""}
                  </td>

                  <td style={{ width: "50%" }}>{item.soluong}</td>

                  <td>
                    {" "}
                    {getProductById(item.productId)
                      ? getProductById(item.productId).price * item.soluong
                      : ""}
                  </td>
                </tr>
              );
            })}
        </table>
        <footer className="footer">
          <div className="bill-total">
            <p>Tổng</p>
            <p>{VND.format(tong)} </p>
          </div>

          <div className="footer-bottom">
            <p>Cám ơn Quý khách. Hẹn gặp lại!</p>
          </div>
        </footer>
      </div>
    </div>
  );
});
{
  /* <table className="TableData">
            <tr>
             
                <th>Mặt hàng</th>
            <th>Số lượng</th>
              <th>Đơn giá</th>
            
              <th>Thành tiền</th>
                    {/* </tr>
                    
                   
                        {
                         data&&  data.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.productId}</td>
                                        <td>
                                            {item.soluong}
                                        </td>
                                        <td>30000</td>
                                        <td> {item.soluong *30000}</td>
                                    </tr>
                                    
                                )
                            })
                    }
                     <tr> }
                    
              <td colspan="3" className="tong">Tổng cộng</td>
              <td className="cotSo">12222</td>
            </tr>
          </table> */
}

{
  /* Feature Bill
            Thanh That
         */
}
