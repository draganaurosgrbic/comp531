require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;


describe('Test Cases from Assignment Rubric', () => {
    const username = 'testUser' + new Date();
    const password = '123';
    const text = 'text';
    const headline = 'headline';

    let cookie;
    let pid;

    it('should register user', done => {
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email: 'foo@bar.com', zipcode: 12345, phone: '123-456-7890', dob: '128999122000', password })
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.result).toEqual('success');
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

    it('should create article', done => {
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ text })
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(1);
            expect(res.articles[0].author).toEqual(username);
            expect(res.articles[0].text).toEqual(text);
            done();
        });
    });

    it('should get articles', done => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(1);
            expect(res.articles[0].author).toEqual(username);
            expect(res.articles[0].text).toEqual(text);
            pid = res.articles[0].pid;
            done();
        });
    });

    it('should get user articles', done => {
        fetch(url(`/articles/${username}`), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(1);
            expect(res.articles[0].pid).toEqual(pid);
            expect(res.articles[0].author).toEqual(username);
            expect(res.articles[0].text).toEqual(text);
            done();
        });
    });

    it('should get article', done => {
        fetch(url(`/articles/${pid}`), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(1);
            expect(res.articles[0].pid).toEqual(pid);
            expect(res.articles[0].author).toEqual(username);
            expect(res.articles[0].text).toEqual(text);
            done();
        });
    });

    it('should get default headline', done => {
        fetch(url(`/headline/${username}`), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.headline).toEqual('Default headline');
            done();
        });
    });

    it('should update headline', done => {
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ headline })
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.headline).toEqual(headline);
            done();
        });
    });

    it('should get headline', done => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.headline).toEqual(headline);
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

});