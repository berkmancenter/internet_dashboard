dispatch:tabular-job-collection
===============

A Meteor package that makes it simple to render tables for admins to monitor and modify `vsivsi:job-collection` jobs. This package simply wraps `aldeed:tabular` defining the columns for you, including a column with buttons for Delete, Retry, etc.

## Installation

```bash
$ meteor add dispatch:tabular-job-collection
```

## Usage

In common code, define your tables:

```js
TabularJobCollections({
  taskQueue: {
    sub: new SubsManager(),
    collection: TaskQueue,
    allow: function (userId) {
      var role = new Roles.User(userId);
      return role.is(Roles.ADMIN);
    }
  }
});
```

You can set up multiple tables for different JobCollections in the same call. The key is the table name, e.g., `taskQueue` in the example above. `collection` must be a JobCollection. For all other available options, refer to [aldeed:tabular documentation](https://github.com/aldeed/meteor-tabular).

Now include your table anywhere in your client markup, as described in the `aldeed:tabular` documentation:

```
{{> tabular table=TabularJobCollections.taskQueue class="table table-hover"}}
```

## Security

By default anyone can call the server methods that the table buttons call to delete, retry, etc. the jobs. You can secure them by overriding the `TabularJobCollections.authenticateMethods` function in your server code.

```js
TabularJobCollections.authenticateMethods = function (userId) {
  // Look up role or something to return true or false
};
```
