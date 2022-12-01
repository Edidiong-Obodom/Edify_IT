const mongoose = require('mongoose');
const dayJs = require('dayjs');
const userSchema = new mongoose.Schema({
    name: {type: String,
      required: [true, 'the name field is empty!']
    },
    email: {type: String,
      required: [true, 'the email field is empty!']
    },
    message: {type: String,
      required: [true, 'the message field is empty!']
    },
    createdOn: {
        type: Date,
        immutable: true,
        default: () => dayJs()
    }

  });

module.exports  = mongoose.model('User', userSchema);