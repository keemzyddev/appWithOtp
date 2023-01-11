import { Link } from "react-router-dom";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import avatar from "../assets/profile.png";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import { useState } from "react";
import convertToBase64 from "../helper/convert";

const Profile = () => {
  const [file, setFile] = useState("");

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      phone: "+",
      email: "",
      address: "",
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, { profile: file || "" });
      console.log(values);
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

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
                  src={file || avatar}
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
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-green-500">
                Come back later
                <Link to="/" className="text-red-500 px-1">
                  Logout
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
