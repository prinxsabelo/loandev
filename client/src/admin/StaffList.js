import axios from "axios";
import { useSnackbar } from 'react-simple-snackbar'
import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom'
import Moment from 'react-moment';
const StaffList = ({ history }) => {
    const [email, setEmail] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [error, setError] = useState("");
    const [openSnackbar, closeSnackbar] = useSnackbar();
    const [load, setLoad] = useState(false);
    const [staffsArr, setStaffsArr] = useState([]);
    const [staffDetail, setStaffDetail] = useState();
    const [loanDetail, setLoanDetail] = useState();
    const [staffEmail, setStaffEmail] = useState("");
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("PENDING");
    const config = {
        header: {
            "Content-Type": "application/json",
        },
    };
    const showStaff = () => {
        window.open(url)
    }
    const loadStaffs = async () => {
        setStaffsArr([]);
        try {
            const { data } = await axios.get(
                "/api/admin/staffs",
                config
            );
            console.log(data);
            setStaffsArr(data.staffs);
        } catch (error) {

        }

    }
    const showLoan = (loan) => {
        setLoanDetail(loan);
        setStatus(loan.status);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(
                "/api/admin/regstaff",
                { email, lastname, firstname },
                config
            );
            setStaffEmail(data.email);
            setUrl(data.resetUrl);
            openSnackbar(data.message);
            history.push("/admin/staffs");
            loadStaffs();
        } catch (error) {

            openSnackbar(error.response.data.error);
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }
    const handleStatus = (e) => {
        setStatus(e.target.value);
    }
    const submitStatus = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                `/api/admin/updateloan/${loanDetail._id}`,
                { status },
                config
            );

            let staffIndex = staffsArr.findIndex(x => x._id === staffDetail._id);
            let loanIndex = staffsArr[staffIndex].loans.findIndex(x => x._id === loanDetail._id);
            let newLoan = staffsArr[staffIndex].loans[loanIndex];
            staffsArr[staffIndex].loans[loanIndex].status = status;
            let newStaffs = staffsArr;
            console.log(newStaffs);
            openSnackbar(data.message);
        } catch (error) {

        }

    }
    useEffect(() => {
        loadStaffs();
        console.log(loanDetail);
    }, []);
    return (
        <div className="flex  justify-center mt-16 ">
            <div className="w-1/4 border-r-2 h-screen cc">
                <form className="flex flex-col px-2" onSubmit={handleSubmit}>
                    <div className="w-full flex  mt-3 text-xl uppercase mb-3">
                        CREATE STAFF
                    </div>

                    <div className="flex flex-col ">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Enter Email Address
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username" placeholder="Enter valid email address" type="email" required={true}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Enter Firstname
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username" type="text" placeholder="Enter firstname.."
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstname}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Enter Lastname
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username" type="text" placeholder="Enter lastname.."
                                onChange={(e) => setLastname(e.target.value)}
                                value={lastname}
                            />
                        </div>
                        <div className="flex items-center ">
                            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4
                             rounded focus:outline-none focus:shadow-outline" >
                                Register Staff
                            </button>
                        </div>
                    </div>
                    {staffEmail &&

                        <div onClick={() => showStaff()} className="success-message px-4">
                            <div>
                                Email was created successfully..
                            </div>
                            <div>
                                Visit link to access staff end..
                            </div>
                            <div>
                                email = {staffEmail}
                            </div>
                            <div>
                                password = password
                            </div>

                        </div>
                    }

                </form>

            </div>
            <div className="flex-auto flex flex-col">
                {staffsArr.length > 0 ?
                    <div className="flex">
                        <div className="w-1/3 border-r-2">
                            <div className="w-full flex mt-3 px-3 text-xl  mb-3">
                                STAFF LIST
                            </div>
                            <div className="list">
                                {staffsArr.map(stf => (
                                    <div key={stf._id}
                                        className={`flex flex-col shadow-lg w-11/12 bg-white border-2 my-4 mx-2 p-4 cursor-pointer
                                                    hover:bg-gray-200 truncate
                                                    ${(staffDetail && staffDetail._id === stf._id) && "shadow-xl bg-gray-300"}
                                                    `}
                                        onClick={() => setStaffDetail(stf)}>
                                        {stf.lastname} {stf.firstname}
                                        <small>{stf.email}</small>
                                    </div>
                                ))}
                            </div>

                        </div>
                        <>

                            <div className="flex-auto">
                                {staffDetail ?
                                    <div className="w-full flex flex-col p-4">
                                        <div className="text-xl shadow p-3">
                                            Loan history for {staffDetail.lastname}   {staffDetail.firstname}
                                        </div>
                                        <div className="flex flex-col  mt-4">
                                            {staffDetail.loans.length > 0 ?
                                                <div className="flex space-x-1">
                                                    <div className="w-1/2 staff-loan-list">
                                                        {staffDetail.loans.map(loan => (
                                                            <div key={loan._id}
                                                                onClick={() => showLoan(loan)}


                                                                className={`p-2 my-6 cursor-pointer border-2 
                                                                ${(loanDetail && loanDetail._id === loan._id) && 'shadow-2xl bg-gray-300 border-2'} 
                                                                ${loan.status === "PENDING" && 'bg-yellow-200 hover:bg-yellow-300'}
                                                                ${loan.status === "REVIEWING" && 'bg-purple-200 hover:bg-purple-300'}
                                                                ${loan.status === "DISBURSED" && 'bg-green-200 hover:bg-green-300'}
                                                                ${loan.status === "REJECTED" && 'bg-red-200 hover:bg-red-300'}
                                                                ${loan.status === "REFUNDED" && 'bg-white hover:bg-gray-200'}
                                                              `}

                                                            >


                                                                <div className="flex text-sm">
                                                                    <div className="w-1/2 font-bold tracking-wider">
                                                                        {loan.status}
                                                                    </div>
                                                                    <div className="text-sm truncate">
                                                                        <div className="truncate">
                                                                            Requested  <Moment fromNow>{loan.request_date}</Moment>
                                                                        </div>
                                                                        {loan.sent_date &&
                                                                            <div>
                                                                                Sent <Moment fromNow>{loan.sent_date}</Moment>
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                                <div className=" tracking-wider  truncate">
                                                                    Amount Requested = &#8358;{loan.request_amount}
                                                                </div>
                                                                <div>

                                                                    <div className="bg-white p-2 shadow border-2 text-xs tracking-wide" >
                                                                        {loan.request_message}
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="shadow bg-gray-100 flex-auto">
                                                        {loanDetail ?

                                                            <div className="flex p-3">
                                                                {(loanDetail.status === "DISBURSED" || loanDetail.status === "ACCEPTED") &&
                                                                    <div className="text-lg uppercase p-2">
                                                                        Loan Disbursed..
                                                                    </div>
                                                                }
                                                                {loanDetail.status === "REJECTED" &&
                                                                    <div className="text-lg uppercase p-2">
                                                                        You rejected loan..
                                                                    </div>
                                                                }
                                                                {loanDetail.status === "REFUNDED" &&
                                                                    <div className="text-lg uppercase p-2">
                                                                        Loan have been refunded
                                                                    </div>
                                                                }
                                                                {(loanDetail.status === "PENDING" || loanDetail.status === "REVIEWING") &&
                                                                    <div className="flex flex-col">
                                                                        <div>
                                                                            <select className="text-xl w-100" onChange={handleStatus} value={status}>

                                                                                <option value="PENDING">PEND LOAN</option>

                                                                                <option value="DISBURSED">DISBURSE LOAN</option>
                                                                                <option value="REVIEWING">REVIEWING LOAN</option>
                                                                                <option value="REJECTED">REJECT LOAN</option>
                                                                            </select>
                                                                        </div>

                                                                        <div className="text-sm mt-2 flex flex-col space-y-24 justify-center ">

                                                                            {status === "PENDING"
                                                                                &&
                                                                                <>
                                                                                    <div className="font-bold">
                                                                                        You can still leave the loan pending..
                                                                                    </div>

                                                                                    <button className="bg-yellow-200  p-2 rounded-lg text-lg w-64" onClick={submitStatus}>
                                                                                        Keep loan pending
                                                                                    </button>
                                                                                </>
                                                                            }
                                                                            {status === "DISBURSED"
                                                                                &&
                                                                                <>

                                                                                    <div className="font-bold">
                                                                                        If you approve loan, money will be sent to {staffDetail.lastname}
                                                                                    </div>
                                                                                    <button className="bg-green-800 text-white p-2 rounded-lg text-lg  w-64" onClick={submitStatus}>
                                                                                        Approve loan
                                                                                    </button>
                                                                                </>
                                                                            }
                                                                            {status === "REVIEWING"
                                                                                &&
                                                                                <>
                                                                                    <div className="font-bold">
                                                                                        You can keep loan still in review till you're ready..
                                                                                    </div>
                                                                                    <button className="bg-purple-800 text-white text-white p-2 rounded-lg text-lg w-64" onClick={submitStatus}>
                                                                                        Reviewing loan
                                                                                    </button>
                                                                                </>
                                                                            }
                                                                            {status === "REJECTED"
                                                                                &&
                                                                                <>
                                                                                    <div className="font-bold">
                                                                                        Do you really want to reject the loan approval?
                                                                                    </div>
                                                                                    <button className="bg-red-800 text-white p-2 rounded-lg text-lg  w-64" onClick={submitStatus}>
                                                                                        Reject loan
                                                                                    </button>
                                                                                </>
                                                                            }
                                                                        </div>

                                                                    </div>
                                                                }

                                                            </div> :
                                                            <div className="flex p-3 h-full items-center justify-center uppercase tracking-wider text-xl">
                                                                Pick from Loan history
                                                            </div>
                                                        }

                                                    </div>
                                                </div> :
                                                <>
                                                    <div className="mt-6 text-2xl uppercase">
                                                        No loan found for staff
                                                    </div>
                                                    <div>
                                                        When he request for loan from his dashboard, it will be available for accesss..
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div> :
                                    <div className="flex flex-col w-full h-full items-center justify-center  tracking-wider">
                                        <div className="text-2xl">
                                            KINDLY PICK STAFF FROM LIST
                                        </div>
                                        <div>
                                            <p>Let staff check his mail to reset password for access to his dashboard..</p>
                                        </div>
                                        <div>
                                            When you pick a staff, you have access to his loan history..
                                        </div>

                                    </div>


                                }
                            </div>
                        </>

                    </div>

                    :
                    <div className="flex flex-col justify-center items-center w-full h-full tracking-wider">
                        <div className="text-4xl mb-2">
                            NO STAFF FOUND..
                        </div>
                        <div>
                            FEEL FREE TO CREATE STAFFS..
                        </div>

                    </div>

                }
            </div>
        </div >
    )
}
export default StaffList