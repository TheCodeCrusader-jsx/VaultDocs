const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: props => `${props.value} is not a valid name. Only letters and spaces are allowed.`
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address.`
    }
  },
  docType: {
    type: String,
    required: true,
    enum: ['aadhar', 'pan', 'passport', 'license', 'resume', 'voterid', 'marksheet', 'other'],
    lowercase: true
  },
  filePath: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\.pdf$/.test(v);
      },
      message: props => `${props.value} is not a valid PDF file path.`
    }
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Verified', 'Rejected']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', documentSchema);
