const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();


mongoose.connect('mongodb://localhost:27017/RestDB');

app.use(bodyParser.urlencoded({extended:true}));

const ApiSchema = new mongoose.Schema({
    title:String,
    description:String
})


const ApiModel = new mongoose.model('Api',ApiSchema);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'\\index.html')
})




app.route('/api/jokes')
.get((req,res)=>{
    ApiModel.find((err,result)=>{
        if(!err){
            if(result.length === 0){
                res.send("OOps there is no data to show Please add data and try again..")
            }else{
                res.send(result)
            }
       
        }
        else{
            res.send("oops something fishy...")
        }
    })
})


.post((req,res)=>{
    const Api1 = new ApiModel({
     title: req.body.title,
     description: req.body.description
    })
    Api1.save((err,result)=>{
        if(!err){
            res.send('Successfully added to Database...')
        }
    })
})

.delete((req,res)=>{
    ApiModel.deleteMany({},(err)=>{
        if(!err){
            res.send("Successfully deleted from Database....")
        }
    })
});


app.route('/api/jokes/:topic')
.get((req,res)=>{
    const parameter = req.params.topic;
    ApiModel.findOne({title:parameter},(err,result)=>{
        if(result){
            res.send(result);
        }
        else{
            res.send("Not Found");
        }

    })
})
.put((req,res)=>{
    ApiModel.findOneAndUpdate({title:req.params.topic},
        {title:req.body.title,description:req.body.description},
        {overwrite:true},
        (err)=>{
            if(!err){
                res.send("Successfully Updated ....")
            }
            else{
                res.send("!something went wrong Please try again later...")
            }
        }
        )
})

.patch((req,res)=>{
        ApiModel.findOneAndUpdate({title:req.params.topic},
            {$set:req.body},
            (err,result)=>{
                if(!err){
                    res.send("Successfully Updated ....")
                }
                else{
                    res.send("!something went wrong Please try again later...")
                }
            })
})

.delete((req,res)=>{
    ApiModel.deleteOne({title:req.params.topic},(err)=>{
        if(!err){
            res.send("Successfully Deleted From Database...")
        }
        else{
            res.send("!something went wrong Please try again later...")
        }
    })  
})

app.listen(3000,()=>{
    console.log('server started on port 3000');
})


