const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))



let persons = [  
    {    
        id: 1,    
        name: "Arto Hellas",   
        number: "040-123456" 
    },  
    {    
        id: 2,    
        name: "Ada Lovelace",   
        number: "39-44-5323523" 
    },  
    {    
        id: 3,    
        name: "Dan Abrahamov",   
        number: "12-55-7777777" 
    }, 
    {    
        id: 4,    
        name: "Mary Poppendieck",   
        number: "11-11-1111111" 
    }
]

const date = Date.now()

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    const aika = new Date().toLocaleString();
    res.send(`Phonebook has info for ${persons.length} people <br/>${aika}`)
    
})
      
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {    
        console.log(person)
        response.json(person)  
    } else {    
        response.status(404).end()  
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    const exist = persons.find(person => person.name === body.name)

    if(exist){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }

  
    const person = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: body.name,
        number: body.number, 
    }
  
    persons = persons.concat(person)
    
    response.json(person)

  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
