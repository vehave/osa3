require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
      
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => { 
    Person.findById(request.params.id)
    .then(person => {  
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
    const aika = new Date().toLocaleString()
    Person.countDocuments().then((docs) =>{
        res.send(`Phonebook has info for ${docs} people <br/>${aika}`)})
    
    
    
})

app.delete('/api/persons/:id', (request, response, next) => {
    
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
    
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: body.number })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(request.body)
    if (body.name===undefined) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (body.number===undefined) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }
  
    const person = new Person ({
        name: body.name,
        number: body.number, 
    })
  
    person
    .save()
    .then(savedPerson => savedPerson.toJSON())    
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    }) 
         
    .catch(error => next(error)) 
})
    


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
  
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
