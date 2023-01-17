import styles from "../styles/Username.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { useState } from "react";
import { useEffect } from "react";
import { generateOTP, verifyOTP } from "../helper/helper";

const Recovery = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) return toast.success("OTP has been sent to your email");
      return toast.error("Problem while generating OTP");
    });
  }, [username]);

  // verify OTP
  async function onSubmit(e) {
    e.preventDefault();

    try {
      let { status } = await verifyOTP({ username, OTP });
      if (status === 201) {
        toast.success("Verification Successful");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("Invalid OTP, Check email again");
    }
  }

  // function to reset OTP
  async function resendOTP() {
    let sendPromise = generateOTP(username);

    toast.promise(sendPromise, {
      loading: "Sending...",
      success: <b>OTP has been sent to your email</b>,
      error: <b>Error sending OTP</b>,
    });

    sendPromise.then((OTP) => {});
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Password Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password.
            </span>
          </div>
          <form onSubmit={onSubmit} className="pt-20">
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address
                </span>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  type="text"
                  placeholder="OTP"
                  className={styles.textbox}
                />
              </div>
              <button className={styles.btn} type="">
                Enter OTP
              </button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className="text-green-500">
              Can't get OTP?
              <button onClick={resendOTP} className="text-red-500 px-1">
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
