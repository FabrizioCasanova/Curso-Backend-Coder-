import chai from "chai";
import supertest from "supertest";

const expect = chai.expect
const request = supertest("http://localhost:8080")

describe('Tester de todo mi servidor', () => {

    
    describe('Testeo de productos', () => {

        it("El endpoint utilizado en la request deberia crear un producto en la base de datos correctamente", async () => {
            const product = {
                nombre: "PlayStation",
                marca: "Sony",
                precio: "25000",
                stock: "30",

            }

            const response = await request.post('/form').send(product)
            expect(response.header).to.have.property('vary')
        })

    })

    describe('Testeo de usuarios', () => {

        it("El endpoint utilizado en la request deberia crear un usuario en la base de datos correctamente", async () => {
            const userCreate = {
                nombre: "Juan Martin",
                apellido: "Lanatta",
                email: "Correolanas@correo.com",
                password: "Lanasbutin"
            }
            
            const response = await request.post('/api/sessions/register')
            .field('nombre', userCreate.nombre)
            .field('apellido', userCreate.apellido)
            .field('email', userCreate.email)
            .field('password', userCreate.password)
            .attach('image', './test/1675204271391-Antonio.webp')

            expect(response.status).to.be.eql(200)
            expect(response._body).to.have.property('payload')
        })

    })

    describe('Testeo de Login', async () => {
        it("El endpoint utilizado en la request deberia loguear a un usuario registrado en la base de datos", async () => {

            let cookieName

            const userLog = {
                email: "fabri.casanova@outlook.com",
                password: "123"
            }            

            const response = await request.post('/api/sessions/login').send(userLog)
            const cookie = response.headers['set-cookie'][0]

            cookieName = {
                nombre: cookie.split('=')[0]
            }

            expect(cookieName.nombre).to.be.eql("connect.sid")
        })
    })

})