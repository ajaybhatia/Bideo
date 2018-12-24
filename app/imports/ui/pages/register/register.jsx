import React, { Component } from 'react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

class RegisterComponent extends Component {
  render() {
    const { router } = this.props;

    return (
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
        <div>
          <div>
            <label>Username</label>
            <input type="text" name="username" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" />
          </div>
          <button>Register</button>
          <Link to="/login">Already Regsitered?</Link>
        </div>
      </form>
    );
  }
}

const Register = withTracker(() => {
  return {};
})(RegisterComponent);

export { Register, RegisterComponent };
