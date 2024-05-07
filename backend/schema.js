const { buildSchema } = require("graphql");

const schema = buildSchema(`
type Query {
    getAllUsers: [User]
    getUserByUsernamePassword(username: String, password: String): [User]
    getUserByID(user_id: ID): User
    getAllCalories: [Calories],
    getAllSteps: [Steps],
    getCaloriesForUser(user_id: ID): [Calories],
    getStepsForUser(user_id: ID): [Steps],
    getUserWorkouts(user_id: ID): [Workouts],
    getUserExercises(user_id: ID): [Exercises],
    getPresetExercises: [Exercises],
    getPresetWorkouts: [Workouts],
    getWorkoutByShareCode(sharecode: String): Workouts
    getSubscribedWorkouts(user_id: ID): [Workouts],
    getSubscribers(username: String) : [Subscription]
    getUserCompletedWorkouts(user_id: ID): [CompletedWorkouts],
}

type User {
    _id: ID
    username: String
    password: String
    first: String
    last: String
    stepsgoal: Int
    weight: Float
    height: String
}
   
type Calories {
    _id: ID
    user_id: ID
    amount: Int
    date: String
}

type Steps {
    _id: ID
    user_id: ID
    amount: Int
    date: String
}

type Subscription {
    _id: ID
    firstname: String
    lastname: String
    address: String
    email: String
    username: String
    amount: Float
}

type Exercises {
    _id: ID
    createdby: ID
    type: String
    name: String
    description: String
    muscleGroup: String
    reps: Int
    weight: Float
}

type Workouts {
    _id: ID
    createdby: ID
    subscribers: [ID]
    type: String
    name: String
    description: String
    exercises: [ID]
    sharecode: String
}

type CompletedWorkouts {
    _id: ID
    user_id: ID
    workout_id: ID
    datecompleted: String 
}



type Mutation {
    addUser(username: String, password: String, first: String, last: String, stepsgoal: Int): User
    updateUser(_id: ID, username: String, password: String, first: String, last: String, stepsgoal: Int, weight: Float, height: String): User
    addCalories(user_id: ID, amount: Int, date: String): Calories
    updateCalories(_id: ID,  amount: Int, date: String): Calories
    deleteCalories(user_id: ID, date: String): Calories
    addSteps(user_id: ID, amount: Int, date: String): Steps
    updateSteps(_id: ID, amount: Int): Steps
    addSubscription(_id: ID, 
        firstname: String, 
        lastname: String, 
        address: String, 
        email: String,
        username: String,  
        amount: Float): Subscription
    addWorkout(user_id: ID, subscribers: [ID], type: String, name: String, description: String, exercises: [ID]): Workouts
    addCompletedWorkout(user_id: ID, workout_id: ID, datecompleted: String): CompletedWorkouts
    updateWorkout(_id: ID, subscribers: [ID], name: String, description: String, exercises: [ID]): Workouts
    deleteWorkoutByID(_id: ID): Workouts
    addShareCode(_id: ID, sharecode: String): Workouts
    subscibeToWorkout(workout_id: ID, subscribers: [ID]): Workouts
    addExercise(user_id: ID, type: String, name: String, description: String, muscleGroup: String, reps: Int, weight: Float): Exercises
    updateExercise(_id: ID, name: String, description: String, muscleGroup: String, reps: Int, weight: Float): Exercises
    deleteSubscription(username:String): Subscription
}
`);

module.exports = { schema };
