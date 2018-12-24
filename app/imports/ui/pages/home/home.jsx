import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { VideoCallServices } from 'meteor/elmarti:video-chat';

class HomeComponent extends Component {
  state = {
    status: ''
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
  }

  componentDidMount() {
    VideoCallServices.onRecieveCall = userId => {
      const user = Meteor.users.findOne(userId);
      this.setState({ status: `Recieving call from ${user.username}` });
    }

    VideoCallServices.onTargetAccept = () => {
      this.setState({ status: 'Target Accepted' });
    }

    VideoCallServices.onTerminateCall = () => {
      this.setState({ status: 'Call terminated' });
    };

    VideoCallServices.onCallRejected = () => {
      this.setState({ status: 'Call rejected' });
    };

    VideoCallServices.setOnError(err => {
      console.error(err);
      this.setState({ status: err });
    });
  }

  render() {
    const { loading, users } = this.props;
    const { status } = this.state;

    return (
      <div>
        <div>
          <ul>
            {!loading && users.map(user =>
              <li key={user._id}>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    VideoCallServices.call({
                      id: user._id,
                      localElement: document.querySelector('#localVideo'),
                      remoteElement: document.querySelector('#remoteVideo'),
                      video: true,
                      audio: true
                    });

                    this.setState({ status: `Calling ${user.username}` });
                  }}>
                  {user.username}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div>
          {status}
        </div>

        <div>
          <button onClick={() => {
            VideoCallServices.answerCall({
              localElement: document.querySelector("#localVideo"),
              remoteElement: document.querySelector("#remoteVideo"),
              video: true,
              audio: true
            });

            this.setState({ status: 'Connected' });
          }}>Answer</button>
          <button onClick={() => {
            VideoCallServices.rejectCall();
            this.setState({ status: 'Call Rejected' });
          }}>Reject</button>
        </div>

        <div>
          <button onClick={() => {
            VideoCallServices.endCall();
            this.setState({ status: 'Call ended' });
          }}>End Call</button>
        </div>

        <div>
          <video id="localVideo"></video>
          <div>
            Local
          </div>
        </div>

        <div>
          <video id="remoteVideo"></video>
          <div>
            Remote
          </div>
        </div>
      </div>
    );
  }
}

const Home = withTracker(() => {
  const handle = Meteor.subscribe('users');

  const users = handle.ready() && Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch();
  const loading = !handle.ready();

  return {
    loading,
    users,
  };
})(HomeComponent);

export { Home, HomeComponent };
