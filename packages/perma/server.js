_.extend(Settings, {
  apiUrl: 'https://api.perma.cc/v1/public/archives/',
  image: {
    dims: { width: 200, height: 150 },
    format: 'png'
  },
  thumbDir: process.env.PWD + '/public/tmp/',
  requestProtocol: 'http',
  timeout: 20 * 1000,
  publishLimit: 15,
});

var Future = Npm.require('fibers/future');
var url = Npm.require('url');

if (Settings.fetchLimit) {
  Settings.apiUrl += '?limit=' + Settings.fetchLimit;
}

var request = Npm.require('request');
var gm = Npm.require('gm');

var archiveExists = function(archive) {
  return PermaArchives.find({ "guid": archive.guid }).count() > 0;
};

var dumpArchive = function(archive) {
  if (archiveExists(archive)) { return; }
  var screenshot = _.findWhere(archive.captures,
      { role: 'screenshot', status: 'success' });
  if (!screenshot) { return; }
  var screenshotUrl = Settings.requestProtocol + ':' + screenshot.playback_url;
  var req = request(screenshotUrl, { timeout: Settings.timeout });
  var filename = archive.guid + '.' + Settings.image.format;
  var image = gm(req, filename)
    .resize(Settings.image.dims.width)
    .crop(Settings.image.dims.width, Settings.image.dims.height, 0, 0);
  archive.thumb_url = Meteor.absoluteUrl('tmp/' + filename);
  archive.creation_timestamp =
    moment(archive.creation_timestamp).utcOffset(moment().utcOffset()).toDate();
  archive.hostname = url.parse(archive.url).hostname;

  try {
    Future.wrap(image.write.bind(image))(Settings.thumbDir + filename).wait();
    PermaArchives.insert(archive);
  } catch (error) {
    console.error('Perma: Error saving archive');
    console.error(error);
  }
};

var fetchData = function() {
  console.log('Perma: Fetching data');
  var response = Future.wrap(HTTP.get)(
      Settings.apiUrl, { timeout: Settings.timeout} ).wait();
  var archives = response.data.objects;
  var futures = [];
  _.each(archives, function(archive) {
    futures.push(dumpArchive.future()(archive));
  });
  Future.wait(futures);
  console.log('Perma: Fetched data');
}.future();

fetchData();
Meteor.setInterval(fetchData, Settings.updateEvery);

Meteor.publish('perma_archives', function() {
  return PermaArchives.find({},
      { limit: Settings.publishLimit, sort: { creation_timestamp: -1 }});
});
