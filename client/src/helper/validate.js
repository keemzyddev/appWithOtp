import toast from "react-hot-toast";

export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  return errors;
}

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  return errors;
}

export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirmPassword) {
    return (errors.password = toast.error("Password does not match!"));
  }
  return errors;
}

export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

export async function profileValidation(values) {
  const errors = emailVerify({}, values);

  return errors;
}

function passwordVerify(error = {}, values) {
  const specialCharacters =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/;
  if (!values.password) {
    return (error.password = toast.error("Password Required...!"));
  }
  if (values.password.includes(" ")) {
    return (error.password = toast.error("Invalid Password...!"));
  }
  if (values.password.length < 6) {
    return (error.password = toast.error(
      "Password must be atleast 6 characters long!"
    ));
  }
  if (!specialCharacters.test(values.password)) {
    return (error.password = toast.error(
      "Password must contain atleast one uppercase letter, one lowercase letter and one special character!"
    ));
  }
  return error;
}

function usernameVerify(error = {}, values) {
  if (!values.username) {
    return (error.username = toast.error("Username Required...!"));
  }
  if (values.username.includes(" ")) {
    return (error.username = toast.error("Invalid Username...!"));
  }
  return error;
}

function emailVerify(error = {}, values) {
  if (!values.email) {
    return (error.email = toast.error("Email Required...!"));
  }
  if (values.email.includes(" ")) {
    return (error.email = toast.error("Wrong Email Address...!"));
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
    return (error.email = toast.error("Invalid Email Address"));
  }
  return error;
}
