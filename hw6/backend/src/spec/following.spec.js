require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;


describe('Validation of Following Module', () => {
    const username = 'username' + new Date() + new Date();
    const email = 'email';
    const zipcode = 12312;
    const phone = 'phone';
    const dob = 'dob';
    const password = 'password';

    let cookie;

    it('should register user 1', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username + '1', email, zipcode, phone, dob, password })
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '1');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should register user 2', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username + '2', email, zipcode, phone, dob, password })
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '2');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should register user 3', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username + '3', email, zipcode, phone, dob, password })
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '3');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should login user 1', done => {
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username + '1', password })
        }).then(res => {
            cookie = res.headers.get('Set-Cookie');
            return res.json();
        }).then(res => {
            expect(res.username).toEqual(username + '1');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should follow user 2', done => {
        fetch(url(`/following/${username}2`), {
            method: 'PUT',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '1');
            expect(res.following.length).toEqual(1);
            expect(res.following[0]).toEqual(username + '2');
            done();
        });
    });

    it('should follow user 3', done => {
        fetch(url(`/following/${username}3`), {
            method: 'PUT',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '1');
            expect(res.following.length).toEqual(2);
            expect(res.following[0]).toEqual(username + '2');
            expect(res.following[1]).toEqual(username + '3');
            done();
        });
    });

    it('should not follow user 1', done => {
        fetch(url(`/following/${username}1`), {
            method: 'PUT',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not follow user 2', done => {
        fetch(url(`/following/${username}2`), {
            method: 'PUT',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not follow user 3', done => {
        fetch(url(`/following/${username}3`), {
            method: 'PUT',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not follow user 4', done => {
        fetch(url(`/following/${username}4`), {
            method: 'PUT',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should get followed users', done => {
        fetch(url(`/following`), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '1');
            expect(res.following.length).toEqual(2);
            expect(res.following[0]).toEqual(username + '2');
            expect(res.following[1]).toEqual(username + '3');
            done();
        });
    });

    it('should unfollow user 2', done => {
        fetch(url(`/following/${username}2`), {
            method: 'DELETE',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '1');
            expect(res.following.length).toEqual(1);
            expect(res.following[0]).toEqual(username + '3');
            done();
        });
    });

    it('should unfollow user 3', done => {
        fetch(url(`/following/${username}3`), {
            method: 'DELETE',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '1');
            expect(res.following.length).toEqual(0);
            done();
        });
    });

    it('should not unfollow user 1', done => {
        fetch(url(`/following/${username}1`), {
            method: 'DELETE',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not unfollow user 2', done => {
        fetch(url(`/following/${username}2`), {
            method: 'DELETE',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not unfollow user 3', done => {
        fetch(url(`/following/${username}3`), {
            method: 'DELETE',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should not unfollow user 4', done => {
        fetch(url(`/following/${username}4`), {
            method: 'DELETE',
            headers: { Cookie: cookie }
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

});