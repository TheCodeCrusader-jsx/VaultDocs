const mongoose = require('mongoose');

const isPDF = (v) => /\.pdf$/.test(v);

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: props => `${props.value} is not a valid name. Only letters and spaces are allowed.`,
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address.`,
    },
  },
  documents: {
    aadhar: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
    pan: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
    passport: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
    license: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
    resume: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
    voterid: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
    marksheet: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
    bank: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
    other: [{
      type: String,
      validate: {
        validator: isPDF,
        message: props => `${props.value} is not a valid PDF file.`,
      }
    }],
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Verified', 'Rejected'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Document', documentSchema);
