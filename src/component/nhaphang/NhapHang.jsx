import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "../../Asset/scss/Nhaphang.scss";
import productService from "../../service/productService";
// import nhaphangService from '../../service/nhaphangService';
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>;
const NhapHang = (props) => {
  const [show, setshow] = useState(false);
  const [sanpham, setsanpham] = useState();
  const [gia, setgia] = useState();
  const [soluong, setsoluong] = useState();
  const [listSP, setListSP] = useState([]);

  const [list, setList] = useState([]);
  const [ngay, setngay] = useState("");

  const themPLH = () => {
    setList([]);
    setshow(true);
    setListSP(props.list);
  };
  const getproducts = (e) => {
    let list = props.list.filter((item) => item.productID == e);
    return list[0];
  };

  const ChangeGia = (e) => {
    setgia(e.target.value);
  };
  const changesoluong = (e) => {
    setsoluong(e.target.value);
  };

  const changeSanPham = (e) => {
    setsanpham(e.target.value);
  };
  const changeNgay = (e) => {
    console.log(e.target.value);
    setngay(e.target.value);
  };
  const additem = () => {
    let getproduct = {
      productId: sanpham,
      soluong: soluong,
      price: gia,
      ngay: ngay,
    };

    let lists = list;
    console.log(list, getproduct);
    let i = lists.findIndex((item) => item.productId == getproduct.productId);
    if (i > -1)
      lists[i].soluong =
        parseInt(lists[i].soluong) + parseInt(getproduct.soluong);
    else lists.push(getproduct);
    let product = getproducts(sanpham);
    product.SoLuong = parseInt(product.SoLuong) + parseInt(soluong);
    let listsp = listSP;
    let index = listsp.findIndex((item) => item.productID == sanpham);
    listsp[index].SoLuong = product.SoLuong;
    setListSP(listsp);

    setList(lists);
    setgia("");
    setsoluong("");
    setsanpham("");
    productService.getAllfirebase().then((res) => {
      let listproduct = Object.values(res.data).filter((e) => e != null);
      console.log(
        listproduct.filter((item) => item.productID == getproduct.productId)[0]
          .SoLuong
      );
      listproduct.filter(
        (item) => item.productID == getproduct.productId
      )[0].SoLuong =
        Number(
          listproduct.filter(
            (item) => item.productID == getproduct.productId
          )[0].SoLuong
        ) + Number(soluong);
      productService
        .update(
          listproduct.filter(
            (item) => item.productID == getproduct.productId
          )[0]
        )
        .then((res) => {
          toast.success("Nhập hàng thành công");
          props.save();
        });
    });
    // productService.edit(sanpham, product).then((rs) => {
    //   setListSP(listsp);
    //   props.save(listsp);
    //   setList(lists);
    //   setgia("");
    //   setsoluong("");
    //   setsanpham("");
    // });
  };
  const save = () => {
    setshow(false);
    props.save();
  };
  return (
    <>
      <div className="col col-lg-3  col-sm-12 col-md-6 ">
        <a
          href="#"
          style={{ float: "right" }}
          className="btn btn-success btn-icon-split bieutuong"
        >
          <span className="text" onClick={() => themPLH()}>
            {" "}
            &nbsp;Nhập hàng
          </span>
        </a>
      </div>
      <Modal
        show={show}
        size="xl"
        onHide={() => setshow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton style={{ backgroundColor: "antiquewhite" }}>
          <Modal.Title id="example-custom-modal-styling-title">
            <h3 className="text-center">Nhập hàng</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="row">
              <div className="col-5">
                <div className="input-group mb-2 mr-sm-2 align-item">
                  <label className="small mb-1" htmlFor="inputLocation">
                    Ngày nhập hàng
                  </label>
                  <input
                    className="form-control border-radius"
                    id="inputLocation"
                    name="location"
                    onChange={(e) => changeNgay(e)}
                    value={ngay}
                    type="date"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
              <div className="col-5">
                <div className="input-group mb-2 mr-sm-2  align-item">
                  <div className="input-group-prepend">Tên sản phẩm</div>

                  <select
                    className="form-control border-radius"
                    onChange={(event) => changeSanPham(event)}
                    value={sanpham}
                  >
                    <option hidden value="">
                      Chọn sản phẩm
                    </option>
                    {listSP &&
                      listSP.length > 0 &&
                      listSP.map((item, index) => {
                        return (
                          <option key={index} value={item.productID}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <div className="input-group  align-item">
                  <div className="input-group-prepend">Giá nhập</div>
                  <input
                    type="number"
                    className="form-control  border-radius"
                    onChange={(e) => ChangeGia(e)}
                    value={gia}
                  />
                </div>
              </div>
              <div className="col-5">
                <div className="input-group  align-item">
                  <div className="input-group-prepend">Số lượng nhập</div>
                  <input
                    type="number"
                    className="form-control  border-radius"
                    onChange={(e) => changesoluong(e)}
                    value={soluong}
                  />
                </div>
              </div>
              <div className="col-2">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => additem()}
                  className="btn btn-info btn-circle bieutuong"
                >
                  Thêm
                </a>
              </div>
            </div>
          </div>

          <div className="row">
            {list && list.length > 0 && (
              <>
                <table
                  className="table table-bordered  product-table"
                  style={{ verticalAlign: "middle", textAlign: "center" }}
                >
                  <thead>
                    <tr>
                      <th>Ngày nhập</th>
                      <th>Tên sản phẩm</th>

                      <th>Giá nhập</th>
                      <th>Sô lượng nhập</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td style={{ verticalAlign: "middle" }}>
                              {new Date(item.ngay).toLocaleDateString("en-GB")}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {getproducts(item.productId).name}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {item.price}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {item.soluong}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                <button
                  type="submit"
                  style={{ width: "20%" }}
                  className="btn btn-primary mb-2"
                  onClick={() => save()}
                >
                  Lưu
                </button>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default NhapHang;
