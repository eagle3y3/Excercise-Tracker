const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Names = require('./models/names');
const descOfExcer = require('./models/exercise');
const portNumber = process.env.PORT || '3001';



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/exercisetracker', { useNewUrlParser: true });

app.get('/', (req, res) => {
  res.sendFile("views/index.html")
});

app.listen(portNumber, (req, res) => {
  console.log(`We're live at ${portNumber}!`)
});

//post data in database
app.post("/exercise/new-user", async (req, res) => {
  const { name } = req.body;
  console.log({ name });
  if (name === "") {
    res.json("Please enter username.");
  }
  const arrayquer = await Names.find({ username: name });
  console.log(arrayquer);
  if (arrayquer.length != 0) {
    res.json({ error: "User name already taken" });
  } else {
      let use;
      use = await Names.create ({
      username : name
    });
    res.json({
      username: use.username,
      id: use._id
    });
  }
});

//show all registered userSchema
app.get("/api/exercise/users", async (req,res) => {
  const arrayquer = await Names.find();
  res.json(arrayquer);
});


//add exercises
app.post("/api/exercise/add", async (req, res) => {
  const { exerciseId, exerciseName, exerciseDuration, exerciseDate } = req.body;
  if (exerciseName === "") {
    res.json("You didn't fill the name of exercise.")
  } else if(exerciseDuration === "") {
    res.json("You did not fill the duration of exercise")
  } else if(Number.isInteger(parseInt(exerciseDuration)) === false){
    res.json("Please insert a integer number in duration");
  } else {
    const arrayquer = await Names.find({ _id: exerciseId });


    //Before registering, search the database for possible matches.
    //If found(valid id), create a model and insert into the database.
    if (arrayquer.length != 0) {
      const name = arrayquer[0].username;
      const id = arrayquer[0]._id;

      if (exerciseDate === "") {
        //format the date to fit into the patterns of the exercises
        //otherwise make a default date
        let dateString;
        dateString = new Date().toUTCString();
        dateString = dateString
          .split(" ")
          .slice(0, 4)
          .join(" ");
        //*******/
        let exercise;
        exercise = await descOfExcer.create({
          username: name,
          description: exerciseName,
          duration: exerciseDuration,
          userId: id,
        });

        res.json({
          username: name,
          description: exerciseName,
          _id: id
        });
      } else {
        //Format the date to fit into patterns of the exercise
        //use the inserted date on body.param
        let dateString;
        dateString = new Date(exerciseDate).toUTCString()
        dateString = dateString
          .split(" ")
          .slice(0, 4)
          .join(" ")
        if (dateString === "Invalid Date") {
          res.json({error: "Invalid Date"})
        } else {
          await descOfExcer.create({
            username: name,
            description: exerciseName,
            duration: exerciseDuration,
            userId: id,
            date: dateString
          });

          res.json ({
            username: name,
            description: exerciseName,
            duration: exerciseDuration,
            _id: id,

          });
        }
      }
    } else {
      res.json({ error : "This id does not exist in database"});
    }
  }
});

//Query information about the users
app.get("api/exercise/log?", async (req, res) => {
  const { userid } = req.query;
  const { fromdate } = req.query;
  const { todate } = req.query;
  const { limit } = req.query;

  //Query who will be done
  const arrayquer = await descOfExcer.find({userId : userid});
  if(arrayquer.length != 0) {
    const arrayquerytest = await descOfExcer
      .find({userId: userid})
      .select("-_id description duration date");

    if(fromdate == undefined || todate == undefined) {
      let arrfinal;
      arrfinal = arrayquerytest;
    } else {
      const objfromdate = new Date(fromdate);
      const objtodate = new Date(todate);

      if (objfromdate === "Invalid Date" || objtodate === "Invalid Date") {
        res.json({error: "Invalid format of Date"});
      } else {
        function filterByDate (obj) {
          if(objfromdate < obj.date && obj.date < objtodate) {
            return true;
          } else {
            return false;
          }
        }
        let arrfinal;
        arrfinal = arrayquerytest.filter(filterByDate)
      }
    }
    //optional limit filtering
    console.log(limit);
    if (limit !== undefined) {
      arrfinal = arrayqueryteste.slice(0, limit);
    }

    //Create objects with the attributes
    let result;
    result = {
      _id : arrayquer[0].userId,
      username: arrayquer[0].username,
      count: arrfinal.length,
      log: arrfinal
    }
    res.json({result});
  } else {
    res.json("Unknown ID")
  }
});

app.use((req, res, next) => {
  res.json({status: 404, message: "not found"});
});
