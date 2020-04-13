const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoos.Types.ObjectID converts stringID to real MongoID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setSpecies = (species) => _.escape(species).trim();
const setColor = (color) => _.escape(color).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  species: {
    type: String,
    required: true,
    trim: true,
    set: setSpecies,
  },

  color: {
    type: String,
    required: true,
    trim: true,
    set: setColor,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  species: doc.species,
  color: doc.color,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name species color').lean().exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
