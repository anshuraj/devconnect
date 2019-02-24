import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
  }

  onChangeInput = e => this.setState({[e.target.name]: e.target.value});

  onFormSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, password2 } = this.state;
    const newUser = {
      name,
      email,
      password,
      password2
    };
    
    axios.post('/api/user/register', newUser, {
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(res => console.log(res))
    .catch(err => this.setState({ errors: err.response.data }));
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">Create your DevConnector account</p>
                <form onSubmit={this.onFormSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChangeInput}
                    />
                    {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
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
                      className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChangeInput}
                    />
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={`form-control form-control-lg ${errors.password2 ? 'is-invalid' : ''}`}
                      placeholder="Confirm Password"
                      name="password2"
                      value={this.state.password2}
                      onChange={this.onChangeInput}
                    />
                    {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
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

export default Register;