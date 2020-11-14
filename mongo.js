const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const nameAdd = process.argv[3]
const numberAdd = process.argv[4]

const url =
  `mongodb+srv://vehave:${password}@cluster0.c2b1t.mongodb.net/persons?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: nameAdd,
  number: numberAdd,
  
})
if(process.argv[3] === undefined){
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  
} else {
  
  person.save().then(result => {
    
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}




