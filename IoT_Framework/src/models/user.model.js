const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs'); 

const UserSchema = new Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

UserSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
};

UserSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.checkPassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
          reject(err);
        } else {
          resolve(isMatch);
        }
      });
    });
  };

module.exports = mongoose.model('User', UserSchema);
