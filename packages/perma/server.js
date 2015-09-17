_.extend(Settings, {
  apiUrl: 'https://api.perma.cc/v1/public/archives/',
  requestProtocol: 'http',
  publishLimit: 15,
  keepFor: moment.duration({ days: 1 }),
  deleteEvery: moment.duration({ days: 1 }),
  thumbnails: {
    dims: { width: 200, height: 150 },
    format: 'png',
  }
});

var Future = Npm.require('fibers/future');
var url = Npm.require('url');
var gm = Npm.require('gm');

if (Settings.fetchLimit) {
  Settings.apiUrl += '?limit=' + Settings.fetchLimit;
}

var archiveExists = function(archive) {
  return PermaArchives.find({ "guid": archive.guid }).count() > 0;
};

var dumpArchive = function(archive) {
  if (archiveExists(archive)) { return; }
  var screenshot = _.findWhere(archive.captures,
      { role: 'screenshot', status: 'success' });
  if (!screenshot) { return; }
  var screenshotUrl = Settings.requestProtocol + ':' + screenshot.playback_url;

  Thumbnails.insert(screenshotUrl, function(err, fileObj) {
    if (err) {
      console.error('Perma: Error fetching screenshot');
      console.error(err);
    }

    archive.thumb_id = fileObj._id;
    archive.creation_timestamp =
      moment(archive.creation_timestamp).utcOffset(moment().utcOffset()).toDate();
    archive.hostname = url.parse(archive.url).hostname;

    try {
      PermaArchives.insert(archive);
    } catch (error) {
      console.error('Perma: Error saving archive');
      console.error(error);
    }
  });
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

var deleteOldArchives = function() {
  console.log('Perma: Deleting old archives');
  Thumbnails.remove({ uploadedAt: { $lt: moment().subtract(Settings.keepFor) }});
  PermaArchives.remove({ creation_timestamp:
    { $lt: moment().subtract(Settings.keepFor) }});
};

var thumbStore = new FS.Store.FileSystem("perma_thumbnails", {
  path: 'perma/thumbnails',
  transformWrite: function(fileObj, readStream, writeStream) {
    // Thumbnail the screenshots
    gm(readStream, fileObj.name())
      .resize(Settings.thumbnails.dims.width)
      .crop(Settings.thumbnails.dims.width, Settings.thumbnails.dims.height, 0, 0)
      .stream().pipe(writeStream);
  }
});
Thumbnails = new FS.Collection("perma_thumbnails", { stores: [thumbStore] });
Thumbnails.allow({ download: function(userId, fileObj) { return true; } });

fetchData();
Meteor.setInterval(fetchData, Settings.updateEvery);
Meteor.setInterval(deleteOldArchives,
    Settings.deleteEvery.asMilliseconds());

Meteor.publish('perma_archives', function() {
  return PermaArchives.find({},
      { limit: Settings.publishLimit, sort: { creation_timestamp: -1 }});
});
Meteor.publish('perma_thumbnails', function() {
  return Thumbnails.find({},
      { limit: Settings.publishLimit, sort: { uploadedAt: -1 }});
});

