import { BrowserRouter as Router, Switch, } from 'react-router-dom';
import SnackbarProvider from 'react-simple-snackbar'

import Admin from './admin/Admin';
import { Redirect, Route } from 'react-router-dom'
import AdminLogin from './admin/AdminLogin';
import Staff from './staff/Staff';
import StaffLogin from './staff/StaffLogin';
import LoanList from './admin/LoanList';
import StaffList from './admin/StaffList';
import StaffResetPassword from './staff/StaffResetPassword';


function App() {
  const PrivateAdminRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={
          (props) =>
            localStorage.getItem("adminAuthToken") ? (
              <>
                <Redirect to="/admin/staffs" />
                <Component {...props} />
              </>
            ) : (
              <Redirect to="/admin-login" />
            )

        }
      />
    )
  }
  const PrivateStaffRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={
          (props) =>
            localStorage.getItem("staffAuthToken") ? (
              <Component {...props} />
            ) : (
              <Redirect to="/staff-login" />
            )

        }
      />
    )
  }

  return (
    <SnackbarProvider>

      <Router>
        <div className="w-full flex justify-center">
          <Switch>
            <PrivateAdminRoute exact path="/" component={Admin} />
            <PrivateAdminRoute path="/admin/" component={Admin} />
            <Route path="/admin-login" component={AdminLogin} />
            <PrivateStaffRoute path="/staff" component={Staff} />
            <Route path="/staff-login" component={StaffLogin} />
            <Route path="/password-reset/:resetToken" component={StaffResetPassword} />
          </Switch>
        </div>
      </Router>
    </SnackbarProvider>
  );

}

export default App;
