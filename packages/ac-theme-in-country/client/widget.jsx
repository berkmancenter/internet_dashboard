import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { Template } from 'meteor/templating';
import { createContainer } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';

checkNpmVersions({
  'react': '15.x',
  'simpl-schema': '0.2.x'
}, 'theme-in-country');

const React = require('react');
const SimpleSchema = require('simpl-schema').default;

Template.ThemeInCountryWidget.helpers({
  BarCollection() { return BarCollection; },
  props() {
    const profileHandle = Meteor.subscribe('themeInCountry.countryProfile',
        this.country.code);
    const loading = !profileHandle.ready();
    const profile = CountryProfile.findOne(this.country.code);
    const profileExists = !loading && !!profile;
    const xs = ['None', 'Suspected', 'Selective', 'Substantial', 'Pervasive'];
    const ys = profileExists ? profile.themes : [];
    const selected = profileExists ? _.object(profile.theme_statuses.map((st) => [st.theme, st.status])) : {};
    const marker = '◉';
    const props = { loading, profileExists, xs, ys, selected, marker,
    component: BarCollection };
    return props;
  }
});

const CountryProfile = new Mongo.Collection('profiles');
CountryProfile.attachSchema = new SimpleSchema({
  "country_code": String,
  "name": String,
  /*
  "status_code_counts": { type: Object, blackbox: true },
  "mean_timings": { type: Object, blackbox: true },
  "confidence_histograms": { type: Object, blackbox: true },
  "category_confidence_histograms": { type: Object, blackbox: true },
  "down_classifier_counts": { type: Object, blackbox: true },
  */
  "themes": [String],
  "theme_statuses": { type: Array },
  "theme_statuses.$": { type: Object, blackbox: true }
});

class Bar extends React.Component {
  constructor(props) {
    super(props);
    this.ticks = this.ticks.bind(this);
    this.tickWidth = this.tickWidth.bind(this);
  }
  tickWidth(i, len) {
    if (i == len - 1) { return 0; }
    return 100 / len;
  }

  ticks() {
    return this.props.ticks.map((name, i, a) =>
      <td className={"bar-container " + (this.props.selected == name ? 'selected' : '')}
        style={{width: this.tickWidth(i, a.length) + '%'}} key={name}>
          <div className="bar">
            {this.props.selected == name &&
              <span className="marker">{this.props.marker}</span>}&nbsp;
          </div>
      </td>
    )
  }

  render() {
    return (
      <tr>
        <td className="bar-label">{this.props.name}</td>
        {this.ticks()}
      </tr>
    );
  }
}

class BarCollection extends React.Component {
  constructor(props) {
    super(props);
    this.bars = this.bars.bind(this);
    this.xlabels = this.xlabels.bind(this);
  }

  bars() {
    return this.props.ys.map((label) =>
      <Bar name={label} ticks={this.props.xs} key={label}
        selected={this.props.selected[label]} marker={this.props.marker}/>
    );
  }
  xlabels() {
    return this.props.xs.map((label) =>
      <th className="x-label" key={label}>{label}</th>
    )
  }
  render() { return (
    <table className="bar-collection">
      <thead>
        <tr><th></th>{this.xlabels()}</tr>
      </thead>
      <tbody>
        {this.bars()}
      </tbody>
    </table>
  );}
}

BarCollection.propTypes = {
  loading: React.PropTypes.bool,
  profileExists: React.PropTypes.bool,
  xs: React.PropTypes.array,
  ys: React.PropTypes.array,
  selected: React.PropTypes.object,
  marker: React.PropTypes.node,
};
