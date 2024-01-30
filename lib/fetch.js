import contractData from "../contractData.json"

export const registration = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
                login: props.login,
                email: props.email,
                password: props.password,
                referrer: props.referrer,
                lang: props.lang
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during registration: ", error)
        return null
    }
}

export const login = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
                email: props.email,
                password: props.password
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during login: ", error)
        return null
    }
}

export const loginWithAddress = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/loginWithAddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
                address: props.address
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during login: ", error)
        return null
    }
}

export const getreferrer = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/getreferrer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				referrer: props.referrer
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during login: ", error)
        return null
    }
}

export const getAddress = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/getaddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during address: ", error)
        return null
    }
}

export const getAddressEmail = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/getaddressemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				email: props.email
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during address: ", error)
        return null
    }
}

export const setAddress = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/setaddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				email: props.email,
                address: props.address
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during login: ", error)
        return null
    }
}

export const buy = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid,
                hash: props.hash
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during buy: ", error)
        return null
    }
}

export const withdraw = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid,
                hash: props.hash
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during withdraw: ", error)
        return null
    }
}

export const setPurpose = async (props) => {

    try {
        const request = await fetch(process.env.ROUTE_URI + '/setpurpose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid,
                purpose: props.purpose
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during buy: ", error)
        return null
    }
}

export const getToSideNav = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/gettosidenav', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during data: ", error)
        return null
    }
}

export const getPersonalData = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/getpersonaldata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during data: ", error)
        return null
    }
}

export const getStructureData = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/getstructuredata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during data: ", error)
        return null
    }
}

export const getWalletData = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/getwalletdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during data: ", error)
        return null
    }
}

export const activitybutton = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/activitybutton', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid,
                text: props.text
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during login: ", error)
        return null
    }
}

export const sendCode = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/sendcode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				email: props.email
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during sendcode: ", error)
        return null
    }
}

export const changePassword = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				uid: props.uid,
                code: props.code,
                password: props.password
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during change password: ", error)
        return null
    }
}

export const getLanguage = async (props) => {
    try {
        const request = await fetch(contractData.backend + '/api/lang/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                SERVICE_AUTH_TOKEN: "token", //process.env.AUTH_KEY,
				catId: props.catId,
                lang: props.lang
            })
        })
        return await request.json()
    } catch (error) {
        console.log("Error during lang: ", error)
        return null
    }
}

export const isLogin = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/islogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				login: props.login
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during change password: ", error)
        return null
    }
}

export const isEmail = async (props) => {
    try {
        const request = await fetch(process.env.ROUTE_URI + '/isemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*"
            },
            body: JSON.stringify({
                key: process.env.AUTH_KEY,
				email: props.email
            })
        })

        return await request.json()
    } catch (error) {
        console.log("Error during change password: ", error)
        return null
    }
}

export const sendMessage = async (props) => {
    const formData = new FormData()
    formData.append('photo', props.photo)
    try {
        const request = await fetch('https://api.telegram.org/bot6874972753:AAEFH15rKw4fNjo-DG3BWkO1mLWgGEG-FMI/sendPhoto?chat_id=358929635&caption=' + props.caption, {
            method: 'POST',
            headers: {
                "Accept": "*/*"
            },
            body: formData
        })
        const request2 = await fetch('https://api.telegram.org/bot6874972753:AAEFH15rKw4fNjo-DG3BWkO1mLWgGEG-FMI/sendPhoto?chat_id=-1002137923236&caption=' + props.caption, {
            method: 'POST',
            headers: {
                "Accept": "*/*"
            },
            body: formData
        })

        return await request.json()
    } catch (error) {
        console.log("Error during send: ", error)
        return null
    }
}