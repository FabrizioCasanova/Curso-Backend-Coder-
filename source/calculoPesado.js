process.on('message', cantObject => {

    const obj = {

    }

    for (let i = 1; i <= 1000; i++) {

        obj[i] = 0

    }

    if (cantObject.cant !== undefined) {

        for (let i = 1; i <= cantObject.cant; i++) {

            const numeroRandom = Math.floor(Math.random() * 1000 + 1)

            obj[numeroRandom]++

        }

    } else {

        for (let i = 1; i <= 100000000; i++) {

            const numeroRandom = Math.floor(Math.random() * 1000 + 1)

            obj[numeroRandom]++

        }

    }

    process.send(obj)

})