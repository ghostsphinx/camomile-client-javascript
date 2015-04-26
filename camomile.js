// QUICK DOCUMENTATION

// Dealing With Resources (Corpora, Media, Layers, Annotations)

// getResource -- Get one resource
// Parameters: resource_id, callback, history 
//      resource_id: string - resource MongoDB '_id'
//      callback: function(err, data, headers)
//      history: boolean - return resource history

// getResources -- Get several resources
// Parameters: callback, filters, history, returns_id
//      callback: function(err, data, headers)
//      filters: dict - filter resources by field
//      history: boolean - return resource history
//      returns_id: boolean - return resource._id instead of resource

// createResource -- Create one resource
// Parameters: [parent_id,] field-1, ... field-n, callback, returns_id
//      parent_id: string - parent id (e.g. corpus ID for a medium)
//      fields-i: object
//      callback: function(err, data, headers)
//      returns_id: boolean - return resource._id instead of resource

// createResources -- Create several resources at once
// Parameters: [parent_id,] resources, callback, returns_id
//      parent_id: string - parent id (e.g. corpus ID for a medium)
//      resources: list - list of resource objects
//      callback: function(err, data, headers)
//      returns_id: boolean - return resource._id instead of resource

// deleteResource -- Delete one resource
// Parameters: resource_id, callback
//      resource_id: string - resource MongoDB '_id'
//      callback: function(err, data, headers)

// updateResource -- Update one resource:
// Parameters: resource_id, fields, callback
//      resource_id: string - resource MongoDB '_id'
//      fields: dict - update provided fields
//      callback: function(err, data, headers)

// Dealing With Users and Groups
// TODO: write documentation

