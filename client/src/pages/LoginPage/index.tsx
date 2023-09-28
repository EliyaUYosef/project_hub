import React, { useContext, useState, useEffect } from "react";
import { LoginForm, LoginErrors, PersonalDetails } from "../../Types";
import { AppGlobalData } from "../../App";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { setApiToken, setPersonalDetails } =
    useContext(AppGlobalData);
  const [loader, setLoader] = useState(false);
  const [token, setToken] = useState("");
  const [emailFlag, setEmailFlag] = useState(false);
  const [passwordFlag, setPasswordFlag] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [apiError, setApiError] = useState("");
  const [personalDetailsLocal, setPersonalDetailsLocal] = useState(
    {} as PersonalDetails
  );
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [inputErrors, setInputErrors] = useState<LoginErrors>({
    emailError: "",
    passwordError: "",
  });
  useEffect(() => {
    if (loggedIn) {
      console.log(personalDetailsLocal);
      setApiToken(token);
      setPersonalDetails(personalDetailsLocal);
      navigate("/info");
      setLoader(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    let localToken = window.localStorage.getItem("token");
    if (localToken !== "") setToken(localToken ?? "");
  }, []);

  useEffect(() => {
    if (token !== "") window.localStorage.setItem("token", token);
  }, [token]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;

    if (name === "email") {
      if (value.length < 8) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          emailError: "Email must be at least 8 characters long",
        }));
        setEmailFlag(false);
      } else if (!validateEmail(value)) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          emailError: "Invalid email format",
        }));
        setEmailFlag(false);
      } else {
        setEmailFlag(false);
        if (value.length >= 8 && validateEmail(value)) {
          setEmailFlag(true);
        }
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          emailError: "",
        }));
      }
    }
    if (name === "password") {
      let passwordValidation = !/[0-9]/.test(value) || !/[A-Z]/.test(value);
      if (value.length < 10) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          passwordError: "Password must be at least 10 characters long",
        }));
        setPasswordFlag(false);
      } else if (passwordValidation) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          passwordError:
            "Password must contain at least one number and one capital letter",
        }));
        setPasswordFlag(false);
      } else {
        setPasswordFlag(false);
        if (value.length >= 10 && !passwordValidation) {
          setPasswordFlag(true);
        }
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          passwordError: "",
        }));
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    setLoader(true);
    event.preventDefault();

    const response = await fetch(
      "https://private-052d6-testapi4528.apiary-mock.com/authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();

      setPersonalDetailsLocal(data[0].personalDetails);
      setToken(data[0].token);
      setLoggedIn(true);
      setLoader(false);
    } else {
      try {
        const errorData = await response.json(); // Attempt to parse the error response as JSON
        if (errorData.message) {
          setApiError(errorData.message); // Set the error message
        }
      } catch (error) {
        console.error("Error:", error);
      }
      console.error("Login failed");
      setLoader(false);
    }
  };

  return loader ? (
    <Loader />
  ) : (
    <div>
      <h1>Login Page</h1>
      {apiError ? <div>Error</div> : <div></div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <div className="email_error">{inputErrors.emailError}</div>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="email_error">{inputErrors.passwordError}</div>
        <button
          disabled={!(emailFlag && passwordFlag)}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};
function validateEmail(email: string) {
  var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
}
export default LoginPage;
