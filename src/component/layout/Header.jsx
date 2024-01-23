import "./Nav.css";
import "./Layout.scss";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const Header = (props) => {
  const users = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;

  let navigate = useNavigate();

  useEffect(() => {
    // const users = props.dataRedux.user.tenDangNhap ? props.dataRedux.user : null;
    // if (users) {
    //     GioHangService.getlist(users).then(
    //         res => {
    //             props.addcart(res.data)
    //         }
    //     )
    // }
  }, []);
  const logOut = () => {
    toast.success("Tài khoản đã được đăng xuất ");
    sessionStorage.clear();

    navigate("/");
    props.logout();
  };
  return (
    <>
      <header
        id="header"
        className="fixed-top "
        style={{ marginBottom: "calc(10px + 2vmin)" }}
      >
        <div className="container d-flex align-items-center">
          <Navbar
            collapseOnSelect
            expand="lg"
            className="test"
            style={{ color: "white" }}
          >
            <Container>
              <Navbar.Brand
                className="test"
                style={{ color: "aliceblue !important" }}
              >
                <NavLink
                  style={{ textDecoration: "none" }}
                  to="/"
                  activeclassname="nav-link scrollto active"
                  exact="true"
                >
                  Cafe Hưng Thịnh
                </NavLink>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  {users && users.roleId == 1 && (
                    <NavDropdown
                      title="Quản lý"
                      className="test"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item className="hover" href="#">
                        <NavLink className="hovers" to="/product/list">
                          Kho
                        </NavLink>
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#" className="hover">
                        <NavLink className="hover" to="/admin/thongke">
                          Thống kê
                        </NavLink>
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </Nav>
                <Nav>
                  {users ? (
                    <NavLink className="test" to={"/"} onClick={() => logOut()}>
                      Đăng xuất
                    </NavLink>
                  ) : (
                    <NavLink className="test" to="/user/login">
                      Đăng nhập
                    </NavLink>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </header>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
