import React, { useState, useEffect } from "react";

import { Modal } from "react-bootstrap";
import Header from "./layout/Header";
import { toast } from "react-toastify";
import OderFireBaseService from "../service/OderFireBaseService";
import { Typeahead } from "react-bootstrap-typeahead";

import { connect } from "react-redux";
import productService from "../service/productService";
import cashService from "../service/cashService";
import Print from "./support/Print";
import { useNavigate } from "react-router-dom";
const Home = (props) => {
  // const sockets = socketClient("http://192.168.1.39:3001");
  let flag = 1;
  const [show, setshow] = useState(false);
  const [message, setMessage] = useState(0);
  const [content, setContent] = useState([]);
  const [listcash, setlistcash] = useState([]);
  const [table, settable] = useState("");
  const [listOdering, setlistOdering] = useState([]);
  const [listtt, setlisttt] = useState([]);
  const [listshow, setlistshow] = useState([]);
  const [listoder, setlistoder] = useState([[]]);
  const [singleSelections, setSingleSelections] = useState([]);
  const [options, setopt] = useState([]);
  const [sumCash, setSumcash] = useState(0);
  const [tongtiens, settongtiens] = useState(0);
  const [note, setnote] = useState("");
  const [infirebase, setinfirebaese] = useState(false);
  let current = new Date();
  let navitive = useNavigate();
  const [id, setid] = useState();
  let date = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;
  const users = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  useEffect(() => {
    if (users)
      setTimeout(() => {
        sessionStorage.clear();
        props.logout();
        navitive("/");
        toast.info("Tài khoản đã hết hạn");
      }, 30000);
    let listshows = [];
    productService.getAllfirebase().then((res) => {
      setopt(Object.values(res.data).filter((item) => item !== null));
    });
    OderFireBaseService.getAll().then((res) => {
      console.log(res.data);
      let newarry = [];
      if (res.data)
        Object.values(res.data)
          .filter((item) => item !== null)
          .map((item, index) => {
            console.log(item);
            newarry.push(...item.data);
          });
      let data = [];
      for (let i = 0; i <= 16; i++) {
        if (i != 0) {
          data = newarry
            .filter((item) => item.soban == i)
            .sort((a, b) => a.trangthai - b.trangthai);

          let tam = {
            trangthai: data[0] ? data[0].trangthai : 0,
            mes: data,
          };
          listshows.push(tam);
        } else {
          listshows.push({});
        }
      }
      console.log(listshows);
      setlistshow([...listshows]);
    });
  }, []);
  const generateRandomString = () => {
    const length = 10;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }

    return result;
  };
  const getNoteByNumberTable = (e) => {};

  const changeNote = (e) => {};
  const changeProduct = (e) => {
    let listOderings = listOdering;
    let index = listOderings.findIndex(
      (item) => item.product.productID == e[0].productID
    );

    if (index == -1) {
      let product = { product: e[0], soluong: 1 };
      listOderings.push(product);
    } else listOderings[index].soluong += 1;

    setlistOdering([...listOderings]);
    let tong = 0;
    listOderings.map((item, index) => {
      tong += item.product.price * item.soluong;
    });
    settongtiens(tong);
  };
  const SelectTable = (e) => {
    setshow(true);
    settable(e);
    setlistOdering([]);
    let list = listoder;
    let listDaoder = [],
      listDaoders = [];

    OderFireBaseService.getbyId(e).then((res) => {
      if (res.data) {
        let data = Object.values(res.data)[0];
        console.log(Object.values(res.data), data);
        listDaoder =
          data.filter((item) => item.trangthai == 1).length > 0
            ? data.filter((item) => item.trangthai == 1)
            : data.filter((item) => item.trangthai == 2);
        setContent(listDaoder);
        listDaoders = data.filter((item) => item.trangthai == 3);
        setlistcash(listDaoders);
        setSumcash(
          data.reduce(
            (a, v) => (a = a + v.soluong * findproduct(v.productId).price),
            0
          )
        );
      } else {
        setContent([]);
        setlistcash([]);
        setSumcash(0);
      }
    });
  };
  const changesoluong = (e, index, trangthai) => {
    let contentnew = trangthai == 3 ? listcash : listOdering;
    if (e.target.value == 0) e.target.value = 1;
    contentnew[index].soluong = e.target.value;
    let newtable = contentnew[index];

    if (trangthai == 3) {
      setSumcash(
        contentnew.reduce(
          (a, v) => (a = a + v.soluong * findproduct(v.productId).price),
          0
        )
      );
      console.log(contentnew, table);
      OderFireBaseService.getAll().then((res) => {
        console.log(
          Object.values(res.data).filter((item) => item.id == table)[0].data
        );
        let listAffter = listshow;
        listAffter[table].mes[index].soluong = e.target.value;
        setlistshow(listAffter);
        OderFireBaseService.update({ id: table, data: contentnew }).then(
          (res) => {
            toast.success("Cập nhật số lượng thành công");
          }
        );
      });
      setlistcash([...contentnew]);
    } else {
      setlistOdering([...contentnew]);
    }
  };
  const findproduct = (id) => {
    const results2 = options.filter((element) => {
      return element !== null && element !== undefined;
    });
    let pro = results2.filter(
      (item) => item.productID !== null && item.productID == id
    );

    return pro[0];
  };

  const deleteByIndex = (e, statusoder) => {
    if (statusoder == 1) {
      let tam = listOdering[e];
      setlistOdering(
        listOdering.filter(
          (item) => item.product.productID != tam.product.productID
        )
      );
    } else {
      let listcashnew = listcash.filter(
        (item) => item.oderId != listcash[e].oderId
      );
      OderFireBaseService.update({ id: table, data: listcashnew }).then(
        (res) => {
          toast.success("Xóa thành công");
        }
      );
      let listAffter = listshow;
      console.log(listAffter, listcash[e].oderId);
      listAffter[table].mes = listAffter[table].mes.filter(
        (item) => item.oderId != listcash[e].oderId
      );
      setlistshow(listAffter);
      console.log(listAffter, listcash[e].oderId);
      setlistcash(listcashnew);
      setSumcash(
        listcashnew.reduce(
          (a, v) => (a = a + v.soluong * findproduct(v.productId).price),
          0
        )
      );
    }
  };
  const OnclickOder = () => {
    const datenew = new Date();
    const time = datenew.getHours() + ":" + datenew.getMinutes();
    let ms = { ban: table, trangthai: 3, mes: listOdering };
    console.log(listshow);
    let listbyban = [];
    listbyban = listshow[ms.ban].mes;
    let flags = 0;
    let listoffirebane = [];
    let listProduct = [];
    productService.getAllfirebase().then((res) => {
      console.log(Object.values(res.data).filter((e) => e != null));
      listProduct = Object.values(res.data).filter((e) => e != null);

      listOdering.map((item, index) => {
        let order = {
          oderId: generateRandomString(),
          gio: time,
          ngay: date,
          productId: item.product.productID,
          soban: ms.ban,
          soluong: item.soluong,
          trangthai: ms.trangthai,
        };
        console.log(
          listProduct.filter((e) => e.productID == item.product.productID)[0]
        );
        // listProduct.filter(
        //   (e) => e.productID == item.product.productID
        // )[0].SoLuong =
        //   Number(
        //     listProduct.filter((e) => e.productID == item.product.productID)[0]
        //       .SoLuong
        //   ) - Number(item.soluong);

        // productService.update(
        //   listProduct.filter((e) => e.productID == item.product.productID)[0]
        // );

        if (
          listoffirebane.findIndex(
            (e) => e.productId == item.product.productID
          ) == -1
        ) {
          listoffirebane.push(order);
        }
      });
      OderFireBaseService.getAll().then((res) => {
        let listOlder = [];
        listOlder = res.data
          ? Object.values(res.data).filter((e) => e != null && e.id == ms.ban)
              .length > 0
            ? Object.values(res.data).filter(
                (e) => e != null && e.id == ms.ban
              )[0].data
            : []
          : [];
        listoffirebane.map((item, index) => {
          let vt = listOlder.findIndex((e) => e.productId == item.productId);
          if (vt > -1) {
            listOlder[vt].soluong =
              Number(listOlder[vt].soluong) + Number(item.soluong);
          } else {
            listOlder.push(item);
          }
        });

        OderFireBaseService.update({ id: ms.ban, data: listOlder }).then(
          (res) => {
            toast.success("Oder thành công");
            console.log(listOlder);
          }
        );
        let listtest = listshow;
        listtest[ms.ban].trangthai = 3;
        listtest[ms.ban].mes = listOlder;
        console.log(listtest);
        setlistshow(listtest);
        setshow(false);
      });
    });
  };
  const OnclickCash = (e) => {
    let flags = 0;
    let ms = { ban: table, trangthai: 4, mes: [] };
    let lisset = listshow;
    console.log(listshow);
    lisset[table].trangthai = 0;
    setlistshow(lisset);
    productService.getAllfirebase().then((res) => {
      let listProduct = Object.values(res.data).filter((e) => e != null);
      console.log(listProduct, listshow[ms.ban].mes);
      listshow[ms.ban].mes.map((item, index) => {
        listProduct.filter((e) => e.productID == item.productId)[0].SoLuong =
          Number(
            listProduct.filter((e) => e.productID == item.productId)[0].SoLuong
          ) - Number(item.soluong);

        productService.update(
          listProduct.filter((e) => e.productID == item.productId)[0]
        );
      });
    });
    cashService
      .update({
        date: date,
        id: listshow[ms.ban].mes[0].oderId,
        data: listshow[ms.ban].mes,
      })
      .then((res) => {
        toast.success("Thanh toán thành công");
        cashService.getbyday(date).then((ress) => {
          let newarry = [];
          Object.values(ress.data).map((item, index) => {
            console.log(item.data);
            newarry.push(...item.data);
          });
          console.log(newarry);
        });
      });

    OderFireBaseService.delete({ id: table, data: {} }).then((res) => {
      console.log("hehehe");
    });
    setshow(false);
  };
  return (
    <>
      <Header />
      <main className="mains">
        <section id="about" className="about">
          <div className="container" data-aos="fade-up">
            <div className="row border">
              {listshow.map((item, index) => {
                return (
                  <>
                    {index != 0 &&
                      (item.trangthai ? (
                        <>
                          {item.trangthai == 3 ? (
                            <div
                              onClick={(e) => SelectTable(index)}
                              className="col-lg-3 col-md-6 col-sm-6 border ban align-middle ups"
                              key={index}
                            >
                              Bàn {index}{" "}
                              {getNoteByNumberTable(index)
                                ? "(" + getNoteByNumberTable(index) + ")"
                                : ""}
                            </div>
                          ) : (
                            <div
                              onClick={(e) => SelectTable(index)}
                              className="col-lg-3 col-md-6 col-sm-6 border ban align-middle "
                            >
                              Bàn {index}{" "}
                              {getNoteByNumberTable(index)
                                ? "(" + getNoteByNumberTable(index) + ")"
                                : ""}
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          onClick={(e) => SelectTable(index)}
                          className="col-lg-3 col-md-6 col-sm-6 border ban align-middle "
                        >
                          Bàn {index}
                        </div>
                      ))}
                  </>
                );
              })}
            </div>

            <Modal
              show={show}
              size="lg"
              onHide={() => setshow(false)}
              dialogClassName="modal-90w"
              aria-labelledby="example-custom-modal-styling-title"
            >
              <Modal.Header
                closeButton
                style={{ backgroundColor: "antiquewhite" }}
              >
                <Modal.Title id="example-custom-modal-styling-title">
                  <h3 className="text-center">Bàn {table}</h3>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {!infirebase && (
                  <>
                    <h1>Chọn món oder </h1>

                    <input
                      type="text"
                      className="form-control  border-radius"
                      placeholder="Ghi chú"
                      onChange={(e) => changeNote(e)}
                      value={note}
                    />

                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="name"
                      onChange={(e) => changeProduct(e)}
                      options={options}
                      placeholder="Chọn đồ uống..."
                      selected={singleSelections}
                    />
                  </>
                )}

                {listOdering && listOdering.length > 0 && (
                  <div className="row">
                    <h1>Đang oder </h1>
                    <div
                      className="col col-lg-3 border"
                      style={{ textAlign: "center" }}
                    >
                      Tên đồ uống
                    </div>
                    <div
                      className="col col-lg-2 border"
                      style={{ textAlign: "center" }}
                    >
                      Giá
                    </div>
                    <div
                      className="col col-lg-2     border"
                      style={{ textAlign: "center" }}
                    >
                      Số lượng
                    </div>
                    <div
                      className="col col-lg-3 border"
                      style={{ textAlign: "center" }}
                    >
                      Thành tiền
                    </div>
                    {!infirebase && (
                      <div
                        className="col col-lg-2 border"
                        style={{ textAlign: "center" }}
                      ></div>
                    )}
                  </div>
                )}
                {listOdering &&
                  listOdering.length > 0 &&
                  listOdering.map((item, index) => {
                    return (
                      <>
                        <div className="row">
                          <div
                            className="col col-lg-3 border"
                            style={{ textAlign: "center" }}
                          >
                            {item.product.name}
                          </div>
                          <div
                            className="col col-lg-2 border"
                            style={{ textAlign: "center" }}
                          >
                            {item.product.price}
                          </div>
                          <div
                            className="col col-lg-2 border"
                            style={{ textAlign: "center" }}
                          >
                            <input
                              type="number"
                              className="form-control  border-radius"
                              onChange={(e) =>
                                changesoluong(e, index, item.trangthai)
                              }
                              value={item.soluong}
                            />
                          </div>
                          <div
                            className="col col-lg-3 border"
                            style={{ textAlign: "center" }}
                          >
                            {item.product.price * item.soluong}
                          </div>
                          {!infirebase && (
                            <div
                              onClick={() => deleteByIndex(index, 1)}
                              className="col col-lg-2 border trash"
                              style={{ textAlign: "center" }}
                            >
                              <i className="bi bi-trash"></i>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })}

                {listcash && listcash.length > 0 && (
                  <div className="row">
                    <h3>Đã oder </h3>
                    <div
                      className="col col-lg-3 border"
                      style={{ textAlign: "center" }}
                    >
                      Tên đồ uống
                    </div>
                    <div
                      className="col col-lg-2 border"
                      style={{ textAlign: "center" }}
                    >
                      Giá
                    </div>
                    <div
                      className="col col-lg-2     border"
                      style={{ textAlign: "center" }}
                    >
                      Số lượng
                    </div>
                    <div
                      className="col col-lg-3 border"
                      style={{ textAlign: "center" }}
                    >
                      Thành tiền
                    </div>
                    {!infirebase && (
                      <div
                        className="col col-lg-2 border"
                        style={{ textAlign: "center" }}
                      ></div>
                    )}
                  </div>
                )}

                {listcash &&
                  listcash.length > 0 &&
                  listcash.map((item, index) => {
                    return (
                      <>
                        <div className="row">
                          <div
                            className="col col-lg-3 border"
                            style={{ textAlign: "center" }}
                          >
                            {findproduct(item.productId).name}
                          </div>
                          <div
                            className="col col-lg-2 border"
                            style={{ textAlign: "center" }}
                          >
                            {findproduct(item.productId).price}
                          </div>
                          <div
                            className="col col-lg-2 border"
                            style={{ textAlign: "center" }}
                          >
                            <input
                              type="number"
                              className="form-control  border-radius"
                              onChange={(e) =>
                                changesoluong(e, index, item.trangthai)
                              }
                              value={item.soluong}
                            />
                          </div>
                          <div
                            className="col col-lg-3 border"
                            style={{ textAlign: "center" }}
                          >
                            {findproduct(item.productId).price * item.soluong}
                          </div>
                          {!infirebase && (
                            <div
                              onClick={() => deleteByIndex(index, 3)}
                              className="col col-lg-2 border trash"
                              style={{ textAlign: "center" }}
                            >
                              <i className="bi bi-trash"></i>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })}
                {sumCash > 0 && (
                  <div className="row">
                    <div
                      className="col col-lg-4 border"
                      style={{ textAlign: "center", fontWeight: "bolder" }}
                    >
                      Tổng tiền
                    </div>
                    <div
                      className="col col-lg-8 border"
                      style={{ textAlign: "center", fontWeight: "bolder" }}
                    >
                      {sumCash}
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col col-lg-6">
                    {!infirebase &&
                      listcash &&
                      listcash.length > 0 &&
                      listshow[table] &&
                      listshow[table].trangthai == 3 && (
                        // <Print
                        //   content={listcash}
                        //   id={table}
                        //   OnclickCash={OnclickCash}
                        // />
                        <button
                          className="btn btn-primary"
                          onClick={() => OnclickCash()}
                        >
                          Oder
                        </button>
                      )}
                  </div>
                  {!infirebase && listOdering && listOdering.length > 0 && (
                    <div
                      className="col col-lg-6"
                      style={{ textAlign: "right" }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() => OnclickOder()}
                      >
                        Oder
                      </button>
                    </div>
                  )}
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </section>
      </main>
    </>
  );
};

const mapStateToProps = (state) => {
  return { dataRedux: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: "LOGOUT" }),
    addcart: (e) => dispatch({ type: "ADDCART", payload: e }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
