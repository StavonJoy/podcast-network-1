import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { NavigationBar } from 'shoutem.navigation';
import { Screen, Spinner, ScrollView } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import {
  getAppId,
  getExtensionSettings,
} from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { loginRequired } from '../loginRequired';
import RegisterForm from '../components/RegisterForm';
import AppleSignInButton from '../components/AppleSignInButton';
import FacebookButton from '../components/FacebookButton';

import { ext } from '../const';
import { getErrorCode, getErrorMessage } from '../errorMessages';
import {
  register,
  userRegistered,
  getAccessToken,
  loginWithFacebook,
} from '../redux';
import { saveSession } from '../session';
import HorizontalSeparator from '../components/HorizontalSeparator';

const AUTH_ERROR = 'auth_auth_notAuthorized_userAuthenticationError';

export class RegisterScreen extends PureComponent {
  static propTypes = {
    register: PropTypes.func,
    manualApprovalActive: PropTypes.bool,
    loginWithFacebook: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    autoBind(this);

    this.state = {
      inProgress: false,
    };
  }

  handleRegistrationSuccess({ payload }) {
    const {
      access_token,
      userRegistered,
    } = this.props;

    saveSession(JSON.stringify({ access_token }));
    userRegistered(payload);

    this.setState({ inProgress: false });
  }

  handleRegistrationFailed({ payload }) {
    const { manualApprovalActive } = this.props;
    const { response } = payload;

    this.setState({ inProgress: false });

    const code = _.get(response, 'errors[0].code');
    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    if (code === AUTH_ERROR && manualApprovalActive) {
      Alert.alert(
        I18n.t(ext('manualApprovalTitle')),
        I18n.t(ext('manualApprovalMessage')),
      );
    } else {
      Alert.alert(I18n.t(ext('registrationFailedErrorTitle')), errorMessage);
    }
  }

  performRegistration(email, username, password) {
    this.setState({ inProgress: true });

    this.props
      .register(email, username, password)
      .then(this.handleRegistrationSuccess)
      .catch(this.handleRegistrationFailed);
  }

  render() {
    const { inProgress } = this.state;
    const { settings, style } = this.props;

    const isFacebookAuthEnabled = _.get(settings, 'providers.facebook.enabled');
    const isAppleAuthEnabled = _.get(settings, 'providers.apple.enabled');
    const platformVersion = parseInt(Platform.Version, 10);
    const isEligibleForAppleSignIn =
      isAppleAuthEnabled && Platform.OS === 'ios' && platformVersion >= 13;

    if (inProgress) {
      return (
        <Screen>
          <NavigationBar title={I18n.t(ext('registerNavBarTitle'))} />
          <Spinner styleName="xl-gutter-top" />
        </Screen>
      );
    }

    return (
      <Screen style={style.registerScreenMargin}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <NavigationBar title={I18n.t(ext('registerNavBarTitle'))} />
          <RegisterForm onSubmit={this.performRegistration} />

          {(isEligibleForAppleSignIn || isFacebookAuthEnabled) && (
            <HorizontalSeparator />
          )}

          {isEligibleForAppleSignIn && (
            <AppleSignInButton
              onLoginFailed={this.handleRegistrationFailed}
              onLoginSuccess={this.handleRegistrationSuccess}
            />
          )}

          {isFacebookAuthEnabled && (
            <FacebookButton
              onLoginFailed={this.handleRegistrationFailed}
              onLoginSuccess={this.handleRegistrationSuccess}
            />
          )}
        </ScrollView>
      </Screen>
    );
  }
}

export const mapDispatchToProps = {
  register,
  userRegistered,
  loginWithFacebook,
};

function mapStateToProps(state) {
  return {
    user: state[ext()].user,
    appId: getAppId(),
    access_token: getAccessToken(state),
    settings: getExtensionSettings(state, ext()),
  };
}

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('RegisterScreen'))(RegisterScreen)),
  false,
);

