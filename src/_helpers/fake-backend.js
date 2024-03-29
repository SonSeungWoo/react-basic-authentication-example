export function configureFakeBackend() {
    let users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {

                    let params = JSON.parse(opts.body);

                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName
                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
                    } else {
                        reject('아이디 페스워드 오류');
                    }

                    return;
                }

                // get users
                if (url.endsWith('/users') && opts.method === 'GET') {

                    if (opts.headers && opts.headers.Authorization === `Basic ${window.btoa('test:test')}`) {
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(users)) });
                    } else {
                        resolve({ status: 401, text: () => Promise.resolve() });
                    }

                    return;
                }
                realFetch(url, opts).then(response => resolve(response));

            }, 500);
        });
    }
}