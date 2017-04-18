import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { Template } from 'meteor/templating';
import { createContainer } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { ACCountryProfiles } from 'meteor/accesscheck-data';

checkNpmVersions({
  'react': '15.x',
}, 'theme-in-country');

const React = require('react');

Template.ThemeInCountryWidget.helpers({
  BarCollectionContainer() { return BarCollectionContainer; }
});

class Bar extends React.Component {
  constructor(props) {
    super(props);
  }

  ticks() {
    let cells = [];
    const numTicks = this.props.ticks.length,
          numCells = numTicks - 1;
    const lastSelected = this.props.ticks[numTicks - 1] === this.props.selected;

    for (let i = 0; i < numCells; i++) {
      const isLastCell = i === numCells - 1,
            name = this.props.ticks[i],
            isSelected = (name === this.props.selected) ||
              (isLastCell && lastSelected);
      cells.push(
        <td className={"bar-container" + (isSelected ? ' selected' : '') +
          (isLastCell && lastSelected ? ' last-selected' : '')}
          style={{width: (95 / numTicks) + '%'}} key={name}>
          <div className="bar">
            { isSelected &&
            <span className={"marker" + (lastSelected ? ' marker-right' : '')}>
              {this.props.marker}
            </span>
            }
          </div>
        </td>
      );
    };
    return cells;
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
  render() {
    if (this.props.loading) {
      return <p>Loading...</p>;
    }
    return (
    <div>
      <h1>Internet Filtering {this.props.showCountry && <small>{this.props.country}</small>}</h1>
      <table className="bar-collection">
        <thead>
          <tr>{this.xlabels()}</tr>
        </thead>
        <tbody>
          {this.bars()}
        </tbody>
      </table>
    </div>
  );}
}

BarCollection.propTypes = {
  loading: React.PropTypes.bool,
  profileExists: React.PropTypes.bool,
  xs: React.PropTypes.array,
  ys: React.PropTypes.array,
  selected: React.PropTypes.object,
  marker: React.PropTypes.node,
  country: React.PropTypes.string,
  showCountry: React.PropTypes.bool,
};

const BarCollectionContainer = createContainer((args) => {
  const profileHandle = Meteor.subscribe('ac.countryProfile', _.pick(args, 'countryCode')),
        loading = !profileHandle.ready(),
        profile = ACCountryProfiles.findOne({ country_code: args.countryCode }),
        profileExists = !loading && !!profile,
        xs = ['None', 'Suspected', 'Selective', 'Substantial', 'Pervasive'],
        ys = profileExists ? profile.themes : [],
        selected = (profileExists ?
            _.object(profile.theme_statuses.map((st) => [st.theme, st.status])) :
            {}),
        marker = <span className="glyphicon glyphicon-full-dot" aria-hidden="true"></span>,
        country = profileExists ? profile.name : '',
        showCountry = args.showCountry,
        props = { loading, profileExists, xs, ys, selected, marker, country, showCountry };
  return props;
}, BarCollection);
