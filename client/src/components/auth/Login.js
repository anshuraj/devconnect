import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loginUser } from '../../actions/authActions';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  onChangeInput = e => this.setState({[e.target.name]: e.target.value});

  onFormSubmit = (e) => {
    e.preventDefault();

    const { email, password } = this.state;
    const userData = {
      email,
      password,
    };

    this.props.loginUser(userData);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Log In</h1>
                <p className="lead text-center">Sign in to your DevConnector account</p>
                <form onSubmit={this.onFormSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      className={`form-control form-control-lg${errors.email ? ' is-invalid' : ''}`}
                      placeholder="Email Address"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChangeInput}
                    />
                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={`form-control form-control-lg${errors.password ? ' is-invalid' : ''}`}
                      placeholder="Confirm Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChangeInput}
                    />
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                  </div>
                  <input type="submit" className="btn btn-info btn-block mt-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(mapStateToProps, { loginUser })(withRouter(Login));