import { Navigate, useNavigate } from "react-router-dom";
import styles from "../styles/Username.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidation } from "../helper/validate";
import { useAuthStore } from "../store/store";
import { resetPassword } from "../helper/helper";
import useFetch from "../hooks/fetchHook";
import { useEffect } from "react";

const Reset = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const { isLoading, apiData, status, serverError } =
    useFetch("createResetSession");

  useEffect(() => {
    console.log(apiData);
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPromise = resetPassword({ username, password });

      toast.promise(resetPromise, {
        loading: "Updating...",
        success: <b>Reset Successful</b>,
        error: <b>Could not reset password</b>,
      });

      resetPromise.then(() => navigate("/password"));
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  if (status && status !== 201)
    return <Navigate to={"/password"} replace={true}></Navigate>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Reset Password</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new password
            </span>
          </div>
          <form className="pt-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="New Password"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
                className={styles.textbox}
              />
              <button className={styles.btn} type="">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
