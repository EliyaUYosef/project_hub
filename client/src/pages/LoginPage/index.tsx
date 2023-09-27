import React, { useState, useEffect } from "react";

interface LoginForm {
  email: string;
  password: string;
}
interface LoginErrors {
  emailError?: string | "";
  passwordError?: string | "";
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [inputErrors, setInputErrors] = useState<LoginErrors>({
    emailError: "",
    passwordError: "",
  });
  const [loader, setLoader] = useState(false);
  const [token, setToken] = useState("");

  const [emailFlag, setEmailFlag] = useState(false);
  const [passwordFlag, setPasswordFlag] = useState(false);
  let apiError = false;
  useEffect(() => {
    let localToken = window.localStorage.getItem("token");
    if (localToken !== null)
      setToken(localToken ?? '');  
  }, []);
  useEffect(() => {
    let savedData;
    if (token !== '')
      window.localStorage.setItem("token", token);
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

      setToken(data[0].token);
      setLoader(false);
    } else {

      console.error("Login failed");
      setLoader(false);
    }
  };

  return loader ? (
    <div>Loading ... </div>
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
