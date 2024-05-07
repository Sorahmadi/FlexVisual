const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  atlas: process.env.DBURL,
  appdb: process.env.DB,
  stepscoll: process.env.STEPSCOLLECTION,
  caloriescoll: process.env.CALORIESCOLLECTION,
  stepsscoll: process.env.STEPSCOLLECTION,
  userscoll: process.env.USERSCOLLECTION,
  subscriptioncoll: process.env.SUBSCRIPTIONCOLLECTION,
  workoutcoll: process.env.WORKOUTCOLLECTION,
  completedworkoutcoll: process.env.COMPLETEDWORKOUTCOLLECTION,
  exercisecoll: process.env.EXERCISECOLLECTION,
  port: process.env.PORT,
  graphql: process.env.GRAPHQLURL,
};
