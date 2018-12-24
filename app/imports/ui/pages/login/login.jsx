import React, { Component } from 'react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

class LoginComponent extends Component {
  render() {
    const { router } = this.props;

    return (
      <form onSubmit={e => {
        e.preventDefault();
        Meteor.loginWithPassword(e.target.username.value, e.target.password.value, error => {
          if (error) console.log(error.reason);
          else router.push('/');
        })
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
          <button>Login</button>
          <Link to="/register">Not Regsitered?</Link>
        </div>
      </form>
    );
  }
}

const Login = withTracker(() => {
  return {};
})(LoginComponent);

export { Login, LoginComponent };
