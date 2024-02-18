const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const jobOfferSchema = new mongoose.Schema({
  companyName: String,
  email: String,
  position: String,
  experience: String,
  education: String,
  description: String,
  address: String,
});

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);

module.exports = JobOffer;
