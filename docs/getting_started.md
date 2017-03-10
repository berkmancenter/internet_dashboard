Getting Started
===============

Install Meteor
--------------

Just go to https://www.meteor.com/install and follow the instructions.

Clone the Code
--------------

`git clone https://github.com/berkmancenter/internet_dashboard.git`

Run the Project
---------------

```bash
cd internet_dashboard
meteor
```
Or, to run in data fetch mode (that seeds data in some of the packages):

```bash
cp settings.json.example settings.json
meteor --settings settings.json
``` 

Setup API Access (Optional)
---------------------------

A couple of the services we use to grab data for widgets require an API key. Right now, these widgets are:
 * Chilling Effects
 * Mediacloud

If you want to use either of these widgets, you'll have to do a few things:
 1. Get API keys for each of these services.
 2. Put the API key for each service in `apiKey.txt` in their respective packages. Look for `apiKey.txt.example`.
 3. Add the packages to your Meteor install. This can be done with `meteor add lumen mediacloud`.
 4. Update the widget registry. Uncomment the appropriate lines in `widgets.js`.
 
Create a Widget
---------------

1. Make sure no one else is creating a similar widget by searching through the [issue tracker](https://github.com/berkmancenter/net_dashboard/issues).
2. State your intentions in the issue tracker so no one starts working on the same widget.
3. Fork into your own repo.
4. Read `docs/creating_a_widget.md` to get started creating a widget.
5. Submit a pull request.
