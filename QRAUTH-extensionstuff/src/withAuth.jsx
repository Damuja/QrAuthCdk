import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
        displayMFA: false,
        MFA_QRCode: null
      };
    }

    componentDidMount() {
      fetch('/checkToken')
        .then(res => {
          if (res.status === 200) {
            res.json().then((data) => {
              this.setState({ loading: false, displayMFA: true, MFA_QRCode: data.QR_URI });
            })
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true, displayMFA: false });
        });
    }


    render() {
      const { loading, redirect, displayMFA } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      if (displayMFA) {
        console.log(this.state.MFA_QRCode)
        return (
          <img src={this.state.MFA_QRCode}></img>
        )
      }
      return <ComponentToProtect {...this.props} />;
    }
  }
}