// Dealing With Queues
// TODO: write documentation

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["fermata"], factory);
  } else if (typeof exports === "object") {
    module.exports = factory(require("fermata"));
  } else {
    root.Camomile = factory(root.fermata);
  }
}(this, function (fermata) {

  "use strict";

  var my = {},
    _api;

  var default_callback = function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // HELPER FUNCTIONS
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var _user = function (id_user) {
    var user = _api('user');
    if (id_user) {
      user = user(id_user);
    }
    return user;
  };

  var _group = function (id_group) {
    var group = _api('group');
    if (id_group) {
      group = group(id_group);
    }
    return group;
  };

  var _corpus = function (id_corpus) {
    var corpus = _api('corpus');
    if (id_corpus) {
      corpus = corpus(id_corpus);
    }
    return corpus;
  };

  var _medium = function (id_medium) {
    var medium = _api('medium');
    if (id_medium) {
      medium = medium(id_medium);
    }
    return medium;
  };

  var _layer = function (id_layer) {
    var layer = _api('layer');
    if (id_layer) {
      layer = layer(id_layer);
    }
    return layer;
  };

  var _annotation = function (id_annotation) {
    var annotation = _api('annotation');
    if (id_annotation) {
      annotation = annotation(id_annotation);
    }
    return annotation;
  };

  var _queue = function (id_queue) {
    var queue = _api('queue');
    if (id_queue) {
      queue = queue(id_queue);
    }
    return queue;
  };

  var _id = function (result) {
    if (Array.isArray(result)) {
      return result.map(function (x) {
        return x._id;
      });
    }
    return result._id;
  };

  var _ID = function (callback) {
    return function (err, data, headers) {
      if (!err) {
        data = _id(data);
      }
      callback(err, data, headers);
    };
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // AUTHENTICATION
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  my.setURL = function (url) {
    _api = fermata.json(url);
    return my;
  };

  my.login = function (username, password, callback) {
    callback = callback || default_callback;

    var data = {};
    data.username = username;
    data.password = password;

    _api('login').post(data, callback);
  };

  my.logout = function (callback) {
    callback = callback || default_callback;

    _api('logout').post({}, callback);
  };

  my.me = function (callback) {
    callback = callback || default_callback;

    _api('me').get(callback);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // USERS
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  my.getUser = function (user, callback) {

    callback = callback || default_callback;

    _user(user).get(callback);
  };

  my.getUsers = function (callback, options) {
    // Available filters: username, role

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var filter = options.filter || {};
    _user()(filter).get(callback);
  };

  my.createUser = function (username, password, description, role, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.username = username;
    data.password = password;
    data.description = description || {};
    data.role = role || 'user';

    _user().post(data, callback);
  };

  my.updateUser = function (user, fields, callback) {
    // Updatable fields: password, description, role

    callback = callback || default_callback;

    fields = fields || {};
    _user(user).put(fields, callback);
  };

  my.deleteUser = function (user, callback) {

    callback = callback || default_callback;

    _user(user).delete(callback);
  };

  my.getUserGroups = function (user, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    _user(user)('group').get(callback);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // GROUPS
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  my.getGroup = function (group, callback) {

    callback = callback || default_callback;

    _group(group).get(callback);
  };

  my.getGroups = function (callback, options) {
    // Available filters: name

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var filter = options.filter || {};

    _group()(filter).get(callback);
  };

  my.createGroup = function (name, description, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.description = description || {};

    _group().post(data, callback);
  };

  my.updateGroup = function (group, fields, callback) {
    // Updatable fields: description

    callback = callback || default_callback;

    fields = fields || {};
    _group(group).put(fields, callback);
  };

  my.deleteGroup = function (group, callback) {

    callback = callback || default_callback;

    _group(group).delete(callback);
  };

  my.addUserToGroup = function (user, group, callback) {

    callback = callback || default_callback;

    _group(group)('user')(user).put(callback);
  };

  my.removeUserFromGroup = function (user, group, callback) {

    callback = callback || default_callback;

    _group(group)('user')(user).delete(callback);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // CORPORA
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Get corpus by ID
  my.getCorpus = function (corpus, callback, options) {

    callback = callback || default_callback;
    options = options || {};

    var filter = {};
    filter.history = options.history || 'off';

    _corpus(corpus)(filter).get(callback);
  };

  // Get list of corpora
  my.getCorpora = function (callback, options) {
    // Available filters: name

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    filter = options.filter || {};
    filter.history = options.history || 'off';

    _corpus()(filter).get(callback);
  };

  my.createCorpus = function (name, description, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.description = description || {};

    _corpus().post(data, callback);
  };

  my.updateCorpus = function (corpus, fields, callback) {
    // Updatable fields: name?, descrption

    callback = callback || default_callback;

    fields = fields || {};
    _corpus(corpus).put(fields, callback);
  };

  my.deleteCorpus = function (corpus, callback) {

    callback = callback || default_callback;

    _corpus(corpus).delete(callback);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // MEDIA
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Get medium by ID
  my.getMedium = function (medium, callback, options) {

    callback = callback || default_callback;
    options = options || {};

    var filter = {};
    filter.history = options.history || 'off';

    _medium(medium)(filter).get(callback);
  };

  // Get medium URL, e.g. for use in <video> src attribute 
  my.getMediumURL = function (medium, format) {

    format = format || 'video';
    return _medium(medium)(format)();
  };

  // Get list of media
  my.getMedia = function (callback, options) {
    // Available filters: corpus, name

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var filter = options.filter || {};
    filter.history = options.history || 'off';

    if (filter.corpus !== undefined) {
      _corpus(filter.corpus)('medium')(filter).get(callback);
    } else {
      _medium()(filter).get(callback);
    }

  };

  my.createMedium = function (corpus, name, url, description, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.url = url;
    data.description = description || {};

    _corpus(corpus)('medium').post(data, callback);

  };

  my.createMedia = function (corpus, media, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    _corpus(corpus)('medium').post(media, callback);
  };

  my.updateMedium = function (medium, fields, callback) {
    // Updatable fields: name?, url, description

    callback = callback || default_callback;

    fields = fields || {};
    _medium(medium).put(fields, callback);
  };

  my.deleteMedium = function (medium, callback) {

    callback = callback || default_callback;

    _medium(medium).delete(medium, callback);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // LAYERS
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Get layer by ID
  my.getLayer = function (layer, callback) {

    callback = callback || default_callback;

    _layer(layer).get(callback);
  };

  // Get list of layers
  my.getLayers = function (callback, options) {
    // Available filters: corpus, name

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var filter = options.filter || {};
    filter.history = options.history || 'off';

    if (filter.corpus !== undefined) {
      _corpus(filter.corpus)('layer')(filter).get(callback);
    } else {
      _layer()(filter).get(callback);
    }

  };

  my.createLayer = function (corpus, name, description, fragment_type, data_type, annotations, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.description = description || {};
    data.fragment_type = fragment_type;
    data.data_type = data_type;
    data.annotations = annotations || [];

    _corpus(corpus)('layer').post(data, callback);

  };

  my.updateLayer = function (layer, fields, callback) {
    // Updatable fields: name?, description, fragment_type, data_type

    callback = callback || default_callback;

    fields = fields || {};
    _layer(layer).put(fields, callback);

  };

  my.deleteLayer = function (layer, callback) {

    callback = callback || default_callback;

    _layer(layer).delete(callback);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ANNOTATIONS
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  my.getAnnotation = function (annotation, callback, options) {

    callback = callback || default_callback;
    options = options || {};

    var filter = {};
    filter.history = options.history || 'off';

    _annotation(annotation)(filter).get(callback);
  };

  my.getAnnotations = function (callback, options) {
    // Available filters: layer, medium

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var filter = options.filter || {};
    filter.history = options.history || 'off';

    if (filter.layer !== undefined) {
      _layer(filter.layer)('annotation')(filter).get(callback);
    } else {
      _annotation()(filter).get(callback);
    }

  };

  my.createAnnotation = function (layer, medium, fragment, data, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var _data = {};
    _data.id_medium = medium;
    _data.fragment = fragment || {};
    _data.data = data || {};

    _layer(layer)('annotation').post(_data, callback);

  };

  my.createAnnotations = function (layer, annotations, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var data = annotations;
    _layer(layer)('annotation').post(data, callback);

  };

  my.updateAnnotation = function (annotation, fields, callback) {
    // Updatable fields: fragment, data

    callback = callback || default_callback;

    fields = fields || {};
    _annotation(annotation).put(fields, callback);

  };

  my.deleteAnnotation = function (annotation, callback) {

    callback = callback || default_callback;

    _annotation(annotation).delete(callback);

  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // RIGHTS
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  my.getCorpusRights = function (corpus, callback) {

    callback = callback || default_callback;

    _corpus(corpus)('ACL').get(callback);

  };

  my.setCorpusRightsForGroup = function (corpus, group, right, callback) {

    callback = callback || default_callback;

    var data = {
      'right': right
    };
    _corpus(corpus)('group')(group).put(data, callback);
  };

  my.removeCorpusRightsForGroup = function (corpus, group, callback) {

    callback = callback || default_callback;

    _corpus(corpus)('group')(group).delete(callback);
  };

  my.setCorpusRightsForUser = function (corpus, user, right, callback) {

    callback = callback || default_callback;

    var data = {
      'right': right
    };
    _corpus(corpus)('user')(user).put(data, callback);
  };

  my.removeCorpusRightsForUser = function (corpus, user, callback) {

    callback = callback || default_callback;

    _corpus(corpus)('user')(user).delete(callback);
  };

  my.getLayerRights = function (layer, callback) {

    callback = callback || default_callback;

    _layer(layer)('ACL').get(callback);

  };

  my.setLayerRightsForGroup = function (layer, group, right, callback) {

    callback = callback || default_callback;

    var data = {
      'right': right
    };
    _layer(layer)('group')(group).put(data, callback);
  };

  my.removeLayerRightsForGroup = function (layer, group, callback) {

    callback = callback || default_callback;

    _layer(layer)('group')(group).delete(callback);
  };

  my.setLayerRightsForUser = function (layer, user, right, callback) {

    callback = callback || default_callback;

    var data = {
      'right': right
    };
    _layer(layer)('user')(user).put(data, callback);
  };

  my.removeLayerRightsForUser = function (layer, user, callback) {

    callback = callback || default_callback;

    _layer(layer)('user')(user).delete(callback);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // QUEUES
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  my.getQueue = function (queue, callback) {

    callback = callback || default_callback;

    _queue(queue).get(callback);

  };

  my.getQueues = function (callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    _queue().get(callback);

  };

  my.createQueue = function (name, description, callback, options) {

    callback = callback || default_callback;
    options = options || {};
    if (options.returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.description = description || {};

    _queue().post(data, callback);

  };

  my.updateQueue = function (queue, fields, callback) {
    // Updatable fields: name, description

    callback = callback || default_callback;

    var data = fields;
    _queue(queue).put(data, callback);

  };

  my.enqueue = function (queue, elements, callback) {

    callback = callback || default_callback;

    var data = elements;
    _queue(queue)('next').put(data, callback);

  };

  my.dequeue = function (queue, callback) {

    callback = callback || default_callback;

    _queue(queue)('next').get(callback);

  };

  my.deleteQueue = function (queue, callback) {

    callback = callback || default_callback;

    _queue(queue).delete(callback);

  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // UTILS
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  my.getDate = function (callback) {
    callback = callback || default_callback;

    _api('date').get(callback);
  };

  return my;

}));