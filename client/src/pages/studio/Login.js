import React, { Fragment, useState, useEffect, useContext } from "react";
import { Button, Form, InlineLoading } from "carbon-components-react";
import { ArrowRight32 } from "@carbon/icons-react";
import "../../styles/style-sheet/form-styles.scss";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/auth";

const Login = (props) => {
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    email: "test_user@email.com",
    password: "test",
  });

  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 1000) setShowMobileWarning(true);
  }, []);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/projects");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      email: values.email,
      password: values.password,
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    loginUser();
  };

  // Handle Loading States

  let loadingState;

  if (!loading && Object.keys(errors).length === 0) {
    loadingState = <Fragment />;
  } else if (!loading && Object.keys(errors).length > 0) {
    loadingState = <InlineLoading description="Login Error" status="error" />;
  } else if (loading) {
    loadingState = <InlineLoading description="Logging In" status="active" />;
  } else {
    loadingState = <InlineLoading description="Logging In" status="finished" />;
  }

  return (
    <Fragment>
      {showMobileWarning ? (
        <div
          style={{
            width: "300px",
            marginTop: "50%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p style={{ color: "#000", textAlign: "center" }}>
            <strong>Project Corpenicus</strong> is not supported on this screen
            size, Please open on a desktop browser
          </p>
        </div>
      ) : (
        <div className="bx--grid bx--grid--full-width login-background">
          <div className="bx--row" style={{ height: "30vh" }}></div>
          <div className="bx--row" style={{ height: "30vh" }}>
            <div
              className="bx--col-lg login-container"
              style={{ marginLeft: "40vw", marginRight: "40vw" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                }}
              >
                <div></div>
                <h3 style={{ fontSize: "2rem", textAlign: "center" }}>Login</h3>
                <div></div>
              </div>
              <div style={{ textAlign: "center" }}>
                <small>Provide Login Credentials</small>
              </div>

              <Form onSubmit={onSubmit} noValidate>
                <div
                  className="bx--form-item"
                  style={{ marginTop: "2rem", marginBottom: "0.2rem" }}
                >
                  <input
                    id="email-input"
                    type="email"
                    className={
                      Object.keys(errors).length > 0 &&
                      Object.keys(errors).includes("email")
                        ? "bx--text-input bx--text-input--invalid"
                        : "bx--text-input"
                    }
                    placeholder="Email Address"
                    name="email"
                    value={values.email}
                    onChange={onChange}
                    autoComplete=""
                    error={errors.email ? true : false}
                  ></input>
                </div>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("email") ? (
                  <small className="invalid-input">
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("email")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
                <div
                  className="bx--form-item"
                  style={{ marginTop: "1rem", marginBottom: "0.2rem" }}
                >
                  <input
                    id="password-input"
                    className={
                      Object.keys(errors).length > 0 &&
                      Object.keys(errors).includes("password")
                        ? "bx--text-input bx--text-input--invalid bx--password-input"
                        : "bx--text-input bx--password-input"
                    }
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={onChange}
                    autoComplete=""
                    error={errors.password ? true : false}
                  ></input>
                </div>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("password") ? (
                  <small className="invalid-input">
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("password")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}

                <div
                  style={{
                    marginTop: "2rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                  }}
                >
                  <div></div>
                  <Button type="submit" renderIcon={ArrowRight32}>
                    Login
                  </Button>
                  <div></div>
                </div>
                <div
                  style={{
                    marginTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                  }}
                >
                  <div></div>
                  <div>{loadingState}</div>
                  <div></div>
                </div>
              </Form>
            </div>
          </div>
          <div className="bx--row" style={{ height: "40vh" }}></div>
        </div>
      )}
    </Fragment>
  );
};

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      id
      first_name
      last_name
      email
      token
    }
  }
`;

export default Login;
