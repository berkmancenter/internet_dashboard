AccountsTemplates.configure({
  enablePasswordChange: true,
  showForgotPasswordLink: true,
});

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: SimpleSchema.RegEx.Email,
      errStr: 'Invalid email',
  },
  pwd
]);

AccountsTemplates.configureRoute('signIn', {
    name: 'sign-in',
    template: 'Account',
    path: '/accounts/sign-in',
});
AccountsTemplates.configureRoute('signUp', {
    name: 'sign-up',
    template: 'Account',
    path: '/accounts/sign-up',
});
AccountsTemplates.configureRoute('forgotPwd', {
    name: 'forgot-password',
    template: 'Account',
    path: '/user/forgot-password',
});
AccountsTemplates.configureRoute('resetPwd', {
    name: 'reset-password',
    template: 'Account',
    path: '/user/reset-password',
});
AccountsTemplates.configureRoute('changePwd', {
    name: 'change-password',
    template: 'Account',
    path: '/user/change-password',
});
AccountsTemplates.configureRoute('enrollAccount', {
    name: 'enroll-account',
    template: 'Account',
    path: '/user/enroll-account',
});
AccountsTemplates.configureRoute('verifyEmail', {
    name: 'verify-email',
    template: 'Account',
    path: '/user/verify-email',
});
AccountsTemplates.configureRoute('resendVerificationEmail', {
    name: 'resend-verificiation-email',
    template: 'Account',
    path: '/user/resend-verification',
});
