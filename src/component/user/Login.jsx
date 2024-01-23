import "./User.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import userService from "../../service/userService";
import Header from "../layout/Header";
const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lastActivityTime, setLastActivityTime] = useState(new Date());
  let flag = 0;
  let navitive = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user") && flag == 0) {
      navitive("/");
      flag = 1;
      toast.info("Vui lòng đăng xuất trước khi đăng nhập lại!");
    }
  }, []);
  const ChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const ChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const login = (e) => {
    let user = { username: username, password: password };
    console.log(user);
    userService
      .getAll()
      .then((res) => {
        console.log(res.data);
        if (
          Object.values(res.data).filter(
            (e) => (e.username = username && e.password == password)
          )[0]
        ) {
          console.log(res.data);
          if (res.data) {
            toast.success("Đăng nhập thành công");
            setLastActivityTime(new Date());
            sessionStorage.setItem(
              "user",
              JSON.stringify(
                Object.values(res.data).filter(
                  (e) => (e.username = username && e.password == password)
                )[0]
              )
            );
            navitive("/");
            props.login();
          }
        } else {
          toast.error("Sai mật khẩu ");
        }
      })
      .catch((err) => {
        toast.error("Tài khoản không tồn tại");
      });
  };

  return (
    <>
      <Header />
      <main className="mains">
        <section id="about" className="about">
          <div className="container" style={{ marginTop: "-70px" }}>
            <div className="row py-5 mt-4 align-items-center">
              <div className="col-md-5 pr-lg-5 mb-5 mb-md-0">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg"
                  alt=""
                  className="img-fluid mb-3 d-none d-md-block"
                />
                <h1 className="title">Chào mừng bạn trở lại</h1>
                {/* <p className="font-italic text-muted mb-0">Create a minimal registeration page using Bootstrap 4 HTML form elements.</p>
                                <p className="font-italic text-muted">Snippet By <a href="https://bootstrapious.com" className="text-muted">
                                    <u>Bootstrapious</u></a>
                                </p> */}
              </div>

              <div className="col-md-7 col-lg-6 ml-auto">
                <div className="row">
                  <h3 className="title">Đăng nhập</h3>

                  <div className="input-group col-6 mb-2">
                    <input
                      id="firstName"
                      type="text"
                      name="firstname"
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => ChangeUsername(e)}
                      className="form-control bg-white border-left-0 border-md"
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          login(event);
                        }
                      }}
                    />
                  </div>

                  <div className="input-group col-6 mb-4">
                    <input
                      required
                      id="lastName"
                      type="password"
                      name="lastname"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => ChangePassword(e)}
                      className="form-control bg-white border-left-0 border-md"
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          login(event);
                        }
                      }}
                    />
                  </div>

                  <div className="form-group col-lg-12 mx-auto mb-0">
                    <button
                      className="btn btn-primary btn-block py-2"
                      onClick={(e) => login(e)}
                    >
                      <span className="font-weight-bold">Đăng nhập</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
const mapStateToProps = (state) => {
  console.log(state);
  return {
    dataRedux: state.trangthai,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (e) => dispatch({ type: "LOGIN", payload: e }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
