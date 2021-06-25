import axios from "axios";
import { useSnackbar } from 'react-simple-snackbar'
import { useState, useEffect } from "react";
import Moment from 'react-moment';
import { usePaystackPayment } from 'react-paystack';


const Staff = ({ history }) => {
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [loans, setLoans] = useState([]);
    const [email, setEmail] = useState("");
    const [staff_id, setStaffId] = useState();
    const [loader, setLoader] = useState(true);
    const [request_amount, setAmount] = useState("");
    const [request_message, setMessage] = useState("");
    const [openSnackbar, closeSnackbar] = useSnackbar();
    const [loanDetail, setLoanDetail] = useState({});

    const config = {
        header: {
            "Content-Type": "application/json",
        },
    };
    const profile = async () => {
        const token = localStorage.getItem("staffAuthToken");
        try {
            const { data } = await axios.post(
                "/api/staff/profile",
                { token },
                config
            );
            if (data.success) {
                setLastname(data.staff.lastname);
                setFirstname(data.staff.firstname);
                setEmail(data.staff.email);
                setStaffId(data.staff._id);
            } else {
                localStorage.removeItem("staffAuthToken");
                history.push("/staff");
            }
        } catch (error) {
            localStorage.removeItem("staffAuthToken");
            history.push("/staff");
        }
    }
    const logout = async () => {
        localStorage.removeItem("staffAuthToken");
        history.push("/staff");
    }

    // const initializePayment = async (loan) => {
    //     setLoanDetail(loan);


    //     const initializePayment = usePaystackPayment(config);
    //     initializePayment(onSuccess, onClose);
    // }

    const PaystackHook = ({ loan }) => {
        const config = {
            reference: (new Date()).getTime(),
            email: email,
            amount: loan.request_amount * 100,
            publicKey: 'pk_test_4a6fbf031c4ed6e9985f1c1eaa5ecaec081c2c80',
            metadata: loan
        };
        const initializePayment = usePaystackPayment(config);
        return (
            <div>
                <button className="p-2 bg-green-800 text-white hover:bg-green-900 hover:shadow" onClick={() => {
                    setLoanDetail(loan);
                    localStorage.setItem("loan", JSON.stringify(loan));
                    initializePayment(onSuccess, onClose)
                }}>Refund Loan</button>
            </div>
        );
    };

    // success response for loan payment
    const onSuccess = (reference) => {
        console.log(reference);
        refundLoan();
    };


    const onClose = () => {

        console.log('closed')
    }

    const fetchLoans = async () => {
        if (loader) {
            console.log(staff_id);
            if (staff_id) {
                try {
                    const { data } = await axios.get(
                        `/api/staff/staffloans/${staff_id}`,
                        config
                    );
                    setLoans(data.loans)
                    setLoader(false);
                } catch (error) {
                    setLoader(false);
                }
            }
        }
    }
    const refundLoan = async () => {
        // console.log(loan, "LOAN")
        let loan = localStorage.loan ? JSON.parse(localStorage.loan) : {};
        setLoader(true);
        try {
            const { data } = await axios.put(
                `/api/staff/paybackloan`,
                { loan_id: loan._id },
                config
            );
            fetchLoans();
            openSnackbar(data.message);
            localStorage.removeItem("loan")
        } catch (error) {
            setLoader(false);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `/api/staff/requestloan`,
                { staff_id, request_amount, request_message },
                config
            );
            setLoader(true);
            fetchLoans();
            openSnackbar(data.message);
        } catch (error) {
            setLoader(false);
        }
    }
    useEffect(() => {
        profile();
        fetchLoans();
        console.log(loans);
    }, [profile, fetchLoans, loans]);
    return (
        <div className="flex w-full flex-col  justify-left ">
            <div className="bg-gray-700 text-white w-full p-2 flex items-center space-x-16">
                <div className="uppercase tracking-widest px-4">
                    Aliyu Company
                </div>
                <div className="tracking-wider px-16">
                    * Staff *
                </div>
                <div className="tracking-wider">
                    Welcome {lastname} {firstname} <span className="px-6">*{email}</span>
                </div>

                <div className="flex-auto flex justify-end px-4">
                    <button className=" p-2 bg-red-600 hover:bg-red-700" onClick={() => logout()}>LogOut</button>
                </div>
            </div>
            <div className="flex w-full">
                <form className="w-1/4 px-4 border-r list" onSubmit={handleSubmit}>
                    <div className="p-4 tracking-wide text-3xl">
                        Send Loan Request
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-1 text-lg" htmlFor="request_amount">
                            How much do you need?
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="request_amount" type="number" placeholder="Enter Amount.."
                            onChange={(e) => setAmount(e.target.value)}
                            value={request_amount}
                            required={true} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-1 text-lg truncate" htmlFor="request_message">
                            Give a reason why you needed loan?
                        </label>
                        <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="request_message" type="text" placeholder="Share your intentions.."
                            onChange={(e) => setMessage(e.target.value)}
                            value={request_message}
                            required={true}
                        >
                        </textarea>
                    </div>

                    <div >
                        <button type="submit" className="bg-red-600 text-white w-full p-3 m-3 hover:bg-red-700">Request for Loan</button>
                    </div>

                </form>
                <div className="w-1/2 flex flex-col px-4">
                    <div className="p-4 tracking-wide text-4xl">
                        Loan History
                    </div>

                    {(loans && loans.length > 0) ?
                        <div className="w-full loan-list">
                            {loans.map(loan => (
                                <div key={loan._id} className={`p-4 border-2 m-2
                                            ${loan.status === "PENDING" && 'bg-yellow-200'}
                                            ${loan.status === "REVIEWING" && 'bg-purple-200'}
                                            ${loan.status === "DISBURSED" && 'bg-green-200'}
                                            ${loan.status === "REFUNDED" && 'bg-white'}
                                            `}>
                                    <div className="flex justify-between">
                                        <small className="tracking-wide">You requested for loan <Moment fromNow>{loan.request_date}</Moment></small>
                                        <div className="flex flex-col">
                                            {loan.sent_date &&
                                                <small className="tracking-wide">Loan was sent  <Moment fromNow>{loan.sent_date}</Moment></small>
                                            }
                                            {loan.status === "REFUNDED" &&
                                                <small className="tracking-wide">Loan was refunded  <Moment fromNow>{loan.refunded_date}</Moment></small>
                                            }
                                        </div>
                                    </div>
                                    <div className="">
                                        Amount you requested = &#8358;{loan.request_amount}
                                    </div>
                                    <div>
                                        <div className="p-2 bg-gray-200">
                                            {loan.request_message}
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold pt-1">
                                        Loan status = {loan.status}
                                    </div>
                                    {loan.status === "DISBURSED" &&
                                        <div className="mt-2">
                                            <PaystackHook loan={loan} />
                                            {/* <button onClick={() => initializePayment(loan)} className="p-2 bg-green-800 text-white hover:bg-green-900 hover:shadow">Refund Loan</button> */}
                                        </div>
                                    }
                                    {/* {
                                        loan.status === "PENDING" &&
                                        <div className="mt-2">
                                            <button onClick={() => deleteLoan(loan)} className="p-2 bg-red-800 text-white hover:bg-red-900 hover:shadow">Delete Loan</button>
                                        </div>
                                    } */}

                                </div>
                            ))}
                        </div>
                        :
                        <div>

                        </div>}
                </div>
            </div>
        </div>
    )
}
export default Staff