import React, { Component } from 'react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

class RegisterComponent extends Component {
  render() {
    const { router } = this.props;

    return (
      <div style={{ marginTop: '25%' }}>
        <h2 className="text-center">Bideo <small>A Video Calling App</small></h2>
        <div className="col-sm-4 col-md-4 col-lg-4 mx-auto">
          <form onSubmit={e => {
            e.preventDefault();
            Accounts.createUser({
              username: e.target.username.value,
              password: e.target.password.value
            }, error => {
              if (error) console.log(error.reason);
              else router.push('/');
            });
          }}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" className="form-control" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
            <Link to="/login" className="float-right">Already Regsitered?</Link>
          </form>
        </div>
      </div>
    );
  }
}

const Register = withTracker(() => {
  return {};
})(RegisterComponent);

export { Register, RegisterComponent };
