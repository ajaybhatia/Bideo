import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { VideoCallServices } from 'meteor/elmarti:video-chat';

class HomeComponent extends Component {
  state = {
    status: '',
    statusText: '',
  }

  constructor(props) {
    super(props);

    VideoCallServices.init({
      'iceServers': [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
      ]
    });

    VideoCallServices.onReceiveCall = _id => {
      const user = Meteor.users.findOne(_id);
      this.setState({
        status: 'ringing',
        statusText: `Recieving call from ${user.username}`,
      });
    }

    VideoCallServices.onTargetAccept = () => {
      this.setState({
        status: 'inProgress',
        statusText: 'Target Accepted',
      });
    }

    VideoCallServices.onTerminateCall = () => {
      this.setState({
        status: '',
        statusText: 'Call terminated',
      });
    };

    VideoCallServices.onCallRejected = () => {
      this.setState({
        status: '',
        statusText: 'Call rejected'
      });
    };

    VideoCallServices.setOnError(err => {
      this.setState({
        status: '',
        statusText: err,
      });
    });
  }

  render() {
    const { loading, users } = this.props;
    const { status, statusText } = this.state;

    return (
      <div className="container">
        <div className="mt-5">
          <h3>Available Users</h3>
          <div className="list-group">
            {!loading && users.map(user =>
              <a
                href="#"
                key={user._id}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  VideoCallServices.call({
                    id: user._id,
                    localElement: document.querySelector('#localVideo'),
                    remoteElement: document.querySelector('#remoteVideo'),
                    video: true,
                    audio: true
                  });

                  this.setState({ statusText: `Calling ${user.username}` });
                }}>
                {user.username}
              </a>
            )}
          </div>
        </div>

        {statusText &&
          <div className="row">
            <div className="col-md-6 col-lg-6">
              <div className="alert alert-success mt-5" role="alert">
                {statusText}
              </div>
            </div>
          </div>
        }

        {status === 'ringing' &&
          <div className="row">
            <div className="col-md-6 col-lg-6">
              <button className="btn btn-success" onClick={() => {
                VideoCallServices.answerCall({
                  localElement: document.querySelector("#localVideo"),
                  remoteElement: document.querySelector("#remoteVideo"),
                  video: true,
                  audio: true
                });

                this.setState({ statusText: 'Connected' });
              }}>Answer</button>
              <button className="btn btn-danger float-right" onClick={() => {
                VideoCallServices.rejectCall();
                this.setState({ statusText: 'Call Rejected' });
              }}>Reject</button>
            </div>
          </div>
        }

        {status === 'inProgress' &&
          <div>
            <button className="btn btn-primary" onClick={() => {
              VideoCallServices.endCall();
              this.setState({ statusText: 'Call ended' });
            }}>End Call</button>
          </div>
        }

        <div className="row mt-5">
          <div className="col-12">
            <h5 className="text-center">Local</h5>
            <div style={{ display: 'flex', justifyContent: 'center', }}>
              <video id="localVideo"></video>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <h5 className="text-center">Remote</h5>
            <div style={{ display: 'flex', justifyContent: 'center', }}>
              <video id="remoteVideo"></video>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Home = withTracker(() => {
  const handle = Meteor.subscribe('users');

  const users = handle.ready() && Meteor.users.find({
    _id: {
      $ne: Meteor.userId()
    },
    'status.online': true,
  }).fetch();
  const loading = !handle.ready();

  return {
    loading,
    users,
  };
})(HomeComponent);

export { Home, HomeComponent };
