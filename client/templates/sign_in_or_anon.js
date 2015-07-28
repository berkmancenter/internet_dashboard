Template.SignInOrAnon.events({
  'click #get-started': function(ev, template) {
    template.$('.modal').modal();
  },
  'click .modal a': function(ev, template) {
    // Because the modal was breaking if we navigated before it hid.
    template.$('.modal').modal('hide');
    template.$('.modal').on('hidden.bs.modal', function() {
      Router.go(ev.target.href);
    });
    ev.preventDefault();
  }
});
