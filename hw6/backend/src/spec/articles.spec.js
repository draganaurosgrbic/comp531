require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;


describe('Validation of Articles Module', () => {
    const username = 'username' + new Date() + new Date() + new Date();
    const email = 'email';
    const zipcode = 12312;
    const phone = 'phone';
    const dob = 'dob';
    const password = 'password';
    const text = 'text';

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

    it('should create article 1', done => {
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ text: text + '1' })
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(1);
            expect(res.articles[0].author).toEqual(username + '1');
            expect(res.articles[0].text).toEqual(text + '1');
            done();
        });
    });

    it('should create article 2', done => {
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ text: text + '2' })
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(2);
            expect(res.articles[0].author).toEqual(username + '1');
            expect(res.articles[0].text).toEqual(text + '2');
            expect(res.articles[1].text).toEqual(text + '1');
            done();
        });
    });

    it('should login user 2', done => {
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username + '2', password })
        }).then(res => {
            cookie = res.headers.get('Set-Cookie');
            return res.json();
        }).then(res => {
            expect(res.username).toEqual(username + '2');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should create article 3', done => {
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ text: text + '3' })
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(1);
            expect(res.articles[0].author).toEqual(username + '2');
            expect(res.articles[0].text).toEqual(text + '3');
            done();
        });
    });

    it('should login user 1 again', done => {
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

    it('should create article 4', done => {
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ text: text + '4' })
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(4);
            expect(res.articles[0].author).toEqual(username + '1');
            expect(res.articles[0].text).toEqual(text + '4');
            expect(res.articles[1].text).toEqual(text + '3');
            expect(res.articles[2].text).toEqual(text + '2');
            expect(res.articles[3].text).toEqual(text + '1');
            done();
        });
    });

    it('should not create article with no text', done => {
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({})
        }).then(res => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('should get articles', done => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(4);
            expect(res.articles[0].author).toEqual(username + '1');
            expect(res.articles[0].text).toEqual(text + '4');
            expect(res.articles[1].text).toEqual(text + '3');
            expect(res.articles[2].text).toEqual(text + '2');
            expect(res.articles[3].text).toEqual(text + '1');

            let counter = 0;
            const articles = res.articles;
            for (const article of articles) {
                fetch(url(`/articles/${article.pid}`), {
                    method: 'GET',
                    headers: { Cookie: cookie }
                }).then(res => res.json()).then(res => {
                    expect(res.articles.length).toEqual(1);
                    expect(res.articles[0].pid).toEqual(article.pid);
                    expect(res.articles[0].author).toEqual(article.author);
                    expect(res.articles[0].text).toEqual(article.text);
                    expect(res.articles[0].date).toEqual(article.date);
                    if (++counter === articles.length) {
                        done();
                    }
                });
            }
        });
    });

    it('should get user 1 articles', done => {
        fetch(url(`/articles/${username}1`), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(3);
            expect(res.articles[0].author).toEqual(username + '1');
            expect(res.articles[0].text).toEqual(text + '4');
            expect(res.articles[1].text).toEqual(text + '2');
            expect(res.articles[2].text).toEqual(text + '1');

            let counter = 0;
            const articles = res.articles;
            for (const article of articles) {
                fetch(url(`/articles/${article.pid}`), {
                    method: 'GET',
                    headers: { Cookie: cookie }
                }).then(res => res.json()).then(res => {
                    expect(res.articles.length).toEqual(1);
                    expect(res.articles[0].pid).toEqual(article.pid);
                    expect(res.articles[0].author).toEqual(article.author);
                    expect(res.articles[0].text).toEqual(article.text);
                    expect(res.articles[0].date).toEqual(article.date);
                    if (++counter === articles.length) {
                        done();
                    }
                });
            }
        });
    });

    it('should get user 2 articles', done => {
        fetch(url(`/articles/${username}2`), {
            method: 'GET',
            headers: { Cookie: cookie }
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(1);
            expect(res.articles[0].author).toEqual(username + '2');
            expect(res.articles[0].text).toEqual(text + '3');

            let counter = 0;
            const articles = res.articles;
            for (const article of articles) {
                fetch(url(`/articles/${article.pid}`), {
                    method: 'GET',
                    headers: { Cookie: cookie }
                }).then(res => res.json()).then(res => {
                    expect(res.articles.length).toEqual(1);
                    expect(res.articles[0].pid).toEqual(article.pid);
                    expect(res.articles[0].author).toEqual(article.author);
                    expect(res.articles[0].text).toEqual(article.text);
                    expect(res.articles[0].date).toEqual(article.date);
                    if (++counter === articles.length) {
                        done();
                    }
                });
            }
        });
    });

});