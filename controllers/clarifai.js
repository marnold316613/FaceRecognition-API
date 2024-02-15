const PAT = '65c8452fcbcb43e69dfa5cc7b92133b0';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'marnold316613';       
const APP_ID = 'my-first-application-2c1uk';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    

const clarifaiSetup = (url) => {
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": url
                }
            }
        }
    ]
  });
  return  {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
}


const handleClarifai = (req,res) =>{
const {input} = req.body;

const url="https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs";
const setup=clarifaiSetup(input)
  fetch(url, setup)
  .then( async data => {
    if (data.ok) {
        const response = await data.json();
      //  console.log(response);  
         res.json(response);
     
    }
    else {
      res.status(400).json('Error');
    }
  
    
  })
  .catch(err => {res.status(400).json('Error');
  console.log('clarifai api error',err);
})
}



module.exports = {
  handleClarifai: handleClarifai
};