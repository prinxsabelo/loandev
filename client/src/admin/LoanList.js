import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import { useSnackbar } from 'react-simple-snackbar'

import { useState, useEffect } from "react";
import Moment from 'react-moment';
import axios from "axios";

const LoanList = ({ history }) => {
    const [loader, setLoader] = useState(true);
    const [loans, setLoans] = useState([]);
    const [status, setStatus] = useState("PENDING");
    const [loan_id, setLoanId] = useState();
    const [openSnackbar, closeSnackbar] = useSnackbar();
    const config = {
        header: {
            "Content-Type": "application/json",
        },
    };
    const fetchLoans = async () => {
        try {
            const { data } = await axios.get(
                "/api/admin/loans",
                config
            );
            console.log(data);
            setLoans(data.loans);
            setLoader(false);
        } catch (error) {

        }
    }
    const handleStatus = (e) => {
        setLoanId(e.target.id);
        setStatus(e.target.value);
    }
    const submitStatus = async () => {

        try {
            const { data } = await axios.put(
                `/api/admin/updateloan/${loan_id}`,
                { status },
                config
            );
            let upLoan = loans[loan_id];
            fetchLoans();
            history.push("/admin/loans");
            openSnackbar(data.message);
        } catch (error) {

        }

    }
    useEffect(() => {
        if (loader) {
            fetchLoans();
        }

    }, [fetchLoans])

    return (
        <div className=" h-screen flex   w-full justify-center">
            <div className="w-9/12 flex flex-col h-full justify-center">
                <div className="text-2xl mb-6 px-2 tracking-wider">
                    Access all loans..
                </div>
                <div className="shadow border-2 h-full w-full loan-list">
                    {(loans.length > 0) ?
                        <div>
                            {loans.map(loan => (
                                <div className={`p-2 m-2 border-2  flex flex-col shadow
                                    ${loan.status === "PENDING" && 'bg-yellow-200 hover:bg-yellow-300'}
                                    ${loan.status === "REVIEWING" && 'bg-purple-200 hover:bg-purple-300'}
                                    ${loan.status === "DISBURSED" && 'bg-green-200 hover:bg-green-300'}
                                    ${loan.status === "REJECTED" && 'bg-red-200 hover:bg-red-300'}
                                    ${loan.status === "REFUNDED" && 'bg-white hover:bg-gray-200'}
                                    `}>
                                    <div className="flex space-x-20 truncate ...">
                                        <div className="w-1/3 truncate">
                                            <div className="text-2xl">
                                                {loan.staff_id.lastname} {loan.staff_id.firstname}
                                            </div>
                                            <div className="text-sm">* {loan.staff_id.email}</div>
                                        </div>
                                        <div className="w-1/4">
                                            <div className="font-bold tracking-wider">
                                                {loan.status}
                                            </div>
                                            <div className="text-base">
                                                Amount Requested = &#8358;{loan.request_amount}
                                            </div>
                                        </div>
                                        <div >
                                            <div className="flex  space-x-6 text-sm">
                                                <div>   Requested for loan <Moment fromNow>{loan.request_date}</Moment></div>
                                                {loan.sent_date &&
                                                    <div>
                                                        loan Sent was sent <Moment fromNow>{loan.sent_date}</Moment>
                                                    </div>
                                                }
                                            </div>
                                            <div className="w-96 mt-2 bg-white p-2 shadow border-2 text-xs tracking-wider" >
                                                {loan.request_message}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {(loan.status === "DISBURSED" || loan.status === "ACCEPTED") &&
                                            <div className="text-xl uppercase p-2">
                                                You approved loan disbursement..
                                            </div>
                                        }
                                        {loan.status === "REJECTED" &&
                                            <div className="text-xl uppercase p-2">
                                                You rejected loan..
                                            </div>
                                        }
                                        {loan.status === "REFUNDED" &&
                                            <div className="text-xl uppercase p-2">
                                                Loan have been refunded
                                            </div>
                                        }
                                        {(loan.status === "PENDING" || loan.status === "REVIEWING") &&
                                            <div>
                                                <select onChange={handleStatus} id={loan._id} >
                                                    <option>
                                                        {loan.status}
                                                    </option>
                                                    <option value="PENDING">PEND LOAN</option>
                                                    <option value="DISBURSED">DISBURSE LOAN</option>
                                                    <option value="REVIEWING">REVIEWING LOAN</option>
                                                    <option value="REJECTED">REJECT LOAN</option>
                                                </select>
                                                <div className="text-base mt-2 flex flex-col space-y-24 justify-center ">

                                                    {(status === "PENDING" && loan._id === loan_id)
                                                        &&
                                                        <>
                                                            <div className="font-bold">
                                                                You can still leave the loan pending..
                                                            </div>

                                                            <button className="bg-yellow-200  p-2 rounded-lg text-lg w-64" onClick={() => submitStatus(loan._id)}>
                                                                Keep loan pending
                                                            </button>
                                                        </>
                                                    }
                                                    {(status === "DISBURSED" && loan._id === loan_id)
                                                        &&
                                                        <>

                                                            <div className="font-bold">
                                                                If you approve loan, money will be sent to  {loan.staff_id.lastname}
                                                            </div>
                                                            <button className="bg-green-800 text-white p-2 rounded-lg text-lg  w-64" onClick={() => submitStatus(loan._id)}>
                                                                Approve loan
                                                            </button>
                                                        </>
                                                    }
                                                    {(status === "REVIEWING" && loan._id === loan_id)

                                                        &&
                                                        <>
                                                            <div className="font-bold">
                                                                You can keep loan still in review till you're ready..
                                                            </div>
                                                            <button className="bg-purple-800 text-white text-white p-2 rounded-lg text-lg w-64" onClick={() => submitStatus(loan._id)}>
                                                                Reviewing loan
                                                            </button>
                                                        </>
                                                    }
                                                    {(status === "REJECTED" && loan._id === loan_id)

                                                        &&
                                                        <>
                                                            <div className="font-bold">
                                                                Do you really want to reject the loan approval?
                                                            </div>
                                                            <button className="bg-red-800 text-white p-2 rounded-lg text-lg  w-64" onClick={() => submitStatus(loan._id)}>
                                                                Reject loan
                                                            </button>
                                                        </>
                                                    }
                                                </div>

                                            </div>
                                        }


                                    </div>
                                </div>
                            ))}
                        </div> :
                        <div className="flex flex-col w-full h-full items-center justify-center">
                            <div className=" text-4xl uppercase">
                                NO loan found..
                            </div>
                            <div className="text-lg mt-5">
                                When staffs have created loan.. You'll see them here..
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default LoanList