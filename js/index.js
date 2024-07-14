document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const githubContainer = document.getElementById('github-container');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            await searchUsers(query);
        }
    });

    async function searchUsers(query) {
        try {
            const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const data = await response.json();
            displayUsers(data.items);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    function displayUsers(users) {
        userList.innerHTML = '';
        reposList.innerHTML = ''; // Clear previous repos list
        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.className = 'user';
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            `;
            userItem.addEventListener('click', () => fetchUserRepos(user.login));
            userList.appendChild(userItem);
        });
    }

    async function fetchUserRepos(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const data = await response.json();
            displayRepos(data);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    }

    function displayRepos(repos) {
        reposList.innerHTML = ''; // Clear previous repos list
        repos.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.className = 'repo';
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description provided'}</p>
            `;
            reposList.appendChild(repoItem);
        });
    }
});
