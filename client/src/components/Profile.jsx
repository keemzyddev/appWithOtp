import { useNavigate } from "react-router-dom";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import avatar from "../assets/profile.png";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import { useState } from "react";
import convertToBase64 from "../helper/convert";
import useFetch from "../hooks/fetchHook";
import { useAuthStore } from "../store/store";
import { updateUser } from "../helper/helper";

const Profile = () => {
  const navigate = useNavigate();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const [file, setFile] = useState("");

  const formik = useFormik({
    initialValues: {
      firstname: apiData?.firstname || "",
      lastname: apiData?.lastname || "",
      phone: apiData?.phone || "+",
      email: apiData?.email || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, {
        profile: file || apiData?.profile || "",
      });
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Updated Successfully</b>,
        error: <b>Could not update</b>,
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen ">
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: "45%" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-3xl font-bold">Profile</h4>
            <span className="py-2 text-xl text-center text-gray-500">
              You can update your profile
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-3">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  alt="avatar"
                  className={`${styles.profile_img} ${extend.profile_img}`}
                />
              </label>
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={onUpload}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstname")}
                  type="firstname"
                  placeholder="Firstname"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps("lastname")}
                  type="lastname"
                  placeholder="Lastname"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("phone")}
                  type="phone"
                  placeholder="Phone"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps("email")}
                  type="email"
                  placeholder="Email"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>

              <input
                {...formik.getFieldProps("address")}
                type="address"
                placeholder="Adress"
                className={`${styles.textbox} ${extend.textbox}`}
              />
              <button className={styles.btn} type="">
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-green-500">
                Come back later
                <button onClick={logout} className="text-red-500 px-1">
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
