let express = require('express')
let app = express()
require('dotenv').config()
let Opentok = require('opentok')
let apiKey = process.env.API_KEY
let apiSecret = process.env.API_SECRET

let opentok = new Opentok(apiKey,apiSecret)

class Broadcast {
    
    static StartBroadcast(req,res){
        let broadcastOptions = {
            maxDuration : 1740,
            ressolution : '1230x720',
            layout : app.get('layout'),
            output:{
                hls:{}
            }
        }
        opentok.startBroadcast(app.get('sessionId'),broadcastOptions,function (err,broadcast){
            if(err){
                res.status(500).json({msg:err.message})
            }
            app.set('broadcastId',broadcast.id);
            res.status(200).json({broadcast})
        })
    }


    static StopBroadcast(req,res){
        let broadcastId = req.param('broadcastId')
        opentok.stopBroadcast(broadcastId, function (err,broadcast) {
            if(err){
                res.status(500).json({message:`ERROR = ${err.message}`})
            }
            app.set('broadcastId', null)
        })
    }

    static broadcastLayout(req,res){
        let  broadcastId = req.param('broadcastId')
        let type = req.body.type
        app.set('layout',type)
        if (broadcastId) {
            opentok.setBroadcastLayout(broadcastId, type, null, function (err) {
            if (err) {
                res.status(500).json({message:`can't set layout to ${type}`,error:err.message});
            }
                res.status(200).json({message:"OK"});
            });
        }
    }
    
    static broadcast(req,res){
        let broadcastId = app.get('broadcastId')
        opentok.getBroadcast(broadcastId,function(err,broadcast){
            if(err){
                res.status(500).json({message:`Could Not Get Broadcast ${broadcastId}`,err:err.message})
            }
            if(broadcast === 'started'){
                res.redirect(broadcast.broadcastUrls.hls)
            }
            res.status(500).json({message:'Broadcast Not In Progress'})
        })
    }

    static Host (req,res){
        let sessionId = app.get('sessionId')

        var token = opentok.generateToken(sessionId,{
            role:'publisher',
            initialLayoutClassList : ['focus']
        })

        res.status(200).json({
            apiKey:apiKey,
            sessionId:sessionId,
            token:token,
            initialBroadcastId: app.get('broadcastId'),
            focusStreamId: app.get('focusStreamId') || '',
            initialLayout: app.get('layout')
        })
    }

    static Participant () {
        let sessionId = app.get('sessionId')
        let token = opentok.generateToken(sessionId,{
            role:'publisher'
        })
        res.status(200).json({
            apiKey:apiKey,
            sessionId:sessionId,
            token:token,
            focusStreamId: app.get('focusStreamId') || '',
            initialLayout: app.get('layout')
        })
    }

    static Fokus () {
        let otherStreams = req.body.otherStreams;
        let focusStreamId = req.body.focus;
        let classListArray = [] ;
        let i ;

        if(otherStreams){
            for(i = 0; i < otherStreams.lengt; i++){
                classListArray.push({
                    id:otherStreams[i],
                    layoutClassList:[]
                })
            }
        }
        classListArray.push({
            focusStreamId,
            layoutClassList:['focus']
        })
        app.set('focusStreamId',focusStreamId)
        opentok.setStreamClassList(app.get(sessionId), classListArray, function(err){
            if(err){
                res.status(500).json({message:`ERROR = Could not set class lists. ${err.message}`})
            }
            res.status(200).json({message:"OK"})
        })
    }
}

module.exports = Broadcast