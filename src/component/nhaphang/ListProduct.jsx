import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paginations from "../support/Paginations";
import Header from "../layout/Header";
import productService from "../../service/productService";
import NhapHang from "./NhapHang";
const ListProduct = () => {
  let navitive = useNavigate();
  const [list, SetList] = useState([]);

  const [lists, setLists] = useState([]);
  const users = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;

  useEffect(() => {
    if (!users || users.roleId != 1) {
      navitive("/");
      toast.error("Bạn không có quyền truy cập");
    }
    productService.getAllfirebase().then((res) => {
      console.log(Object.values(res.data));
      SetList(
        Object.values(res.data).filter(
          (item) => item != null && item.categoryId == 1
        )
      );
    });
  }, []);

  const getlist = (e) => {
    setLists(e);
  };

  const save = () => {
    productService.getAllfirebase().then((res) => {
      console.log(Object.values(res.data));
      SetList(
        Object.values(res.data).filter(
          (item) => item != null && item.categoryId == 1
        )
      );
    });
  };

  return (
    <>
      <Header />
      <main id="main" className="mains">
        <div id="wrapper">
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <div className="container-fluid bang">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Danh sách họ sản phẩm
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="product-content-top  align-item">
                      <input
                        type="text"
                        className="form-control form-controls"
                        placeholder="Tìm kiếm"
                      />

                      <NhapHang list={list} save={save} />
                      {/* 
                                                    <ImPort getdata={getdata} head={head} data={Data} name={"DanhSachHoSanPham"} /> */}
                    </div>
                    <div className="table-responsive">
                      <table
                        className="table table-bordered product-table"
                        id="dataTable"
                        cellSpacing="0"
                      >
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá bán</th>
                            <th>Số lượng kho</th>

                            {/* <th style={{ cursor: "pointer" }} onClick={() => sapxep(hinhthuc)}>Số lượng  {hinhthuc != null && hinhthuc == true && (<i class="fa fa-sort-up"></i>)} {hinhthuc != null && hinhthuc == false && (<i class="fa fa-sort-down"></i>)}</th> */}
                            <th>Quản lý</th>
                          </tr>
                        </thead>

                        <tbody>
                          {lists &&
                            lists.length > 0 &&
                            lists.map((item, index) => {
                              return (
                                <tr key={index} className="row-content">
                                  <td>{item.productID}</td>
                                  <td>{item.name}</td>
                                  <td>{item.price}</td>

                                  <td>{item.SoLuong}</td>
                                  <td>Xóa</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <Paginations itemsPerPage={8} list={list} getlist={getlist} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default ListProduct;
