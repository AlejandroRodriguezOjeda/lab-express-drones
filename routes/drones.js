const express = require('express');
const router = express.Router();
const Drone = require("../models/Drone.model.js")

// require the Drone model here

router.get('/drones', (req, res, next) => {
  // Iteration #2: List the drones
  // ... your code here
  Drone.find({}, 'name propellers maxSpeed') 
  .then((drones) => {
    res.render('drones/list', {
      drones: drones, 
    });
  })
  .catch((error) => {
    console.error('Error fetching drones:', error);
   
  });
});


router.get('/drones/create', (req, res, next) => {
  // Iteration #3: Add a new drone
  // ... your code here
  res.render("drones/create-form.hbs")
});

router.post('/drones/create', async (req, res, next) => {
  // Iteration #3: Add a new drone
  // ... your code here
  try {
    const { name, propellers, maxSpeed } = req.body;

  
    if (name === '' || propellers === '' || maxSpeed === '') {
      return res.status(400).render('drones/create-form', {
        errorMessage: 'All fields are required',
        previousFormData: req.body 
      });
    }

    if (name.length <= 3) {
      return res.status(400).render('drones/create-form', {
        errorMessage: 'Name must have more than 3 characters',
        previousFormData: req.body
      });
    }

   
    const newDrone = new Drone({ name, propellers, maxSpeed });
    await newDrone.save();

    res.redirect('/drones'); 
  } catch (error) {
    console.error('Error creating drone:', error);
  
    res.status(500).render('drones/create-form', {
      errorMessage: 'Error creating drone.'
    });
  }

});

router.get('/drones/:id/edit', async (req, res, next) => {
  // Iteration #4: Update the drone
  // ... your code here

  try {
    const drone = await Drone.findById(req.params.id);
    res.render('drones/update-form.hbs', { drone });
  } catch (error) {
    next(error);
  }


  
});

router.post('/drones/:id/edit', async (req, res, next) => {
  // Iteration #4: Update the drone
  // ... your code here
  const { name, propellers, maxSpeed } = req.body;

  try {
    await Drone.findByIdAndUpdate(req.params.id, {
      name: name,
      propellers: propellers,
      maxSpeed: maxSpeed,
    });
    res.redirect('/drones');
  } catch (error) {
    next(error);
  }
 
});

router.post('/drones/:id/delete', async (req, res, next) => {
  // Iteration #5: Delete the drone
  // ... your code here
  try{
await Drone.findByIdAndDelete(req.params.id)
res.redirect("/drones")
  } catch(error){
    next(error)
  }
});

module.exports = router;
