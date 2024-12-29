require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;


describe('Validation of Auth Module', () => {
    const username = 'username' + new Date();
    const email = 'email';
    const zipcode = 12312;
    const phone = 'phone';
    const dob = 'dob';
    const password = 'password';

    let cookie;

    it('should not register user with no username', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, zipcode, phone, dob, password })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not register user with no email', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, zipcode, phone, dob, password })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not register user with no zipcode', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, phone, dob, password })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not register user with no phone', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, zipcode, dob, password })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not register user with no dob', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, zipcode, phone, password })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not register user with no password', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, zipcode, phone, dob })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should register user', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, zipcode, phone, dob, password })
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should not register already existing user', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, zipcode, phone, dob, password })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not login user with no username', done => {
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not login user with no password', done => {
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not login not existing user', done => {
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username + '_', password })
        }).then(res => {
            expect(res.status).toEqual(401);
            done();
        });
    });

    it('should not login user with wrong password', done => {
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: password + '_' })
        }).then(res => {
            expect(res.status).toEqual(401);
            done();
        });
    });

    it('should login user', done => {
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }).then(res => {
            cookie = res.headers.get('Set-Cookie');
            return res.json();
        }).then(res => {
            expect(res.username).toEqual(username);
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should not update password with no password', done => {
        fetch(url('/password'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({})
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should update password', done => {
        fetch(url('/password'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ password: password + '_' })
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.password).toEqual(password + '_');
            done();
        });
    });

    it('should logout user', done => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(200);
            done();
        });
    });

    it('should not update password when not logged in', done => {
        fetch(url('/password'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ password })
        }).then(res => {
            expect(res.status).toEqual(401);
            done();
        });
    });

    it('should not logout user when not logged in', done => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(401);
            done();
        });
    });

});