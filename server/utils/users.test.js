const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }]
    });

    describe('addUser', () => {
        it('should add new user', () => {
            const users = new Users();
            const user = { id: '123', name: 'Andrew', room: 'The office fans'};

            users.addUser(user.id, user.name, user.room);

            expect(users.users).toEqual([user]);
        });
    });

    describe('removeUser', () => {
        it('should remove a user', () => {
            const userToRemove = users.users[1];
            const user = users.removeUser(userToRemove.id);

            expect(user).toEqual(userToRemove);
            expect(users.users.length).toBe(2);
        });

        it('should not remove a user for not existing user', () => {
            const user = users.removeUser('4');

            expect(user).toEqual(undefined);
            expect(users.users.length).toBe(3);
        });
    });

    describe('getUser', () => {
        it('should find user', () => {
            const userToFind = users.users[1];
            const user = users.getUser(userToFind.id);

            expect(user).toEqual(userToFind);
        });

        it('should not find a not existing user', () => {
            const user = users.getUser('4');

            expect(user).toEqual(undefined);
        });

    });

    describe('getUserList', () => {
        it('should return names for node course', () => {
            const userList = users.getUserList('Node Course');

            expect(userList).toEqual(['Mike', 'Julie']);
        });

        it('should return names for react course', () => {
            const userList = users.getUserList('React Course');

            expect(userList).toEqual(['Jen']);
        });
    });
});