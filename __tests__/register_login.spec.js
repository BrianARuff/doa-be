const request = require('supertest')
const server = require('../server.js')
const knex = require('knex')
const knexConfig = require('../knexfile.js')
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

beforeEach(async () => {
  await db('users').truncate()
  await db('quiz').truncate()
  await db('celebrity').truncate()
})

  describe('/api/register route', () => {
   it('should return status code 201', async () => {
      let response = await request(server).post('/api/register')
        .send({username: 'user123', password: 'password'})
       expect(response.status).toBe(201)
    })

     it('should return the ID number of the new resource', async () => {
      let response = await request(server).post('/api/register')
        .send({username: 'user', password: 'password'})
       expect(response.body[0]).toBe(1)
    })

    it('should return the status 422 if there is a missing username or password', async () => {
      let response = await request(server).post('/api/register')
        .send({username: '', password: ''})
       expect(response.status).toBe(422)
    })

    it('should return a message if there is a duplicate of the username', async () => {
      let fakeUser = await request(server).post('/api/register').send({username: 'foobar', password: '123'})
      let response = await request(server).post('/api/register').send({username: 'foobar', password: '123'})
      expect(response.message).toEqual("There is already a user registered by that name")
    })

    it.skip('should return a jwt so that the user is logged in after ame or password', async () => {
      let response = await request(server).post('/api/register')
        .send({username: 'user', password: 'password'})
       expect(typeof response.token).toBe('string')
    })
  })

  describe('/api/ login route', ()=> {
    it('should return status code 200', async () => {
      const loggedInUser = await request(server).post('/api/register').send({username: 'chad', password: '123'})
      let response = await request(server).post('/api/login')
        .send({username: 'chad', password: '123'})
       expect(response.status).toBe(200)
    })

    it('should return the status 422 if there is a missing username or password', async () => {
      let response = await request(server).post('/api/login')
        .send({username: '', password: ''})
       expect(response.status).toBe(422)
    })

    it('should return a jwt so that the user is logged in', async () => {
      const loggedInUser = await request(server).post('/api/register').send({username: 'chad', password: '123'})
      let response = await request(server).post('/api/login')
        .send({username: 'chad', password: '123'})
       expect(typeof response.body.token).toBe('string')
    })
  })
