import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import LoanList from './LoanList';
import StaffList from './StaffList';

const Admin = ({ history }) => {
    const logout = () => {
        localStorage.removeItem("adminAuthToken");
        history.push("/admin");
    }
    return (
        <div className="flex w-full justify-center items-center ">
            <div className="w-full">
                <div className="w-full bg-gray-700 flex items-center text-white space-x-4 p-2 fixed top-0 bg-white z-50">
                    <div className="uppercase tracking-widest px-4">
                        Aliyu Company
                    </div>
                    <div className="tracking-wider px-16">
                        * Admin *
                    </div>

                    <NavLink to="/admin/staffs" className="px-2 py-1 border-b-4 border-red-400" activeClassName="text-gray-900 bg-green-600 text-white " >Staffs</NavLink>
                    <NavLink to="/admin/loans" className="px-2 py-1 border-b-4 border-red-400" activeClassName="text-gray-900 bg-green-600 text-white ">Loans</NavLink>
                    <div className="flex-auto flex justify-end px-4">
                        <button className=" p-2 bg-red-600 hover:bg-red-700" onClick={() => logout()}>LogOut</button>
                    </div>
                </div>
                <div className="relative overflow-hidden">
                    <Switch>
                        <Route path="/admin/loans" exact component={LoanList} />
                        <Route path="/admin/staffs" exact component={StaffList} />
                    </Switch>
                </div>
            </div>

        </div>
    )
}
export default Admin