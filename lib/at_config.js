AccountsTemplates.configure({
  enablePasswordChange: true,
  showForgotPasswordLink: true,
  defaultLayout: 'ApplicationLayout',
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
    path: '/users/sign-in',
});
AccountsTemplates.configureRoute('signUp', {
    name: 'sign-up',
    template: 'Account',
    path: '/users/sign-up',
});
AccountsTemplates.configureRoute('forgotPwd', {
    name: 'forgot-password',
    template: 'Account',
    path: '/users/forgot-password',
});
AccountsTemplates.configureRoute('resetPwd', {
    name: 'reset-password',
    template: 'Account',
    path: '/users/reset-password',
});
AccountsTemplates.configureRoute('changePwd', {
    name: 'change-password',
    template: 'Account',
    path: '/users/change-password',
});
AccountsTemplates.configureRoute('enrollAccount', {
    name: 'enroll-account',
    template: 'Account',
    path: '/users/enroll-account',
});
AccountsTemplates.configureRoute('verifyEmail', {
    name: 'verify-email',
    template: 'Account',
    path: '/users/verify-email',
});
AccountsTemplates.configureRoute('resendVerificationEmail', {
    name: 'resend-verificiation-email',
    template: 'Account',
    path: '/users/resend-verification',
});
