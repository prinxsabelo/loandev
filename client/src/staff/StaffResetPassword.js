import axios from "axios";
import { useState, useEffect } from "react";

const StaffResetPassword = ({ history, match }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };
        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Passwords don't match");
        }
        try {
            const { data } = await axios.put(
                `/api/staff_auth/resetpassword/${match.params.resetToken}`,
                {
                    password,
                },
                config
            );
            history.push("/staff/");
        } catch (error) {

            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }
    useEffect(() => {
        if (localStorage.getItem("staffAuthToken")) {
            history.push("/staff/");
        }
    }, [history]);
    return (
        <>
            <div className="h-screen w-full flex justify-center items-center">

                <form onSubmit={resetPasswordHandler} className="p-2  w-1/3 flex flex-col shadow border-2 ">

                    <div className="text-center text-uppercase mb-4 text-2xl p-6 bg-gray-700 text-white">
                        Staff Reset Password
                        {error && <span className="error-message">{error}</span>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username" type="password" placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="confirmpassword">
                            Confirm Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username" type="password" placeholder="Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword} />
                    </div>

                    <div className="form-group p-2 text-center">
                        <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4
                             rounded focus:outline-none focus:shadow-outline w-96">Reset Password</button>
                    </div>
                </form>

            </div>
        </>
    )
}
export default StaffResetPassword