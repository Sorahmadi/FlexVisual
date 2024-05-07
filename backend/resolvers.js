const dbRtns = require("./dbroutines");
const {
  stepscoll,
  caloriescoll,
  userscoll,
  subscriptioncoll,
  workoutcoll,
  completedworkoutcoll,
  exercisecoll,
} = require("./config");
const { ObjectId } = require("mongodb");

const resolvers = {
  /*
    Steps Resolvers
  */
  getStepsForUser: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(
      db,
      stepscoll,
      { user_id: new ObjectId(args.user_id) },
      {}
    );
  },

  addSteps: async (args) => {
    let db = await dbRtns.getDBInstance();
    let steps = {
      user_id: new ObjectId(args.user_id),
      amount: args.amount,
      date: args.date,
    };
    let results = await dbRtns.addOne(db, stepscoll, steps);
    return results.acknowledged ? steps : null;
  },

  updateSteps: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.updateOne(
      db,
      stepscoll,
      {
        _id: new ObjectId(args._id),
      },
      {
        amount: args.amount,
      }
    );
  },

  /*
    Calories Resolvers
  */
  getAllCalories: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, caloriescoll, {}, {});
  },
  getCaloriesForUser: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userCriteria = {
      user_id: new ObjectId(`${args.user_id}`),
    };
    return await dbRtns.findAll(db, caloriescoll, userCriteria, {});
  },
  getAllSteps: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, stepsscoll, {}, {});
  },
  getStepsForUser: async (args) => {
    console.log(args);
    let db = await dbRtns.getDBInstance();
    let userCriteria = {
      user_id: new ObjectId(`${args.user_id}`),
    };
    return await dbRtns.findAll(db, stepscoll, userCriteria, {});
  },
  addCalories: async (args) => {
    let db = await dbRtns.getDBInstance();
    let calories = {
      user_id: new ObjectId(`${args.user_id}`),
      amount: args.amount,
      date: args.date,
    };
    let results = await dbRtns.addOne(db, caloriescoll, calories);
    return results.acknowledged ? calories : null;
  },
  updateCalories: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.updateOne(
      db,
      caloriescoll,
      {
        _id: new ObjectId(`${args._id}`),
      },
      {
        amount: args.amount,
        date: args.date,
      }
    );
  },
  deleteCalories: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.deleteMany(db, caloriescoll, {
      user_id: new ObjectId(`${args.user_id}`),
      date: args.date,
    });
  },
  getSubscribers: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subCriteria = {
      username: args.username,
    };
    return await dbRtns.findAll(db, subscriptioncoll, subCriteria, {});
  },

  /*
    Users Resolvers
  */
  getAllUsers: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, userscoll, {}, {});
  },
  getUserByUsernamePassword: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userCriteria = {
      username: args.username,
      password: args.password,
    };
    return await dbRtns.findAll(db, userscoll, userCriteria, {});
  },
  getUserByID: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userCriteria = {
      _id: new ObjectId(`${args.user_id}`),
    };
    return await dbRtns.findOne(db, userscoll, userCriteria, {});
  },
  addUser: async (args) => {
    let db = await dbRtns.getDBInstance();
    let user = {
      username: args.username,
      password: args.password,
      first: args.first,
      last: args.last,
      stepsgoal: args.stepsgoal,
    };
    let results = await dbRtns.addOne(db, userscoll, user);
    return results.acknowledged ? user : null;
  },
  updateUser: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.updateOne(
      db,
      userscoll,
      {
        _id: new ObjectId(`${args._id}`),
      },
      {
        username: args.username,
        password: args.password,
        first: args.first,
        last: args.last,
        stepsgoal: args.stepsgoal,
        weight: args.weight,
        height: args.height,
      }
    );
  },

  /*
    Subscription Resolvers
  */
  addSubscription: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subscription = {
      firstname: args.firstname,
      lastname: args.lastname,
      address: args.address,
      email: args.email,
      username: args.username,
      amount: args.amount,
    };
    console.log(subscription);

    let results = await dbRtns.addOne(db, subscriptioncoll, subscription);
    console.log(results);
    return results.acknowledged ? subscription : null;
  },

  deleteSubscription: async (args) => {
    let db = await dbRtns.getDBInstance();
    let deleteOne = {
      username: args.username,
    };

    return await dbRtns.deleteOne(db, subscriptioncoll, deleteOne);
  },

  /*
    Workout Resolvers
  */
  getWorkoutByShareCode: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findOne(
      db,
      workoutcoll,
      { sharecode: args.sharecode },
      {}
    );
  },
  addWorkout: async (args) => {
    let db = await dbRtns.getDBInstance();
    let exercisesIDArray = [];
    args.exercises.forEach((id) => {
      exercisesIDArray.push(new ObjectId(`${id}`));
    });

    let subscribersIDArray = [];
    args.subscribers.forEach((id) => {
      subscribersIDArray.push(new ObjectId(`${id}`));
    });
    let workout = {
      createdby: new ObjectId(`${args.user_id}`),
      subscribers: subscribersIDArray,
      type: args.type,
      name: args.name,
      description: args.description,
      exercises: exercisesIDArray,
    };
    let results = await dbRtns.addOne(db, workoutcoll, workout);
    return results.acknowledged ? workout : null;
  },
  updateWorkout: async (args) => {
    let db = await dbRtns.getDBInstance();
    let exercisesIDArray = [];
    args.exercises.forEach((id) => {
      exercisesIDArray.push(new ObjectId(`${id}`));
    });

    let subscribersIDArray = [];
    args.subscribers.forEach((id) => {
      subscribersIDArray.push(new ObjectId(`${id}`));
    });
    return await dbRtns.updateOne(
      db,
      workoutcoll,
      {
        _id: new ObjectId(`${args._id}`),
      },
      {
        subscribers: subscribersIDArray,
        name: args.name,
        description: args.description,
        exercises: exercisesIDArray,
      }
    );
  },
  addShareCode: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.updateOne(
      db,
      workoutcoll,
      {
        _id: new ObjectId(`${args._id}`),
      },
      {
        sharecode: args.sharecode,
      }
    );
  },
  subscibeToWorkout: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subscribersIDArray = [];
    args.subscribers.forEach((id) => {
      subscribersIDArray.push(new ObjectId(`${id}`));
    });
    return await dbRtns.updateOne(
      db,
      workoutcoll,
      {
        _id: new ObjectId(`${args.workout_id}`),
      },
      {
        subscribers: subscribersIDArray,
      }
    );
  },
  getPresetWorkouts: async (args) => {
    let db = await dbRtns.getDBInstance();
    let workoutCriteria = {
      type: "Preset",
    };
    return await dbRtns.findAll(db, workoutcoll, workoutCriteria, {});
  },
  getUserWorkouts: async (args) => {
    let db = await dbRtns.getDBInstance();
    let workoutCriteria = {
      createdby: new ObjectId(`${args.user_id}`),
    };
    return await dbRtns.findAll(db, workoutcoll, workoutCriteria, {});
  },
  getSubscribedWorkouts: async (args) => {
    let db = await dbRtns.getDBInstance();
    let workoutCriteria = {
      subscribers: new ObjectId(`${args.user_id}`),
    };
    return await dbRtns.findAll(db, workoutcoll, workoutCriteria, {});
  },
  deleteWorkoutByID: async (args) => {
    let db = await dbRtns.getDBInstance();
    let deleteOne = {
      _id: new ObjectId(`${args._id}`),
    };
    return await dbRtns.deleteOne(db, workoutcoll, deleteOne);
  },

  /*
    Exercise Resolvers
  */
  addExercise: async (args) => {
    let db = await dbRtns.getDBInstance();
    let exercise = {
      createdby: new ObjectId(`${args.user_id}`),
      type: args.type,
      name: args.name,
      description: args.description,
      muscleGroup: args.muscleGroup,
      reps: args.reps,
      weight: args.weight,
    };
    let results = await dbRtns.addOne(db, exercisecoll, exercise);
    return results.acknowledged ? exercise : null;
  },
  updateExercise: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.updateOne(
      db,
      exercisecoll,
      {
        _id: new ObjectId(`${args._id}`),
      },
      {
        name: args.name,
        description: args.description,
        muscleGroup: args.muscleGroup,
        reps: args.reps,
        weight: args.weight,
      }
    );
  },
  getPresetExercises: async () => {
    let db = await dbRtns.getDBInstance();
    let exerciseCriteria = {
      type: "Preset",
    };
    return await dbRtns.findAll(db, exercisecoll, exerciseCriteria, {});
  },
  getUserExercises: async (args) => {
    let db = await dbRtns.getDBInstance();
    let exerciseCriteria = {
      createdby: new ObjectId(`${args.user_id}`),
    };
    return await dbRtns.findAll(db, exercisecoll, exerciseCriteria, {});
  },

  /*
    Completed Workouts
  */
  addCompletedWorkout: async (args) => {
    let db = await dbRtns.getDBInstance();
    let completedWorkout = {
      user_id: new ObjectId(`${args.user_id}`),
      workout_id: new ObjectId(`${args.workout_id}`),
      datecompleted: args.datecompleted,
    };
    let results = await dbRtns.addOne(
      db,
      completedworkoutcoll,
      completedWorkout
    );
    return results.acknowledged ? completedWorkout : null;
  },
  getUserCompletedWorkouts: async (args) => {
    let db = await dbRtns.getDBInstance();
    let completedWorkoutCriteria = {
      user_id: new ObjectId(`${args.user_id}`),
    };
    return await dbRtns.findAll(
      db,
      completedworkoutcoll,
      completedWorkoutCriteria,
      {}
    );
  },
};

module.exports = { resolvers };
