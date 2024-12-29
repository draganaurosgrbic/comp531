require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;


describe('Validation of Profile Module', () => {
    const username = 'username' + new Date();
    const password = 'password';
    const profile = {
        email: 'email',
        zipcode: 12312,
        phone: 'phone',
        dob: 'dob',
        headline: 'Default headline',
        avatar: '',
    }
    const profileInformation = ['email', 'zipcode', 'phone', 'headline', 'avatar'];

    let cookie;

    it('should register user 1', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username + '1', email: profile.email + '1', zipcode: profile.zipcode, phone: profile.phone + '1', dob: profile.dob + '1', password: password + '1' })
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
            body: JSON.stringify({ username: username + '2', email: profile.email + '2', zipcode: profile.zipcode, phone: profile.phone + '2', dob: profile.dob + '2', password: password + '2' })
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username + '2');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should login user 1', done => {
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username + '1', password: password + '1' })
        }).then(res => {
            cookie = res.headers.get('Set-Cookie');
            return res.json();
        }).then(res => {
            expect(res.username).toEqual(username + '1');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should get logged in profile information', done => {
        let counter = 0;
        for (const info of profileInformation.concat('dob')) {
            fetch(url(`/${info}`), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', Cookie: cookie }
            }).then(res => res.json()).then(res => {
                expect(res.username).toEqual(username + '1');
                expect(res[info]).toEqual(!['zipcode', 'headline', 'avatar'].includes(info) ? profile[info] + '1' : profile[info]);
                if (++counter === profileInformation.length) {
                    done();
                }
            });
        }
    });

    it('should get profile information', done => {
        let counter = 0;
        for (const info of profileInformation.concat('dob')) {
            fetch(url(`/${info}/${username}2`), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', Cookie: cookie }
            }).then(res => res.json()).then(res => {
                expect(res.username).toEqual(username + '2');
                expect(res[info]).toEqual(!['zipcode', 'headline', 'avatar'].includes(info) ? profile[info] + '2' : profile[info]);
                if (++counter === profileInformation.length) {
                    done();
                }
            });
        }
    });

    it('should not get not existing profile information', done => {
        let counter = 0;
        for (const info of profileInformation.concat('dob')) {
            fetch(url(`/${info}/${username}3`), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', Cookie: cookie }
            }).then(res => {
                expect(res.status).toEqual(400);
                if (++counter === profileInformation.length) {
                    done();
                }
            });
        }
    });

    it('should update profile information', done => {
        let counter = 0;
        for (const info of profileInformation) {
            fetch(url(`/${info}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Cookie: cookie },
                body: JSON.stringify({ [info]: info !== 'zipcode' ? profile[info] + '3' : profile[info] })
            }).then(res => res.json()).then(res => {
                expect(res.username).toEqual(username + '1');
                expect(res[info]).toEqual(info !== 'zipcode' ? profile[info] + '3' : profile[info]);
                if (++counter === profileInformation.length) {
                    done();
                }
            });
        }
    });

    it('should not update profile information with no information', done => {
        let counter = 0;
        for (const info of profileInformation) {
            fetch(url(`/${info}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Cookie: cookie },
                body: JSON.stringify({})
            }).then(res => {
                expect(res.status).toEqual(400);
                if (++counter === profileInformation.length) {
                    done();
                }
            });
        }
    });

});